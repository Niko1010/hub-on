"""SQLite event store. Session isolation, immutable evidence, atomic run replacement."""
from contextlib import contextmanager
import json
from pathlib import Path
import sqlite3

from backend.models import Event, Session


class Store:
    def __init__(self, root: Path):
        self.root = root
        root.mkdir(parents=True, exist_ok=True)
        self.path = root / 'hubone.sqlite3'
        with self.connect() as db:
            db.executescript('''
              PRAGMA journal_mode=WAL;
              CREATE TABLE IF NOT EXISTS sessions (
                session_id TEXT PRIMARY KEY, payload TEXT NOT NULL);
              CREATE TABLE IF NOT EXISTS assets (
                asset_id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions,
                payload TEXT NOT NULL);
              CREATE TABLE IF NOT EXISTS events (
                event_id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions,
                timestamp REAL NOT NULL, source TEXT NOT NULL, run_key TEXT NOT NULL,
                payload TEXT NOT NULL);
              CREATE INDEX IF NOT EXISTS event_timeline ON events(session_id,timestamp);
              CREATE TABLE IF NOT EXISTS reports (
                session_id TEXT PRIMARY KEY REFERENCES sessions,
                payload TEXT NOT NULL);
              CREATE TABLE IF NOT EXISTS jobs (
                job_id TEXT PRIMARY KEY, session_id TEXT NOT NULL REFERENCES sessions,
                payload TEXT NOT NULL);
            ''')

    @contextmanager
    def connect(self):
        db = sqlite3.connect(self.path, timeout=30)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    def create_session(self, session: Session):
        with self.connect() as db:
            db.execute('INSERT INTO sessions VALUES (?,?)', (session.session_id, session.model_dump_json()))
        return session.model_dump()

    def session(self, sid):
        with self.connect() as db:
            row = db.execute('SELECT payload FROM sessions WHERE session_id=?', (sid,)).fetchone()
        if row is None:
            raise KeyError('Session not found')
        return json.loads(row[0])

    def sessions(self):
        with self.connect() as db:
            return [json.loads(r[0]) for r in db.execute('SELECT payload FROM sessions ORDER BY rowid DESC')]

    def update_research(self, sid, research):
        session=self.session(sid)
        session['research']=research
        with self.connect() as db:
            db.execute('UPDATE sessions SET payload=? WHERE session_id=?', (json.dumps(session,ensure_ascii=False),sid))
            db.execute('DELETE FROM reports WHERE session_id=?', (sid,))
            db.execute("DELETE FROM events WHERE session_id=? AND source='AI_analysis'", (sid,))
        return session

    def save_asset(self, asset):
        with self.connect() as db:
            db.execute('INSERT INTO assets VALUES (?,?,?)', (asset['asset_id'], asset['session_id'], json.dumps(asset)))
        return asset

    def assets(self, sid):
        with self.connect() as db:
            return [json.loads(r[0]) for r in db.execute('SELECT payload FROM assets WHERE session_id=?', (sid,))]

    def asset(self, sid, aid):
        for asset in self.assets(sid):
            if asset['asset_id'] == aid:
                return asset
        raise KeyError('Asset not found in this session')

    def events(self, sid):
        with self.connect() as db:
            return [json.loads(r[0]) for r in db.execute(
                'SELECT payload FROM events WHERE session_id=? ORDER BY timestamp,event_id', (sid,))]

    def write_events(self, sid, events: list[Event], run_key: str, replace=False):
        if any(e.session_id != sid for e in events):
            raise ValueError('cross-session event rejected')
        self.session(sid)
        with self.connect() as db:
            if run_key != 'analysis':
                db.execute("DELETE FROM events WHERE session_id=? AND source='AI_analysis'", (sid,))
            if replace:
                db.execute('DELETE FROM events WHERE session_id=? AND run_key=?', (sid, run_key))
            db.executemany('INSERT INTO events VALUES (?,?,?,?,?,?)', [
                (e.event_id, sid, e.timestamp, e.source, run_key, e.model_dump_json()) for e in events])
            # A report is a snapshot; adding/replacing observations invalidates it.
            db.execute('DELETE FROM reports WHERE session_id=?', (sid,))

    def save_report(self, sid, report):
        with self.connect() as db:
            db.execute('INSERT OR REPLACE INTO reports VALUES (?,?)', (sid, json.dumps(report, ensure_ascii=False)))

    def report(self, sid):
        with self.connect() as db:
            row = db.execute('SELECT payload FROM reports WHERE session_id=?', (sid,)).fetchone()
        return json.loads(row[0]) if row else None

    def save_job(self, job):
        with self.connect() as db:
            db.execute('INSERT OR REPLACE INTO jobs VALUES (?,?,?)', (job['job_id'], job['session_id'], json.dumps(job)))

    def job(self, sid, jid):
        with self.connect() as db:
            row = db.execute('SELECT payload FROM jobs WHERE job_id=? AND session_id=?', (jid, sid)).fetchone()
        if not row:
            raise KeyError('Job not found')
        return json.loads(row[0])

    def recover_jobs(self):
        """A process restart cannot resume an in-memory worker; expose interruption."""
        with self.connect() as db:
            for row in db.execute('SELECT payload FROM jobs').fetchall():
                job = json.loads(row[0])
                if job['status'] in ('queued', 'running'):
                    job.update(status='failed', error='服务重启中断了任务，请重新执行。')
                    db.execute('UPDATE jobs SET payload=? WHERE job_id=?', (json.dumps(job), job['job_id']))
