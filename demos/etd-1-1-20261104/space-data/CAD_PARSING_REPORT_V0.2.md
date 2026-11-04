# HUB ONE V0.2 · 观前街1号 CAD 解析报告

日期：2026-11-04。结论：**DXF 可以明确区分一层、二层，已从原始主平面导出真实几何；二层 PDF 交叉核对尚未完成，因为提供的两份 PDF 实际都是一层。** 未依据截图重绘，也未修改原始 DXF。

## 1. 原始文件与工具

原文件逐字节保存在 `space_intelligence/source/`，原始文件名、完整 SHA-256 和字节数见该目录的 `manifest.json`。

| 原文件 | 保存名称 | 大小 | SHA-256 |
|---|---|---:|---|
| A 观前街一、二层平面（白图） 2026.04.14定_t3.dxf | guanqian-original.dxf | 6,600,423 B | `7843ed6b0ba393213ddcd2bb54187acd9f41cec346702a0e6f32717c0f6b8b48` |
| 观前街一层平面.pdf | floor-1-reference.pdf | 165,912 B | `773e13e91d5ce618c0e31844f660d75bb4de0191194d59f4fd8311bd2f96f12f` |
| 观前街二层平面.pdf | floor-2-reference.pdf | 165,912 B | `d66873a5df3f3a813a4f4259b404976048e1ddd98f027323985edefb351c0872` |

解析使用 Python 3.12、ezdxf 1.4.4。PDF 参考渲染使用 PyMuPDF 1.26.6，仅用于离线核对，不是服务运行依赖。ezdxf audit 为 **0 errors / 0 fixes**；没有静默修复源图。

## 2. DXF 整体检查

| 项目 | 实际结果 |
|---|---|
| DXF 版本 | AC1027 / AutoCAD 2013 |
| 编码 | gbk |
| `$INSUNITS` | 4，毫米 |
| `$MEASUREMENT` | 1，公制 |
| `$INSBASE` | (0, 0, 0) |
| ModelSpace | 2,252 个顶层实体 |
| PaperSpace / Layout | `Model` 和 `布局1`；`布局1` 为空 |
| 图层 | 74 个，名称、颜色、线型、开关及冻结状态保留 |
| Block | 204 项，包含 Model/PaperSpace 定义 |
| ModelSpace INSERT | 22 个；递归解析楼层图块的嵌套 INSERT |

ModelSpace 原始类型：TEXT 1469、LINE 432、LWPOLYLINE 192、MTEXT 86、INSERT 22、DIMENSION 22、CIRCLE 17、HATCH 8、OLE2FRAME 2、ARC 2。**建筑的大部分几何在 INSERT 的嵌套块中，不能只导出 ModelSpace 的 LINE。**

完整 ModelSpace WCS 范围（mm）：

```text
min = (-66168.90031576745, -649931.3649809305, -7644.604933836735)
max = (679357.8653010033,  -55532.58904527454, 4711.169360057392)
```

该范围包含图框、图纸目录、说明、主平面、防火分区副本等，不能当作建筑外包尺寸或建筑高度。原始 header 范围与本次计算范围一致。完整图层、块、布局、INSERT 属性及变换清单在 `space_intelligence/data/spatial_metadata.json`。

## 3. 楼层识别与导出范围

| 项目 | 一层 | 二层 |
|---|---|---|
| floor_id | `floor_1` | `floor_2` |
| 全局楼层 spatial_id | `guanqian-1:floor_1` | `guanqian-1:floor_2` |
| 主 INSERT 句柄 | `2991` | `84F` |
| 主 Block 名称 | `A$C0ae5c80e` | `A$C6a5ca085` |
| 图内标题句柄 | `50A5` | `501A` |
| 图内标题 | 一层平面图 | 二层平面图 |
| 主 INSERT 原始位置 mm | (7039.0970, -442358.1756, 0) | (313634.3241, -442307.3362, 0) |
| 标题原始位置 mm | (83429.0141, -450394.5379, 0) | (389904.2402, -449607.6643, 0) |
| 选中 ModelSpace 实体 | 25 | 88 |
| 展开后可显示图元 | 5,842 | 6,722 |
| INSERT / DIMENSION / MLINE 容器实例 | 612 | 710 |
| 使用的原始图层 | 33 | 45 |
| 所选范围未支持图元 | 0 | 0 |

导出包含主图块、对应轴线、尺寸、北向符号、标题及相邻注释。范围由固定源文件 hash、明确标题和 INSERT 句柄共同限定，窗内实体整体保留，**不裁切实体几何**。解析器检查窗口交叉实体；遇到不在已审查排除名单中的交叉实体会报错。

已审查排除项：全图外围线 `833`；一层图纸外框 `4E29/4E2A`；二层图纸外框 `4E2B/4E2C/4E2D/4E2E`。这些保留于原 DXF，且记录在 floor selection 和 metadata 未归属清单中。它们不是建筑边界。

下方防火分区副本（如一层 `1CEC`、二层 `19AA`）未与主平面叠加。图框和工程说明、OLE2FRAME 等不属于本次楼层主地图的内容也未转换为建筑对象。原文件与全局清单仍保留它们，不能将“未选入楼层”误称为“已解析成建筑”。

包含注释的导出范围（不是建筑面积边界，单位 mm）：

```text
floor_1: X [1032.2754635734595, 156405.1213175373]
         Y [-450674.53791011, -384388.02182332106]
floor_2: X [307507.50252394873, 462880.34837791283]
         Y [-449887.66425472, -383095.5110773485]
```

## 4. PDF 视觉核对与问题

两份 PDF 各一页，页面均为约 1190.55 × 841.89 pt，均有 3311 个矢量绘制路径，文本层只可直接提取 `N`。使用相同渲染参数后，像素 SHA-256 完全相同：

```text
5b733a4b515cc765b3d981baf10089aabbc8be7886e0007cf6db57e821ce3d88
```

视觉检查两份页面底部标题都是“一层平面图”。它们的文件 hash 不同，但可见图形相同。因此不能用第二份文件名证明二层已与 PDF 核对。

一层 CAD 提取图与 PDF 的建筑轮廓、下侧弧形入口、柱网、楼梯/扶梯、电梯及“阴影区不在改造范围”标注位置一致。SVG 使用企业蓝色线条和边界填充，保留 CAD 几何；原 PDF 的黑色斜线填充、部分尺寸显示及文字样式与 Web 视图不同。没有从 PDF 添加 DXF 不存在的几何。

二层根据 DXF 的标题、独立主块、楼梯/扶梯、卫生间及建筑轮廓确定，**不是根据一层复制或推测**。二层状态为 `PENDING_CORRECT_SECOND_FLOOR_PDF`。需要补充正确二层 PDF，或由建筑负责人核对二层 DXF 主图。该待确认项已显示在页面与 API 中。

核对截图：`artifacts/cad-inspection/`；交互页面截图：`artifacts/v0.2/browser/`。

## 5. 可提取的信息及其可信边界

| 数据 | 已提取 | 语义限制 |
|---|---|---|
| 墙柱 | `Q◆01 原始墙柱`、`Q◆02 墙柱填充`、`Q◆06 墙体层`、`WALL` 等图层的线、边界、填充 | 图层混含墙与柱，尚未逐对象确认 BIM 类型 |
| 门窗 / 幕墙 | `P★04 平面门扇`、`P★05 平面门套`、`P★06 平面窗户`、`Q◆09 建筑幕墙` 等及重复门块 | 保留符号与曲线，不宣称所有门窗已语义实例化 |
| 楼梯 / 扶梯 / 栏杆 | `P★16 楼梯扶梯`、`P★13 平面栏杆` 及嵌套块 | 可查看踏步线、方向文字，不据此猜垂直高度 |
| 通道 | 可显示图纸中的通行空间、边线及原有文字 | 没有经确认的可通行区域多边形或导航拓扑 |
| 文字 / 尺寸 | Unicode 原话、位置、旋转、原始属性、DIMENSION 图块展开 | Web 字体不复现原 CAD SHX 字形和全部排版度量 |
| 圆、弧、曲线、多段线 | 原始 DXF tags、bulge 等参数 + WCS XYZ 显示路径 | SVG 使用曲线离散结果；精确参数始终保留于 JSON |
| HATCH | 原始边界、孔洞及原始 tags | Web 使用边界填充显示，不重现工程填充图案 |
| 楼层与嵌套关系 | 稳定实例 ID、parent、insert_chain、原始 block、矩阵 | 同一个门块多次插入不会合并成同一个对象 |

处理方法标记为 `RULE_BASED`，输入为 `USER_PROVIDED_CAD`，`simulated=false`。没有声称 CAD 转换来自视觉模型，也没有把图纸中的区域或摄像头数量当作已验证运营事实。

业务 zone、实际房间数量、空间高度、楼层标高、摄像头位置与在线率、客流、停留时长、动线和体验事件均未由这批 CAD 确认。相关统计为 `NOT CONNECTED`；`zones=[]` 表示尚未建立业务区域登记，不是建筑没有区域。

## 6. 数据保真、ID 与二维/三维复用

- `floor_1.json`、`floor_2.json` 是独立空间数据源；SVG 是派生视图。后端读取预构建数据，不在请求中解析 CAD。
- 每个实例的 ID 由 `building_id + floor_id + 原始句柄插入路径` 确定，包含容器链；同源文件重复构建字节一致。无随机数或导出时间参与 ID。同一实例的 `entity_id == spatial_id`，SVG 点击和未来 Three.js 的 `userData.spatial_id` 可用同一个值。
- 每个源句柄对应 `source_entities[handle]`，保存原始 DXF 属性及 tags；每个实例保留原始层、生效层、来源块、父 ID、变换链和 16 元素 row-major Matrix44（ezdxf 行向量约定）。MLINE/DIMENSION 派生线同时记录 `source_dxf_type` 与 `derived_part_index`。
- JSON 所有几何顶点保留三维 `[x,y,z]`，单位 mm。Z 来自原图，不压成 0，也不解释为实测建筑标高。SVG 仅执行 `svg_x=cad_x; svg_y=-cad_y`。
- `vertical_reference` 为楼层标高、层高、净高、楼板厚度预留字段；实体的 `dimensions_3d` 预留底标高、实体高度和拉伸量。未知值全部为 `null`、`NOT_SURVEYED`。
- CAD 两层在图纸中横向摆放，**不是已经配准的同一建筑水平坐标**。`cad_wcs_to_building_matrix44=null`，不得直接用两个图纸原点的差值当作实测配准。
- 为 Three.js 预留每层浮动渲染原点和毫米转米公式。该变换只改善渲染坐标，不赋予真实楼层高度或跨楼层对齐关系。

后续三维工作可直接消费当前 JSON 顶点、精确源参数、稳定 ID 和变换关系，不必重新提取本版 CAD 的几何；需要另行补充建筑语义、标高与配准数据。设计目标与边界详见 `docs/SPATIAL_DIGITAL_TWIN.md`。

## 7. 需要人工确认的数据

1. 正确的二层 PDF 及二层主图的工程确认。
2. 改造范围阴影的业务含义；不得直接将阴影当作禁止通行区。
3. 业务区域名称、可通行边界、区域 IDs 及其负责人确认。
4. 墙/柱分类、门窗类型、墙厚及结构高度。已有图纸尺寸保留，但不从符号自行推断缺失尺寸。
5. 各层标高、层高、净高、楼板厚度，以及跨楼层实测配准控制点。
6. 摄像头设备清单、安装坐标/高度、方向、视角、实际在线状态、视频流连接方式。
7. 摄像头图像坐标到建筑空间坐标的标定；当前 C3 的视频归一化区域不是 CAD zone。

## 8. 重建与交付文件

在项目根目录运行：

```bash
python -m space_intelligence.cad.extract
```

生成 `space_intelligence/data/{floor_1.json,floor_2.json,floor_1.svg,floor_2.svg,spatial_metadata.json}`。原文件 hash、楼层标题、图块、单位、窗口交叉实体与 audit 均校验后才输出。更换 CAD 后需重新审查楼层 manifest，解析器不会猜新文件的楼层。

复现 PDF 页面比较可在独立安装 PyMuPDF 后执行以下 Python：

```python
import fitz, hashlib
for name in ('floor-1-reference.pdf', 'floor-2-reference.pdf'):
    d = fitz.open('space_intelligence/source/' + name)
    pix = d[0].get_pixmap(matrix=fitz.Matrix(1, 1))
    print(name, d.page_count, hashlib.sha256(pix.samples).hexdigest())
```

像素相同只能证明这两个输入的可见页面相同；楼层标题仍需视觉核对，不能从不可提取的文字层假装完成自动 OCR。
