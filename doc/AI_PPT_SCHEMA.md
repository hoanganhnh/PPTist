# PPT Data Schema

> Note: This document is dedicated to AI generation, and is not a complete data definition.

Default canvas conventions:

- Logic width is fixed to `1000`
- Logic height is fixed to `562.5`
- Origin is fixed at the top-left corner of the page
- Coordinate unit is unified as logic pixels `px`
- Except for lines, elements use rectangular bounding boxes by default to represent positions and sizes.

## Coordinate System and Common Rules

### Page Coordinate System

- Page origin is top-left, i.e., `(0, 0)`
- Page bottom-right defaults to `(1000, 562.5)`
- `x` increases to the right, `y` increases downward

### Common Geometric Fields

The following rules apply to "rectangular elements" such as text, images, shapes, tables, and charts:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique element ID, globally unique, e.g., `el_title_01` |
| `left` | `number` | Yes | Bounding box top-left corner `x` coordinate when unrotated |
| `top` | `number` | Yes | Bounding box top-left corner `y` coordinate when unrotated |
| `width` | `number` | Yes | Bounding box width |
| `height` | `number` | Yes | Bounding box height |
| `rotate` | `number` | Yes | Clockwise rotation angle in degrees, usually `0` |

Note:
- The rotation center of a rectangular element is its center point.
- `left/top/width/height` always describe the bounding box before rotation.

### Shared Style Structures

#### Border `outline`

```json
{
  "style": "solid",
  "width": 2,
  "color": "#333333"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `style` | `"solid" \\| "dashed" \\| "dotted"` | Recommended | Border style |
| `width` | `number` | Recommended | Border width |
| `color` | `string` | Recommended | Border color |

#### Shadow `shadow`

```json
{
  "h": 3,
  "v": 3,
  "blur": 2,
  "color": "rgba(0,0,0,0.25)"
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `h` | `number` | Recommended | Horizontal offset |
| `v` | `number` | Recommended | Vertical offset |
| `blur` | `number` | Recommended | Blur radius |
| `color` | `string` | Recommended | Shadow color |

#### Gradient `gradient`

```json
{
  "type": "linear",
  "rotate": 0,
  "colors": [
    { "pos": 0, "color": "#F8FAFF" },
    { "pos": 100, "color": "#E8EEF9" }
  ]
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"linear" \\| "radial"` | Yes | Gradient type |
| `rotate` | `number` | Recommended | Linear gradient rotation angle |
| `colors` | `{ pos: number; color: string }[]` | Yes | Gradient color stops, `pos` ranges from 0 to 100 |

### Rich Text Content Constraints

Both text elements and shape text use HTML strings. Only the HTML tags and inline styles listed below will be recognized. **It is strictly prohibited to use any other tags or styles.**

- Block-level tags: `p`、`ul`、`ol`、`li`、`blockquote`
- Inline tags: `strong`、`em`、`u`、`strike`、`sup`、`sub`、`code`、`a`
- Inline style tags: `span`

Supported CSS properties:

- `span`：`color`、`background-color`、`font-size`、`font-family`
- `p`：`text-align`
- `ul/ol`：`list-style-type`、`font-size`、`color`

Rich text examples:

**Single-paragraph centered title**

```html
<p style="text-align:center;"><span style="font-size:32px;color:#0F172A;">Annual Business Review</span></p>
```

**Multi-paragraph body text**

```html
<p>First paragraph text content.</p>
<p>Second paragraph content, with <strong>keywords bolded</strong>.</p>
```

**Unordered list**

```html
<ul>
  <li><p>List item one</p></li>
  <li><p>List item two</p></li>
</ul>
```

> **List formatting requirement**: Inside `<li>`, content must be wrapped in a `<p>` tag, e.g., `<li><p>Content</p></li>`.

### Text Types

`title`: Title
`subtitle`: Subtitle
`content`: Body Content
`item`: List Item
`itemTitle`: List Item Title
`notes`: Speaker Notes / Annotations
`header`: Header
`footer`: Footer
`partNumber`: Section / Part Number
`itemNumber`: Item Number

### Available Fonts

> Fonts must be chosen only from the list below; if omitted, the system default font will be used.

`SourceHanSans`: Source Han Sans
`SourceHanSerif`: Source Han Serif
`WenDingPLKaiTi`: WenDing PL Kaiti
`WenDingPLSongTi`: WenDing PL Songti
`ZhuqueFangSong`: Zhuque Fangsong
`LXGWWenKai`: LXGW Wenkai
`AlibabaPuHuiTi`: Alibaba PuHuiTi
`MiSans`: MiSans
`DeYiHei`: DeYiHei
`CangerXiaowanzi`: Canger Xiaowanzi
`YousheTitleBlack`: Youshe Title Black
`FengguangMingrui`: Fengguang Mingrui
`ShetuModernSquare`: Shetu Modern Square
`ZcoolHappy`: Zcool Happy
`ZizhiQuXiMai`: Zizhi Qu XiMai
`SucaiJishiKangkang`: Sucai Jishi Kangkang
`SucaiJishiCoolSquare`: Sucai Jishi Cool Square
`TuniuRounded`: Tuniu Rounded
`RuiziZhenyan`: Ruizi Zhenyan
`SourceSerif4`: Source Serif 4
`JetBrainsMono`: JetBrains Mono
`Literata`: Literata
`Inter`: Inter
`Roboto`: Roboto
`OpenSans`: Open Sans
`Montserrat`: Montserrat
`SourceSansPro`: Source Sans Pro
`Merriweather`: Merriweather

## Slide Page

### Minimum Recommended Structure

```json
{
  "id": "slide_001",
  "background": {
    "type": "solid",
    "color": "#FFFFFF"
  },
  "elements": []
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Unique page ID |
| `background` | `object` | Recommended | Page background, includes solid color or gradient background |
| `elements` | `array` | Yes | Array of elements on this page |

#### Solid Color Background

```json
{
  "type": "solid",
  "color": "#FFFFFF"
}
```

#### Gradient Background

```json
{
  "type": "gradient",
  "gradient": {
    "type": "linear",
    "rotate": 90,
    "colors": [
      { "pos": 0, "color": "#F8FAFF" },
      { "pos": 100, "color": "#EEF2FF" }
    ]
  }
}
```

Background field descriptions:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"solid" \\| "gradient"` | Yes | Background type |
| `color` | `string` | Yes for `solid` | Solid background color |
| `gradient` | `Gradient` | Yes for `gradient` | Gradient background configuration |

## Text Element `text`

### Minimum Recommended Structure

```json
{
  "type": "text",
  "id": "el_title_01",
  "left": 72,
  "top": 54,
  "width": 856,
  "height": 72,
  "rotate": 0,
  "content": "<p><strong>Annual Business Analysis</strong></p>",
  "defaultFontName": "SourceHanSans",
  "defaultColor": "#1F2937"
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"text"` | Yes | Element type |
| `content` | `string` | Yes | Rich text HTML content |
| `defaultFontName` | `string` | Yes | Default font, used if not overridden by inline style |
| `defaultColor` | `string` | Yes | Default text color, used if not overridden by inline style |
| `fill` | `string` | Optional | Textbox background fill color |
| `outline` | `object` | Optional | Textbox border outline |
| `lineHeight` | `number` | Recommended | Line height multiplier, default approx `1.5` |
| `wordSpace` | `number` | Optional | Character spacing in px |
| `opacity` | `number` | Optional | Opacity, `0~1` |
| `shadow` | `object` | Optional | Textbox shadow |
| `textType` | `string` | Optional | Text type |

## Image Element `image`

### Minimum Recommended Structure

```json
{
  "type": "image",
  "id": "el_image_01",
  "left": 650,
  "top": 126,
  "width": 278,
  "height": 182,
  "rotate": 0,
  "src": "https://images.pexels.com/photos/730670/pexels-photo-730670.jpeg",
  "description": "Dark blue business office scene, an Asian woman standing in front of a glass whiteboard explaining a growth curve, clean lighting, 16:9 composition"
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"image"` | Yes | Element type |
| `src` | `string` | Yes | Image resource URL |
| `description` | `string` | Yes | Description prompt for generating image via AI models |
| `outline` | `object` | Optional | Image border outline |
| `filters` | `object` | Optional | Image filters |
| `clip` | `object` | Optional | Image crop clip properties |
| `shadow` | `object` | Optional | Shadow |
| `radius` | `number` | Optional | Corner radius, mainly for rectangular cropping |
| `colorMask` | `string` | Optional | Color mask overlay |

### Image Filters `filters`

Example:

```json
{
  "brightness": "108%",
  "contrast": "105%",
  "saturate": "92%",
  "opacity": "92%"
}
```

Supported fields:

| Field | Type | Description |
| --- | --- | --- |
| `blur` | `string` | e.g. `"2px"` |
| `brightness` | `string` | e.g. `"110%"` |
| `contrast` | `string` | e.g. `"105%"` |
| `grayscale` | `string` | e.g. `"100%"` |
| `saturate` | `string` | e.g. `"80%"` |
| `hue-rotate` | `string` | e.g. `"90deg"` |
| `sepia` | `string` | e.g. `"60%"` |
| `invert` | `string` | e.g. `"100%"` |
| `opacity` | `string` | e.g. `"70%"` |

### Image Clipping/Cropping `clip`

Example:

```json
{
  "shape": "roundRect",
  "range": [[5, 5], [95, 95]]
}
```

Field Descriptions:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `shape` | `string` | Recommended | Crop shape key |
| `range` | `[[number, number], [number, number]]` | Yes | Percentage range for original image crop interval |

`range` details:

- `[[x1, y1], [x2, y2]]`
- Bounded by image percentage from `0` to `100`
- `[[10, 10], [90, 90]]` represents cropping the center 80% region of the image

Available `shape` keys:

- `rect`
- `roundRect`
- `ellipse`
- `triangle`
- `diamond`
- `pentagon`
- `hexagon`

## Shape Element `shape`

### Minimum Recommended Structure

```json
{
  "type": "shape",
  "id": "el_shape_01",
  "left": 72,
  "top": 140,
  "width": 240,
  "height": 52,
  "rotate": 0,
  "viewBox": [1000, 1000],
  "path": "M80 0 L920 0 Q1000 0 1000 80 L1000 920 Q1000 1000 920 1000 L80 1000 Q0 1000 0 920 L0 80 Q0 0 80 0 Z",
  "fill": "#E8F0FF"
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"shape"` | Yes | Element type |
| `viewBox` | `[number, number]` | Yes | Path coordinate system size, e.g. `[1000, 1000]` |
| `path` | `string` | Yes | SVG path `d` string |
| `fill` | `string` | Yes | Fill color; overridden by `gradient` if present |
| `gradient` | `object` | Optional | Gradient fill |
| `outline` | `object` | Optional | Shape outline border |
| `opacity` | `number` | Optional | Opacity, `0~1` |
| `shadow` | `object` | Optional | Shadow |
| `text` | `object` | Optional | Text content inside shape |

### `path` Drawing Standards

- Only standard SVG path commands are supported: `M`, `L`, `Q`, `C`, `A`, `Z`
- Path coordinates are drawn within the `viewBox` system; we recommend using `[1000, 1000]` consistently

### Text inside Shape `text`

Example:

```json
{
  "content": "<p><strong>Core Conclusion</strong></p>",
  "defaultFontName": "SourceHanSans",
  "defaultColor": "#1D4ED8",
  "align": "middle",
  "lineHeight": 1.4,
  "wordSpace": 0,
}
```

Field Descriptions:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `content` | `string` | Yes | Rich text HTML content |
| `defaultFontName` | `string` | Yes | Default font |
| `defaultColor` | `string` | Yes | Default text color |
| `align` | `"top" \\| "middle" \\| "bottom"` | Yes | Vertical alignment of text inside the shape |
| `lineHeight` | `number` | Recommended | Line height multiplier |
| `wordSpace` | `number` | Optional | Character spacing |
| `type` | `string` | Optional | Text type |

## Line Element `line`

### Minimum Recommended Structure

```json
{
  "type": "line",
  "id": "el_line_01",
  "left": 72,
  "top": 230,
  "start": [0, 0],
  "end": [420, 0],
  "width": 2,
  "style": "solid",
  "color": "#CBD5E1",
  "points": ["", ""]
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"line"` | Yes | Element type |
| `id` | `string` | Yes | Element ID |
| `left` | `number` | Yes | Line local coordinate system top-left corner x offset |
| `top` | `number` | Yes | Line local coordinate system top-left corner y offset |
| `start` | `[number, number]` | Yes | Start point coordinates, relative to `left`/`top` |
| `end` | `[number, number]` | Yes | End point coordinates, relative to `left`/`top` |
| `width` | `number` | Yes | Line width stroke thickness (not bounding box width) |
| `style` | `"solid" \\| "dashed" \\| "dotted"` | Yes | Line style |
| `color` | `string` | Yes | Line color |
| `points` | `["" \\| "arrow" \\| "dot", "" \\| "arrow" \\| "dot"]` | Yes | Endpoints decorative markers style |
| `shadow` | `object` | Optional | Shadow |

### Key Differences Between Line and Other Elements

- Has no `height` attribute
- Has no `rotate` angle attribute
- `width` represents line stroke thickness, not geometric bounding box width
- Line direction is fully determined by `start` and `end` point offsets
- `left`/`top` simply acts as the coordinate origin anchor for the line

## Table Element `table`

### Minimum Recommended Structure

```json
{
  "type": "table",
  "id": "el_table_01",
  "left": 72,
  "top": 290,
  "width": 420,
  "height": 180,
  "rotate": 0,
  "outline": {
    "width": 1,
    "style": "solid",
    "color": "#D1D5DB"
  },
  "colWidths": [0.3, 0.35, 0.35],
  "cellMinHeight": 45,
  "data": [
    [
      { "id": "c_1_1", "colspan": 1, "rowspan": 1, "text": "Region" },
      { "id": "c_1_2", "colspan": 1, "rowspan": 1, "text": "Revenue" },
      { "id": "c_1_3", "colspan": 1, "rowspan": 1, "text": "YoY" }
    ],
    [
      { "id": "c_2_1", "colspan": 1, "rowspan": 1, "text": "East China" },
      { "id": "c_2_2", "colspan": 1, "rowspan": 1, "text": "32 Million" },
      { "id": "c_2_3", "colspan": 1, "rowspan": 1, "text": "+18%" }
    ]
  ]
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"table"` | Yes | Element type |
| `outline` | `object` | Yes | Table outline border |
| `theme` | `object` | Optional | Table theme colors and row/column indicators |
| `colWidths` | `number[]` | Yes | Relative column widths ratios (sum must equal `1.0`) |
| `cellMinHeight` | `number` | Yes | Minimum height threshold for rows |
| `data` | `TableCell[][]` | Yes | 2D cell data matrix |

### Table Cell `TableCell`

```json
{
  "id": "c_1_1",
  "colspan": 1,
  "rowspan": 1,
  "text": "Region",
  "style": {
    "bold": true,
    "color": "#111827",
    "backcolor": "#F3F4F6",
    "fontsize": "14px",
    "fontname": "SourceHanSans",
    "align": "center",
    "vAlign": "middle"
  }
}
```

Field Descriptions:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | Yes | Cell ID |
| `colspan` | `number` | Yes | Columns spanned count, defaults to `1` |
| `rowspan` | `number` | Yes | Rows spanned count, defaults to `1` |
| `text` | `string` | Yes | Plain text content |
| `style` | `object` | Optional | Cell formatting style |

### Cell Styles `style`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `bold` | `boolean` | Optional | Bold font |
| `em` | `boolean` | Optional | Italic font |
| `underline` | `boolean` | Optional | Underlined text |
| `strikethrough` | `boolean` | Optional | Strikethrough text |
| `color` | `string` | Optional | Text color |
| `backcolor` | `string` | Optional | Cell background color |
| `fontsize` | `string` | Optional | Font size, e.g. `"14px"` |
| `fontname` | `string` | Optional | Font family name |
| `align` | `"left" \\| "center" \\| "right" \\| "justify"` | Optional | Horizontal alignment |
| `vAlign` | `"top" \\| "middle" \\| "bottom"` | Optional | Vertical alignment |

### Table Theme `theme`

```json
{
  "color": "#3B82F6",
  "rowHeader": true,
  "rowFooter": false,
  "colHeader": false,
  "colFooter": false
}
```

Description:

- `color` is the primary theme color
- `rowHeader` flags if the first row is styled as the header
- `rowFooter` flags if the last row is styled as the footer/total row
- `colHeader` flags if the first column is styled as a header column
- `colFooter` flags if the last column is styled as a footer column

## Chart Element `chart`

### Minimum Recommended Structure

```json
{
  "type": "chart",
  "id": "el_chart_01",
  "left": 528,
  "top": 290,
  "width": 400,
  "height": 220,
  "rotate": 0,
  "chartType": "column",
  "data": {
    "labels": ["Q1", "Q2", "Q3", "Q4"],
    "legends": ["Revenue"],
    "series": [[120, 150, 180, 210]]
  },
  "themeColors": ["#3B82F6", "#93C5FD"],
  "textColor": "#475569",
  "lineColor": "#E2E8F0"
}
```

### Field Descriptions

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `type` | `"chart"` | Yes | Element type |
| `fill` | `string` | Optional | Chart container background fill color |
| `chartType` | `"bar" \\| "column" \\| "line" \\| "pie" \\| "ring" \\| "area" \\| "radar" \\| "scatter"` | Yes | Chart type |
| `data` | `object` | Yes | Chart data payload |
| `themeColors` | `string[]` | Yes | Series theme colors, at least 1 color |
| `textColor` | `string` | Optional | Text color for labels, axis, and legends |
| `lineColor` | `string` | Optional | Gridlines or radar axis lines color |

### Data Structure `data`

```json
{
  "labels": ["Q1", "Q2", "Q3", "Q4"],
  "legends": ["Revenue", "Profit"],
  "series": [
    [120, 150, 180, 210],
    [25, 28, 33, 41]
  ]
}
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `labels` | `string[]` | Yes | Category labels |
| `legends` | `string[]` | Recommended | Series names |
| `series` | `number[][]` | Yes | 2D data series array |

### Data Constraints

#### Column / Bar / Line / Area Charts

- `labels.length` must equal each series array length `series[i].length`
- `legends.length` must equal the number of series `series.length`

#### Pie / Ring (Donut) Charts

- Uses only `series[0]`
- `series[0].length` must equal `labels.length`
- `labels` represent sector/slice names
- `legends` can be a single series name, or match `labels`, but rendering depends mainly on `labels`

#### Radar Charts

- `labels` represent radar axis dimension names
- `series[i].length` must equal `labels.length`
- `legends.length` must equal the number of series `series.length`

#### Scatter Charts

- `series[0]` is treated as `x` data points
- `series[1]` is treated as `y` data

## Comprehensive Sample Data

```json
{
  "id": "slide_business_review_01",
  "background": {
    "type": "gradient",
    "gradient": {
      "type": "linear",
      "rotate": 0,
      "colors": [
        { "pos": 0, "color": "#F8FBFF" },
        { "pos": 100, "color": "#EEF4FF" }
      ]
    }
  },
  "elements": [
    {
      "type": "text",
      "id": "el_title_01",
      "left": 72,
      "top": 56,
      "width": 856,
      "height": 72,
      "rotate": 0,
      "content": "<p><strong>Q1 2026 Revenue Structure Analysis</strong></p>",
      "defaultFontName": "SourceHanSans",
      "defaultColor": "#0F172A",
      "lineHeight": 1.2,
      "paragraphSpace": 5
    },
    {
      "type": "text",
      "id": "el_summary_01",
      "left": 72,
      "top": 142,
      "width": 856,
      "height": 96,
      "rotate": 0,
      "content": "<p>This page displays the revenue structure for Q1 2026. Overall, <strong>Enterprise Services</strong> remain the main revenue source, while education training and subscription services provide stable supplements, with other businesses representing relatively small shares.</p>",
      "defaultFontName": "SourceHanSans",
      "defaultColor": "#334155",
      "lineHeight": 1.5,
      "paragraphSpace": 8
    },
    {
      "type": "chart",
      "id": "el_chart_01",
      "left": 235,
      "top": 260,
      "width": 530,
      "height": 250,
      "rotate": 0,
      "fill": "#FFFFFF",
      "chartType": "pie",
      "data": {
        "labels": ["Enterprise Services", "Education & Training", "Subscription Services", "Other"],
        "legends": ["Revenue Share"],
        "series": [
          [46, 24, 18, 12]
        ]
      },
      "outline": {
        "width": 1,
        "style": "solid",
        "color": "#E2E8F0"
      },
      "themeColors": ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE"],
      "textColor": "#475569",
      "lineColor": "#E2E8F0"
    }
  ]
}
```