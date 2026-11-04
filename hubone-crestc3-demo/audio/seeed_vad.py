# Adapted from Seeed-Projects/Lab-Prooject-RK realtime_pipeline.py
# Apache-2.0. See third_party/SEEED-LICENSE and THIRD_PARTY_NOTICES.md.
import numpy as np
import onnxruntime as ort
SAMPLE_RATE = 16000
WINDOW = 512

class StreamingVad:
    def __init__(self, model_path, threshold=0.5, min_silence_ms=500, min_speech_ms=500,
                 max_speech_s=12.0, speech_pad_ms=200):
        so = ort.SessionOptions()
        so.intra_op_num_threads = 1
        so.inter_op_num_threads = 1
        self.session = ort.InferenceSession(model_path, sess_options=so,
                                            providers=["CPUExecutionProvider"])
        self.state = np.zeros((2, 1, 128), dtype=np.float32)
        self.sr_arr = np.array(SAMPLE_RATE, dtype=np.int64)
        self.threshold = threshold
        self.win_s = WINDOW / SAMPLE_RATE
        self.min_silence_w = max(1, int(min_silence_ms / 1000 / self.win_s))
        self.min_speech_w = max(1, int(min_speech_ms / 1000 / self.win_s))
        self.max_speech_w = int(max_speech_s / self.win_s)
        self.pad_samples = int(speech_pad_ms / 1000 * SAMPLE_RATE)
        self.in_speech = False
        self.cur_start_w = 0
        self.speech_w = 0
        self.silence_w = 0

    def prob(self, chunk_f32: np.ndarray) -> float:
        out, self.state = self.session.run(None, {
            "input": chunk_f32[np.newaxis].astype(np.float32),
            "state": self.state, "sr": self.sr_arr})
        return float(np.asarray(out).ravel()[0])

    def process_window(self, win_idx: int, prob: float):
        """返回需要 finalize 的区域列表 [(start_s, end_s), ...]"""
        out = []
        if not self.in_speech:
            if prob >= self.threshold:
                self.in_speech = True
                self.cur_start_w = win_idx
                self.speech_w, self.silence_w = 1, 0
            return out
        if prob >= self.threshold:
            self.speech_w += 1
            self.silence_w = 0
        else:
            self.silence_w += 1
        length_w = win_idx - self.cur_start_w + 1
        if length_w >= self.max_speech_w:
            out.append(self._region(win_idx + 1))
            self.in_speech = False
            return out
        if self.silence_w >= self.min_silence_w:
            if self.speech_w >= self.min_speech_w:
                out.append(self._region(win_idx - self.silence_w + 1))
            self.in_speech = False
        return out

    def flush(self, total_windows: int):
        if self.in_speech and self.speech_w >= self.min_speech_w:
            return [self._region(total_windows)]
        return []

    def _region(self, end_w):
        return (self.cur_start_w * self.win_s, end_w * self.win_s)

