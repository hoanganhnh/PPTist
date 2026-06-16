export const enum ShapePathFormulasKeys {
  ROUND_RECT = 'roundRect',
  ROUND_RECT_DIAGONAL = 'roundRectDiagonal',
  ROUND_RECT_SINGLE = 'roundRectSingle',
  ROUND_RECT_SAMESIDE = 'roundRectSameSide',
  CUT_RECT_DIAGONAL = 'cutRectDiagonal',
  CUT_RECT_SINGLE = 'cutRectSingle',
  CUT_RECT_SAMESIDE = 'cutRectSameSide',
  CUT_ROUND_RECT = 'cutRoundRect',
  MESSAGE = 'message',
  ROUND_MESSAGE = 'roundMessage',
  L = 'L',
  RING_RECT = 'ringRect',
  PLUS = 'plus',
  TRIANGLE = 'triangle',
  PARALLELOGRAM_LEFT = 'parallelogramLeft',
  PARALLELOGRAM_RIGHT = 'parallelogramRight',
  TRAPEZOID = 'trapezoid',
  BULLET = 'bullet',
  INDICATOR = 'indicator',
  DONUT = 'donut',
  DIAGSTRIPE = 'diagStripe',
}

export const enum ElementTypes {
  TEXT = 'text',
  IMAGE = 'image',
  SHAPE = 'shape',
  LINE = 'line',
  CHART = 'chart',
  TABLE = 'table',
  LATEX = 'latex',
  VIDEO = 'video',
  AUDIO = 'audio',
}

/**
 * Gradient
 * 
 * type: Gradient type (radial, linear)
 * 
 * colors: Gradient color list (pos: percentage position; color: color)
 * 
 * rotate: Gradient angle (linear gradient)
 */
export type GradientType = 'linear' | 'radial'
export type GradientColor = {
  pos: number
  color: string
}
export interface Gradient {
  type: GradientType
  colors: GradientColor[]
  rotate: number
}

export type LineStyleType = 'solid' | 'dashed' | 'dotted'

/**
 * Element shadow
 * 
 * h: Horizontal offset
 * 
 * v: Vertical offset
 * 
 * blur: Blur Amount
 * 
 * color: Shadow Color
 */
export interface PPTElementShadow {
  h: number
  v: number
  blur: number
  color: string
}

/**
 * Element border
 * 
 * style?: Border style (solid or dashed)
 * 
 * width?: BorderWidth
 * 
 * color?: Border Color
 */
export interface PPTElementOutline {
  style?: LineStyleType
  width?: number
  color?: string
}

export type ElementLinkType = 'web' | 'slide'

/**
 * Element hyperlink
 * 
 * type: Link type (web, slide page)
 * 
 * target: Target destination (web link, slide page ID)
 */
export interface PPTElementLink {
  type: ElementLinkType
  target: string
}

export type TextAlign = 'left' | 'center' | 'right' | 'justify'

export type TextAlignVertical = 'top' | 'middle' | 'bottom' 


/**
 * Element general properties
 * 
 * id: Element ID
 * 
 * left: Element horizontal position (distance from the canvas left edge)
 * 
 * top: Element vertical position (distance from the canvas top edge)
 * 
 * lock?: Lock element
 * 
 * groupId?: Group ID (elements with the same Group ID belong to the same group)
 * 
 * width: Element width
 * 
 * height: Element height
 * 
 * rotate: Rotation angle
 * 
 * link?: Hyperlink
 * 
 * name?: Element name
 */
interface PPTBaseElement {
  id: string
  left: number
  top: number
  lock?: boolean
  groupId?: string
  width: number
  height: number
  rotate: number
  link?: PPTElementLink
  name?: string
}


export type TextType = 'title' | 'subtitle' | 'content' | 'item' | 'itemTitle' | 'notes' | 'header' | 'footer' | 'partNumber' | 'itemNumber'
export type TextInset = [number, number, number, number]

/**
 * Text element
 * 
 * type: Element type (text)
 * 
 * content: Text content (HTML string)
 * 
 * defaultFontName: Default font (will be overridden by HTML inline styles in the text content)
 * 
 * defaultColor: Default color (will be overridden by HTML inline styles in the text content)
 * 
 * outline?: Border
 * 
 * fill?: Fill color
 * 
 * lineHeight?: Line height (multiplier), default 1.5
 * 
 * wordSpace?: Letter spacing, default 0
 * 
 * opacity?: Opacity, default 1
 * 
 * shadow?: Shadow
 * 
 * paragraphSpace?: Paragraph spacing, default 5px
 * 
 * vertical?: Vertical text
 * 
 * textType?: TextType
 * 
 * inset?: Padding (top, right, bottom, left), default [10, 10, 10, 10]
 */
export interface PPTTextElement extends PPTBaseElement {
  type: 'text'
  content: string
  defaultFontName: string
  defaultColor: string
  outline?: PPTElementOutline
  fill?: string
  lineHeight?: number
  wordSpace?: number
  opacity?: number
  shadow?: PPTElementShadow
  paragraphSpace?: number
  vertical?: boolean
  textType?: TextType
  inset?: TextInset
}


/**
 * Image Flip、Shape Flip
 * 
 * flipH?: Flip Horizontal
 * 
 * flipV?: Flip Vertical
 */
export interface ImageOrShapeFlip {
  flipH?: boolean
  flipV?: boolean
}

/**
 * Image filter
 * 
 * https://developer.mozilla.org/en-US/docs/Web/CSS/filter
 * 
 * 'blur'?: Blur, default 0 (px)
 * 
 * 'brightness'?: Brightness, default 100 (%)
 * 
 * 'contrast'?: Contrast, default 100 (%)
 * 
 * 'grayscale'?: Grayscale, default 0 (%)
 * 
 * 'saturate'?: Saturation, default 100 (%)
 * 
 * 'hue-rotate'?: Hue rotate, default 0 (deg)
 * 
 * 'opacity'?: Opacity, default 100 (%)
 */
export type ImageElementFilterKeys = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'saturate' | 'hue-rotate' | 'opacity' | 'sepia' | 'invert'
export interface ImageElementFilters {
  'blur'?: string
  'brightness'?: string
  'contrast'?: string
  'grayscale'?: string
  'saturate'?: string
  'hue-rotate'?: string
  'sepia'?: string
  'invert'?: string
  'opacity'?: string
}

export type ImageClipDataRange = [[number, number], [number, number]]

/**
 * Image Crop
 * 
 * range: Crop range, e.g., [[10, 10], [90, 90]] represents cropping the image from top-left 10%, 10% to 90%, 90%
 * 
 * shape: Crop shape, see CLIPPATHS in configs/imageClip.ts
 */
export interface ImageElementClip {
  range: ImageClipDataRange
  shape: string
}

export type ImageType = 'pageFigure' | 'itemFigure' | 'background'

/**
 * Image element
 * 
 * type: Element type (image)
 * 
 * fixedRatio: Lock image aspect ratio
 * 
 * src: Image source URL
 * 
 * outline?: Border
 * 
 * filters?: Image filters
 * 
 * clip?: Crop information
 * 
 * flipH?: Flip horizontal
 * 
 * flipV?: Flip vertical
 * 
 * shadow?: Shadow
 * 
 * radius?: Corner radius
 * 
 * colorMask?: Color mask
 * 
 * imageType?: ImageType
 */
export interface PPTImageElement extends PPTBaseElement {
  type: 'image'
  fixedRatio: boolean
  src: string
  outline?: PPTElementOutline
  filters?: ImageElementFilters
  clip?: ImageElementClip
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  radius?: number
  colorMask?: string
  imageType?: ImageType
}

/**
 * Text inside shape
 * 
 * content: Text content (HTML string)
 * 
 * defaultFontName: Default font (will be overridden by HTML inline styles in the text content)
 * 
 * defaultColor: Default color (will be overridden by HTML inline styles in the text content)
 * 
 * align: Text alignment (vertical direction)
 * 
 * lineHeight?: Line height (multiplier), default 1.5
 * 
 * wordSpace?: Letter spacing, default 0
 * 
 * paragraphSpace?: Paragraph spacing, default 5px
 * 
 * type: TextType
 * 
 * inset?: Text padding (top, right, bottom, left), default [10, 10, 10, 10]
 */
export interface ShapeText {
  content: string
  defaultFontName: string
  defaultColor: string
  align: TextAlignVertical
  lineHeight?: number
  wordSpace?: number
  paragraphSpace?: number
  inset?: TextInset
  type?: TextType
}

/**
 * Shape element
 * 
 * type: Element type (shape)
 * 
 * viewBox: SVG viewBox attribute, e.g., [1000, 1000] represents '0 0 1000 1000'
 * 
 * path: Shape path (d attribute of SVG path)
 * 
 * fixedRatio: Lock shape aspect ratio
 * 
 * fill: Fill color, used when gradient is absent
 * 
 * gradient?: Gradient, takes precedence over solid fill if present
 * 
 * pattern?: Pattern, takes precedence over solid fill if present
 * 
 * outline?: Border
 * 
 * opacity?: Opacity
 * 
 * flipH?: Flip horizontal
 * 
 * flipV?: Flip vertical
 * 
 * shadow?: Shadow
 * 
 * special?: Special shape (flags complex shapes that are hard to parse; they will be exported as images)
 * 
 * text?: Text inside shape
 * 
 * pathFormula?: LaTeX formula for shape path calculation
 * Generally, when a shape changes size, only its width and height are scaled based on viewBox, while the viewBox and path itself do not change.
 * However, some shapes need precise control over keypoints. For these, a path calculation formula is provided to recalculate path on resize.
 * 
 * keypoints?: Keypoints position percentages
 */
export interface PPTShapeElement extends PPTBaseElement {
  type: 'shape'
  viewBox: [number, number]
  path: string
  fixedRatio: boolean
  fill: string
  gradient?: Gradient
  pattern?: string
  outline?: PPTElementOutline
  opacity?: number
  flipH?: boolean
  flipV?: boolean
  shadow?: PPTElementShadow
  special?: boolean
  text?: ShapeText
  pathFormula?: ShapePathFormulasKeys
  keypoints?: number[]
}


export type LinePoint = '' | 'arrow' | 'dot' 
export type Broken2LineDirection = 'horizontal' | 'vertical'

/**
 * Line element
 * 
 * type: Element type (line)
 * 
 * start: Start point position ([x, y])
 * 
 * end: End point position ([x, y])
 * 
 * style: Line style (solid, dashed, dotted)
 * 
 * color: Line color
 * 
 * points: End point styles ([start style, end style], options: none, arrow, dot)
 * 
 * shadow?: Shadow
 * 
 * broken: Polyline control point ([x, y])
 * 
 * broken2: Double-polyline control point ([x, y])
 * 
 * broken2Direction: Double-polyline direction
 * 
 * curve: Quadratic curve control point ([x, y])
 * 
 * cubic: Cubic curve control points ([[x1, y1], [x2, y2]])
 */
export interface PPTLineElement extends Omit<PPTBaseElement, 'height' | 'rotate'> {
  type: 'line'
  start: [number, number]
  end: [number, number]
  style: LineStyleType
  color: string
  points: [LinePoint, LinePoint]
  shadow?: PPTElementShadow
  broken?: [number, number]
  broken2?: [number, number]
  broken2Direction?: Broken2LineDirection
  curve?: [number, number]
  cubic?: [[number, number], [number, number]]
}


export type ChartType = 'bar' | 'column' | 'line' | 'pie' | 'ring' | 'area' | 'radar' | 'scatter'

export interface ChartOptions {
  lineSmooth?: boolean
  stack?: boolean
}

export interface ChartData {
  labels: string[]
  legends: string[]
  series: number[][]
}

/**
 * Chart element
 * 
 * type: Element type (chart)
 * 
 * fill?: Fill color
 * 
 * chartType: Chart base type (bar/line/pie), all chart types are derived from these three basic types
 * 
 * data: Chart data
 * 
 * options: Extended options
 * 
 * outline?: Border
 * 
 * themeColors: Theme colors
 * 
 * textColor?: Point and text color
 * 
 * lineColor?: Grid line color
 */
export interface PPTChartElement extends PPTBaseElement {
  type: 'chart'
  fill?: string
  chartType: ChartType
  data: ChartData
  options?: ChartOptions
  outline?: PPTElementOutline
  themeColors: string[]
  textColor?: string
  lineColor?: string
}


/**
 * Table cell style
 * 
 * bold?: Bold
 * 
 * em?: Italic
 * 
 * underline?: Underline
 * 
 * strikethrough?: Strikethrough
 * 
 * color?: Font color
 * 
 * backcolor?: Fill color
 * 
 * fontsize?: Font size
 * 
 * fontname?: Font name
 * 
 * align?: Alignment
 */
export interface TableCellStyle {
  bold?: boolean
  em?: boolean
  underline?: boolean
  strikethrough?: boolean
  color?: string
  backcolor?: string
  fontsize?: string
  fontname?: string
  align?: TextAlign
  vAlign?: TextAlignVertical
}


/**
 * Table cell
 * 
 * id: Cell ID
 * 
 * colspan: Column span (merged columns)
 * 
 * rowspan: Row span (merged rows)
 * 
 * text: Text content
 * 
 * style?: Cell style
 */
export interface TableCell {
  id: string
  colspan: number
  rowspan: number
  text: string
  style?: TableCellStyle
}

/**
 * TableTheme
 * 
 * color: Theme Color
 * 
 * rowHeader: Header Row
 * 
 * rowFooter: Summary Row
 * 
 * colHeader: First Column
 * 
 * colFooter: Last Column
 */
export interface TableTheme {
  color: string
  rowHeader: boolean
  rowFooter: boolean
  colHeader: boolean
  colFooter: boolean
}

/**
 * Table element
 * 
 * type: Element type (table)
 * 
 * outline: Border
 * 
 * theme?: Theme
 * 
 * colWidths: Column widths array, e.g., [0.3, 0.5, 0.2] represents three columns taking up 30%, 50%, and 20% of the total width
 * 
 * cellMinHeight: Minimum cell height
 * 
 * data: Table data
 */
export interface PPTTableElement extends PPTBaseElement {
  type: 'table'
  outline: PPTElementOutline
  theme?: TableTheme
  colWidths: number[]
  cellMinHeight: number
  data: TableCell[][]
}


/**
 * LaTeX element (LaTeX)
 * 
 * type: Element type (latex)
 * 
 * latex: LaTeX code
 * 
 * path: SVG path d attribute
 * 
 * color: Color
 * 
 * strokeWidth: Path stroke width
 * 
 * viewBox: SVG viewBox attribute
 * 
 * fixedRatio: Lock shape aspect ratio
 */
export interface PPTLatexElement extends PPTBaseElement {
  type: 'latex'
  latex: string
  path: string
  color: string
  strokeWidth: number
  viewBox: [number, number]
  fixedRatio: boolean
}

/**
 * Video element
 * 
 * type: Element type (video)
 * 
 * src: Video URL
 * 
 * autoplay: Auto play
 * 
 * poster: Preview cover
 * 
 * ext: Video file extension, used to confirm resource type if URL lacks extension
 */
export interface PPTVideoElement extends PPTBaseElement {
  type: 'video'
  src: string
  autoplay: boolean
  poster?: string
  ext?: string
}

/**
 * Audio element
 * 
 * type: Element type (audio)
 * 
 * fixedRatio: Lock icon aspect ratio
 * 
 * color: Icon color
 * 
 * loop: Loop play
 * 
 * autoplay: Auto play
 * 
 * src: Audio URL
 * 
 * ext: Audio file extension, used to confirm resource type if URL lacks extension
 */
export interface PPTAudioElement extends PPTBaseElement {
  type: 'audio'
  fixedRatio: boolean
  color: string
  loop: boolean
  autoplay: boolean
  src: string
  ext?: string
}


export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement

export type AnimationType = 'in' | 'out' | 'attention'
export type AnimationTrigger = 'click' | 'meantime' | 'auto'

/**
 * Element animation
 * 
 * id: Animation ID
 * 
 * elId: Element ID
 * 
 * effect: Animation effect
 * 
 * type: Animation type (entrance, exit, attention)
 * 
 * duration: Animation duration
 * 
 * trigger: Animation trigger mode (click - on click, meantime - with previous, auto - after previous)
 */
export interface PPTAnimation {
  id: string
  elId: string
  effect: string
  type: AnimationType
  duration: number
  trigger: AnimationTrigger
}

export type SlideBackgroundType = 'solid' | 'image' | 'gradient'
export type SlideBackgroundImageSize = 'cover' | 'contain' | 'repeat'
export interface SlideBackgroundImage {
  src: string
  size: SlideBackgroundImageSize,
}

/**
 * Slide background
 * 
 * type: Background type (solid color, image, gradient)
 * 
 * color?: Background color (solid color)
 * 
 * image?: Image background
 * 
 * gradient?: Gradient background
 */
export interface SlideBackground {
  type: SlideBackgroundType
  color?: string
  image?: SlideBackgroundImage
  gradient?: Gradient
}


export type TurningMode = 'no' | 'fade' | 'slideX' | 'slideY' | 'random' | 'slideX3D' | 'slideY3D' | 'rotate' | 'scaleY' | 'scaleX' | 'scale' | 'scaleReverse'

export interface NoteReply {
  id: string
  content: string
  time: number
  user: string
}

export interface Note {
  id: string
  content: string
  time: number
  user: string
  elId?: string
  replies?: NoteReply[]
}

export interface SectionTag {
  id: string
  title?: string
}

export type SlideType = 'cover' | 'contents' | 'transition' | 'content' | 'end'

/**
 * Slide page
 * 
 * id: Slide ID
 * 
 * elements: Collection of elements
 * 
 * notes?: Annotations / Remarks
 * 
 * remark?: Notes
 * 
 * background?: Slide background
 * 
 * animations?: Collection of element animations
 * 
 * turningMode?: Slide transition mode
 * 
 * slideType?: SlideType
 */
export interface Slide {
  id: string
  elements: PPTElement[]
  notes?: Note[]
  remark?: string
  background?: SlideBackground
  animations?: PPTAnimation[]
  turningMode?: TurningMode
  sectionTag?: SectionTag
  type?: SlideType
}

/**
 * SlideTheme
 * 
 * backgroundColor: Slide background color
 * 
 * themeColor: Theme color, used for default shape colors, etc.
 * 
 * fontColor: Font color
 * 
 * fontName: Font name
 */
export interface SlideTheme {
  backgroundColor: string
  themeColors: string[]
  fontColor: string
  fontName: string
  outline: PPTElementOutline
  shadow: PPTElementShadow
}

export interface SlideTemplate {
  name: string
  id: string
  cover: string
  origin?: string
}
