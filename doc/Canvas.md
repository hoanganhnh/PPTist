## Canvas & Elements

#### Basic Structure of the Editor
```
└── Editor
    ├── Top Menu Bar
    ├── Left Navigation Bar (Thumbnails)
    ├── Right Side Panels (Formatting, Animation, etc.)
    ├── Top-middle Insertion/Tool Bar
    ├── Bottom Speaker Notes Panel
    └── Canvas
         ├── Viewport
         │    ├── Editable Elements
         │    └── Mouse Selection Marquee
         │
         └── Canvas Tools Overlay
              ├── Guidelines
              ├── Rulers
              ├── Element Operation Layer (Resize handles, Rotate control, Borders)
              ├── Alignment Snap Lines
              └── Viewport Background
```

#### Basic Principles of the Canvas
We focus on the relatively complex **Canvas** section. Each element on the canvas is described by a set of data. For example:
```typescript
interface PPTBaseElement {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}
```
As the name suggests, `left` represents the element's position relative to the top-left corner of the canvas, `width` represents the element's width, and so on.

The key detail to know is: **the viewport defaults to a base size of 1000 pixels wide and 562.5 pixels high (a 16:9 aspect ratio)**. This means regardless of the actual rendering size of the canvas/viewport on screen, an element defined with `{ width: 1000, height: 562.5, left: 0, top: 0 }` will exactly fill the entire viewport.

The implementation is very simple: suppose the viewport's actual width on screen is 1200px. We calculate the scale ratio as `1200 / 1000 = 1.2`, and then apply a CSS scale/transform of `1.2` to all elements inside the viewport.
Following the same logic, **Thumbnails** and the **Slideshow Playback Page** are simply viewports with smaller or larger actual display sizes.
> Note: The 1000×562.5 base width/height can be configured by modifying the `viewportSize` property in `src/store/slides.ts`.

#### Elements inside the Canvas
In addition to the position and size information mentioned above, elements can hold more detailed data. Take a text element as an example:
```typescript
interface PPTTextElement {
  type: 'text';
  id: string;
  left: number;
  top: number;
  lock?: boolean;
  groupId?: string;
  width: number;
  height: number;
  link?: string;
  content: string;
  rotate: number;
  defaultFontName: string;
  defaultColor: string;
  outline?: PPTElementOutline;
  fill?: string;
  lineHeight?: number;
  wordSpace?: number;
  opacity?: number;
  shadow?: PPTElementShadow;
}
```
You can define `rotate` to indicate the textbox rotation angle, `opacity` for the opacity level, and so on. During implementation, the element components are rendered according to the definitions in this data structure, and the editing process is essentially modifying these properties in the state.
This covers the basic design of the canvas.
