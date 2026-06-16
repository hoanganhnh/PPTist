## How to Customize an Element

We will take the "Web Page Element" as an example to explain the process of implementing a custom element.
> Full code is available at https://github.com/pipipi-pikachu/PPTist/tree/document-demo

> Note: Due to project updates, the code in this document and the repository may not work directly via simple copy-paste. This document is meant to provide the general structure and logic.

### 1. Write the Structure and Configurations for the New Element
First, define the structure of the new element and add the element type in the types file:
```typescript 
// types/slides.ts

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
  FRAME = 'frame', // Added
}

// Added interface
export interface PPTFrameElement extends PPTBaseElement {
  type: 'frame'
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  url: string; // Webpage URL
}

// Modify PPTElement Type union
export type PPTElement = PPTTextElement | PPTImageElement | PPTShapeElement | PPTLineElement | PPTChartElement | PPTTableElement | PPTLatexElement | PPTVideoElement | PPTAudioElement | PPTFrameElement
```

Add the new element's name and its minimum size limit in the configurations:
```typescript
// configs/element

export const ELEMENT_TYPE_ZH = {
  text: 'Text',
  image: 'Image',
  shape: 'Shape',
  line: 'Line',
  chart: 'Chart',
  table: 'Table',
  video: 'Video',
  audio: 'Audio',
  frame: 'Webpage', // Added
}

export const MIN_SIZE = {
  text: 20,
  image: 20,
  shape: 15,
  chart: 200,
  table: 20,
  video: 250,
  audio: 20,
  frame: 200, // Added
}
```

### 2. Create the Element Component
Next, implement the Vue component for the element:
```html
<!-- views/components/element/FrameElement/index.vue -->

<template>
  <div class="editable-element-frame"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div 
        class="element-content" 
        v-contextmenu="contextmenus"
        @mousedown="$event => handleSelectElement($event)"
        @touchstart="$event => handleSelectElement($event)"
      >
        <iframe 
          :src="elementInfo.url"
          :width="elementInfo.width"
          :height="elementInfo.height"
          :frameborder="0" 
          :allowfullscreen="true"
        ></iframe>

        <div class="drag-handler top"></div>
        <div class="drag-handler bottom"></div>
        <div class="drag-handler left"></div>
        <div class="drag-handler right"></div>

        <div class="mask" 
          v-if="handleElementId !== elementInfo.id"
          @mousedown="$event => handleSelectElement($event, false)"
          @touchstart="$event => handleSelectElement($event, false)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/store'
import { PPTFrameElement } from '@/types/slides'
import { ContextmenuItem } from '@/components/Contextmenu/types'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
  selectElement: {
    type: Function as PropType<(e: MouseEvent | TouchEvent, element: PPTFrameElement, canMove?: boolean) => void>,
    required: true,
  },
  contextmenus: {
    type: Function as PropType<() => ContextmenuItem[] | null>,
  },
})

const { handleElementId } = storeToRefs(useMainStore())

const handleSelectElement = (e: MouseEvent | TouchEvent, canMove = true) => {
  e.stopPropagation()
  props.selectElement(e, props.elementInfo, canMove)
}
</script>

<style lang="scss" scoped>
.editable-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
  cursor: move;
}
.drag-handler {
  position: absolute;

  &.top {
    height: 20px;
    left: 0;
    right: 0;
    top: 0;
  }
  &.bottom {
    height: 20px;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.left {
    width: 20px;
    top: 0;
    bottom: 0;
    left: 0;
  }
  &.right {
    width: 20px;
    top: 0;
    bottom: 0;
    right: 0;
  }
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

In addition, we need a simplified base component without editing tools for thumbnails and presentation/slideshow modes:
```html
<!-- views/components/element/FrameElement/BaseFrameElement.vue -->

<template>
  <div class="base-element-frame"
    :style="{
      top: elementInfo.top + 'px',
      left: elementInfo.left + 'px',
      width: elementInfo.width + 'px',
      height: elementInfo.height + 'px',
    }"
  >
    <div
      class="rotate-wrapper"
      :style="{ transform: `rotate(${elementInfo.rotate}deg)` }"
    >
      <div class="element-content">
        <iframe 
          :src="elementInfo.url"
          :width="elementInfo.width"
          :height="elementInfo.height"
          :frameborder="0" 
          :allowfullscreen="true"
        ></iframe>

        <div class="mask"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import { PPTFrameElement } from '@/types/slides'

const props = defineProps({
  elementInfo: {
    type: Object as PropType<PPTFrameElement>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.base-element-frame {
  position: absolute;
}
.element-content {
  width: 100%;
  height: 100%;
}
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
```

As you can see, these two components are highly similar. For simple elements, the editable and non-editable components remain mostly identical, with the non-editable version simply omitting interactive event handlers. For complex elements (e.g., text or image elements), the difference between the two versions can be significant. You can decide whether to merge them into a single abstracted component.

Once the element components are written, register them where needed:
- Thumbnail element component: `views/components/ThumbnailSlide/ThumbnailElement.vue`
- Presenter/slideshow element component: `views/Screen/ScreenElement.vue`
- Editable canvas element component: `views/Editor/Canvas/EditableElement.vue`
- Mobile editable element component: `views/Mobile/MobileEditor/MobileEditableElement.vue`

Generally, the first two use the non-editable component, while the latter two use the editable component.
Here is an example registry mapping in the editable canvas component:
```html
<!-- views/Editor/Canvas/EditableElement.vue -->

<script lang="ts" setup>
 import FrameElement from '@/views/components/element/FrameElement/index.vue'

 const currentElementComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElement,
    [ElementTypes.TEXT]: TextElement,
    [ElementTypes.SHAPE]: ShapeElement,
    [ElementTypes.LINE]: LineElement,
    [ElementTypes.CHART]: ChartElement,
    [ElementTypes.TABLE]: TableElement,
    [ElementTypes.LATEX]: LatexElement,
    [ElementTypes.VIDEO]: VideoElement,
    [ElementTypes.AUDIO]: AudioElement,
    [ElementTypes.FRAME]: FrameElement, // Added
  }
  return elementTypeMap[props.elementInfo.type] || null
})
</script>
```

We also need to attach the element resize and rotation handles overlay `Operate` (typically consisting of 8 resize points, 4 border lines, and 1 rotation point). You can write custom operations if needed, but for most standard elements, you can use the generic handler:
```html
<!-- src/views/Editor/Canvas/Operate/index.vue -->

<script lang="ts" setup>
const currentOperateComponent = computed(() => {
  const elementTypeMap = {
    [ElementTypes.IMAGE]: ImageElementOperate,
    [ElementTypes.TEXT]: TextElementOperate,
    [ElementTypes.SHAPE]: ShapeElementOperate,
    [ElementTypes.LINE]: LineElementOperate,
    [ElementTypes.TABLE]: TableElementOperate,
    [ElementTypes.CHART]: CommonElementOperate,
    [ElementTypes.LATEX]: CommonElementOperate,
    [ElementTypes.VIDEO]: CommonElementOperate,
    [ElementTypes.AUDIO]: CommonElementOperate,
    [ElementTypes.FRAME]: CommonElementOperate, // Added
  }
  return elementTypeMap[props.elementInfo.type] || null
})
</script>
```

### 3. Implement the Right-Side Formatting Panel
Next, create a style editing panel. When this element type is selected, the right sidebar will automatically load this panel. You can add configuration inputs here to modify the element properties (each input updates fields in the element data structure).
Remember to register the history snapshot after updates to preserve undo/redo history.
```html
<!-- src/views/Editor/Toolbar/ElementStylePanel/FrameStylePanel.vue -->

<template>
  <div class="frame-style-panel">
    <div class="row">
      <div>Webpage Link:</div>
      <Input v-model:value="url" placeholder="Please enter webpage link" />
      <Button @click="updateURL()">Confirm</Button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore, useSlidesStore } from '@/store'
import useHistorySnapshot from '@/hooks/useHistorySnapshot'

const slidesStore = useSlidesStore()
const { handleElementId } = storeToRefs(useMainStore())

const { addHistorySnapshot } = useHistorySnapshot()

const url = ref('')

const updateURL = () => {
  if (!handleElementId.value) return
  slidesStore.updateElement({ id: handleElementId.value, props: { url: url.value } })
  addHistorySnapshot()
}
</script>
```

Register this formatting panel in the styling panel router:
```html
<!-- src/views/Editor/Toolbar/ElementStylePanel/index.vue -->
<script lang="ts" setup>
import FrameStylePanel from './FrameStylePanel.vue'
  
const panelMap = {
  [ElementTypes.TEXT]: TextStylePanel,
  [ElementTypes.IMAGE]: ImageStylePanel,
  [ElementTypes.SHAPE]: ShapeStylePanel,
  [ElementTypes.LINE]: LineStylePanel,
  [ElementTypes.CHART]: ChartStylePanel,
  [ElementTypes.TABLE]: TableStylePanel,
  [ElementTypes.LATEX]: LatexStylePanel,
  [ElementTypes.VIDEO]: VideoStylePanel,
  [ElementTypes.AUDIO]: AudioStylePanel,
  [ElementTypes.FRAME]: FrameStylePanel, // Added
}
</script>
```

### 4. Create and Insert Element
Lastly, implement a method to instantiate and place the element on the canvas:
```typescript
// src/hooks/useCreateElement.ts

const createFrameElement = (url: string) => {
  createElement({
    type: 'frame',
    id: nanoid(10),
    width: 800,
    height: 480,
    rotate: 0,
    left: (VIEWPORT_SIZE - 800) / 2,
    top: (VIEWPORT_SIZE * viewportRatio.value - 480) / 2,
    url,
  })
}
```

Expose and call this method in the toolbar insertion component:
```html
<!-- src/views/Editor/CanvasTool/index.vue -->

<template>
  <div class="canvas-tool">
    <div class="add-element-handler">
      <!-- Added -->
      <span class="handler-item" @click="createFrameElement('https://vuejs.org/')">Insert Webpage</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
const {
  createImageElement,
  createChartElement,
  createTableElement,
  createLatexElement,
  createVideoElement,
  createAudioElement,
  createFrameElement, // Added
} = useCreateElement()
</script>
```
Clicking the "Insert Webpage" button will add a live iframe webpage element onto the canvas.

### Summary
This outlines the complete workflow for adding a custom element. While it involves several files, each step is straightforward. The primary tasks consist of defining the data structure and creating the rendering components. For advanced integrations (e.g. including the element in slide theme updates or implementing custom exporters), you can extend relevant theme or export utilities in the codebase.
