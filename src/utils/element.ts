import tinycolor from 'tinycolor2'
import { nanoid } from 'nanoid'
import type { LinePoint, PPTElement, PPTLineElement, Slide } from '@/types/slides'

interface RotatedElementData {
  left: number
  top: number
  width: number
  height: number
  rotate: number
}

interface Point {
  x: number
  y: number
}

interface AbsoluteLinePoints {
  start: Point
  end: Point
  broken?: Point
  broken2?: Point
  curve?: Point
  cubic?: [Point, Point]
}

interface IdMap {
  [id: string]: string
}

/**
 * Calculate new position range of a rectangular element rotated on the canvas
 * @param element Element position, size, and rotation angle
 */
export const getRectRotatedRange = (element: RotatedElementData) => {
  const { left, top, width, height, rotate = 0 } = element

  const radius = Math.sqrt( Math.pow(width, 2) + Math.pow(height, 2) ) / 2
  const auxiliaryAngle = Math.atan(height / width) * 180 / Math.PI

  const tlbraRadian = (180 - rotate - auxiliaryAngle) * Math.PI / 180
  const trblaRadian = (auxiliaryAngle - rotate) * Math.PI / 180

  const middleLeft = left + width / 2
  const middleTop = top + height / 2

  const xAxis = [
    middleLeft + radius * Math.cos(tlbraRadian),
    middleLeft + radius * Math.cos(trblaRadian),
    middleLeft - radius * Math.cos(tlbraRadian),
    middleLeft - radius * Math.cos(trblaRadian),
  ]
  const yAxis = [
    middleTop - radius * Math.sin(tlbraRadian),
    middleTop - radius * Math.sin(trblaRadian),
    middleTop + radius * Math.sin(tlbraRadian),
    middleTop + radius * Math.sin(trblaRadian),
  ]

  return {
    xRange: [Math.min(...xAxis), Math.max(...xAxis)],
    yRange: [Math.min(...yAxis), Math.max(...yAxis)],
  }
}

/**
 * Calculate offset deviation between rotated and pre-rotated positions of a rectangular element on the canvas
 * @param element Element position, size, and rotation angle
 */
export const getRectRotatedOffset = (element: RotatedElementData) => {
  const { xRange: originXRange, yRange: originYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: 0,
  })
  const { xRange: rotatedXRange, yRange: rotatedYRange } = getRectRotatedRange({
    left: element.left,
    top: element.top,
    width: element.width,
    height: element.height,
    rotate: element.rotate,
  })
  return {
    offsetX: rotatedXRange[0] - originXRange[0],
    offsetY: rotatedYRange[0] - originYRange[0],
  }
}

/**
 * Calculate element position range on the canvas
 * @param element Element data
 */
export const getElementRange = (element: PPTElement) => {
  let minX, maxX, minY, maxY

  if (element.type === 'line') {
    minX = element.left
    maxX = element.left + Math.max(element.start[0], element.end[0])
    minY = element.top
    maxY = element.top + Math.max(element.start[1], element.end[1])
  }
  else if ('rotate' in element && element.rotate) {
    const { left, top, width, height, rotate } = element
    const { xRange, yRange } = getRectRotatedRange({ left, top, width, height, rotate })
    minX = xRange[0]
    maxX = xRange[1]
    minY = yRange[0]
    maxY = yRange[1]
  }
  else {
    minX = element.left
    maxX = element.left + element.width
    minY = element.top
    maxY = element.top + element.height
  }
  return { minX, maxX, minY, maxY }
}

/**
 * Calculate position range of a group of elements on the canvas
 * @param elementList List of elements
 */
export const getElementListRange = (elementList: PPTElement[]) => {
  const leftValues: number[] = []
  const topValues: number[] = []
  const rightValues: number[] = []
  const bottomValues: number[] = []

  elementList.forEach(element => {
    const { minX, maxX, minY, maxY } = getElementRange(element)
    leftValues.push(minX)
    topValues.push(minY)
    rightValues.push(maxX)
    bottomValues.push(maxY)
  })

  const minX = Math.min(...leftValues)
  const maxX = Math.max(...rightValues)
  const minY = Math.min(...topValues)
  const maxY = Math.max(...bottomValues)

  return { minX, maxX, minY, maxY }
}

const ROTATABLE_GROUP_ELEMENT_TYPES = ['text', 'image', 'shape', 'line']

/**
 * Determine if the currently selected elements are full members of the same group
 * @param elements Selected element list
 */
export const isSingleGroupSelection = (elements: PPTElement[]) => {
  if (elements.length < 2) return false

  const groupId = elements[0].groupId
  if (!groupId) return false

  return elements.every(element => element.groupId === groupId)
}

/**
 * Determine if the current group is allowed to rotate unified
 * @param elements Group members list
 */
export const canRotateGroupElements = (elements: PPTElement[]) => {
  if (!isSingleGroupSelection(elements)) return false

  return elements.every(element => {
    if (!ROTATABLE_GROUP_ELEMENT_TYPES.includes(element.type)) return false
    if (element.type === 'line' && (element.broken || element.broken2 || element.curve || element.cubic)) return false
    return true
  })
}

/**
 * Calculate center point of the overall range of a group of elements
 * @param elements Element List
 * @param rotate Rotation angle reference for the group, will align by this angle before center calculation
 */
export const getGroupElementCenter = (elements: PPTElement[], rotate = 0) => {
  const { minX, maxX, minY, maxY } = getElementListRangeByRotate(elements, rotate)
  const alignedCenter = {
    x: (minX + maxX) / 2,
    y: (minY + maxY) / 2,
  }

  if (!rotate) return alignedCenter

  return rotatePoint(alignedCenter, { x: 0, y: 0 }, rotate)
}

/**
 * Calculate absolute coordinates of the four corners of a rectangle element on the canvas
 * @param element Rectangle element
 */
const getRectElementPoints = (element: Exclude<PPTElement, PPTLineElement>) => {
  const center = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const points = [
    { x: center.x - element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y - element.height / 2 },
    { x: center.x + element.width / 2, y: center.y + element.height / 2 },
    { x: center.x - element.width / 2, y: center.y + element.height / 2 },
  ]

  if (!element.rotate) return points

  return points.map(point => rotatePoint(point, center, element.rotate))
}

/**
 * Calculate absolute coordinate list of line element for range calculation
 * @param element Line element
 */
const getAbsoluteLinePointList = (element: PPTLineElement) => {
  const points = getAbsoluteLinePoints(element)
  return [points.start, points.end]
}

/**
 * Calculate elements range after aligning to the specified group rotation angle
 * @param elements Element List
 * @param rotate Rotation angle reference for the group
 */
const getElementListRangeByRotate = (elements: PPTElement[], rotate: number) => {
  const xValues: number[] = []
  const yValues: number[] = []

  elements.forEach(element => {
    const points = element.type === 'line' ? getAbsoluteLinePointList(element) : getRectElementPoints(element)
    const rotatedPoints = rotate ? points.map(point => rotatePoint(point, { x: 0, y: 0 }, -rotate)) : points
    xValues.push(...rotatedPoints.map(point => point.x))
    yValues.push(...rotatedPoints.map(point => point.y))
  })

  return {
    minX: Math.min(...xValues),
    maxX: Math.max(...xValues),
    minY: Math.min(...yValues),
    maxY: Math.max(...yValues),
  }
}

/**
 * Normalize angle to the range [-180, 180]
 * @param angle Original angle
 */
export const normalizeAngle = (angle: number) => {
  let result = angle
  while (result > 180) result -= 360
  while (result < -180) result += 360
  return result
}

/**
 * Calculate coordinates of a point rotated around a specified center point
 * @param point Target point
 * @param center Rotation center point
 * @param angle Rotation Angle
 */
export const rotatePoint = (point: Point, center: Point, angle: number): Point => {
  const radian = angle * Math.PI / 180
  const deltaX = point.x - center.x
  const deltaY = point.y - center.y

  return {
    x: center.x + deltaX * Math.cos(radian) - deltaY * Math.sin(radian),
    y: center.y + deltaX * Math.sin(radian) + deltaY * Math.cos(radian),
  }
}

/**
 * Rotate rectangle element: rotate around center point and apply rotation angle
 * @param element Element
 * @param center Group rotation center point
 * @param angle Rotation Angle
 */
export const rotateRectLikeElement = (element: Exclude<PPTElement, PPTLineElement>, center: Point, angle: number) => {
  const elementCenter = {
    x: element.left + element.width / 2,
    y: element.top + element.height / 2,
  }
  const nextCenter = rotatePoint(elementCenter, center, angle)

  return {
    ...element,
    left: nextCenter.x - element.width / 2,
    top: nextCenter.y - element.height / 2,
    rotate: normalizeAngle(element.rotate + angle),
  }
}

/**
 * Convert line coordinates to absolute canvas coordinates
 * @param element Line element
 */
const getAbsoluteLinePoints = (element: PPTLineElement): AbsoluteLinePoints => {
  const toAbsolutePoint = (point: [number, number]) => ({
    x: element.left + point[0],
    y: element.top + point[1],
  })

  const points: AbsoluteLinePoints = {
    start: toAbsolutePoint(element.start),
    end: toAbsolutePoint(element.end),
  }

  if (element.broken) points.broken = toAbsolutePoint(element.broken)
  if (element.broken2) points.broken2 = toAbsolutePoint(element.broken2)
  if (element.curve) points.curve = toAbsolutePoint(element.curve)
  if (element.cubic) {
    points.cubic = [
      toAbsolutePoint(element.cubic[0]),
      toAbsolutePoint(element.cubic[1]),
    ]
  }

  return points
}

/**
 * Rotate all absolute line coordinates around a specified center point
 * @param points Line absolute coordinates
 * @param center Group rotation center point
 * @param angle Rotation Angle
 */
const rotateAbsoluteLinePoints = (points: AbsoluteLinePoints, center: Point, angle: number): AbsoluteLinePoints => {
  const rotated: AbsoluteLinePoints = {
    start: rotatePoint(points.start, center, angle),
    end: rotatePoint(points.end, center, angle),
  }

  if (points.broken) rotated.broken = rotatePoint(points.broken, center, angle)
  if (points.broken2) rotated.broken2 = rotatePoint(points.broken2, center, angle)
  if (points.curve) rotated.curve = rotatePoint(points.curve, center, angle)
  if (points.cubic) {
    rotated.cubic = [
      rotatePoint(points.cubic[0], center, angle),
      rotatePoint(points.cubic[1], center, angle),
    ]
  }

  return rotated
}

/**
 * Reconstruct line element from rotated absolute coordinates
 * @param element Original line element
 * @param points Absolute coordinates after rotation
 */
const rebuildLineElement = (element: PPTLineElement, points: AbsoluteLinePoints): PPTLineElement => {
  const allPoints = [points.start, points.end]
  if (points.broken) allPoints.push(points.broken)
  if (points.broken2) allPoints.push(points.broken2)
  if (points.curve) allPoints.push(points.curve)
  if (points.cubic) allPoints.push(...points.cubic)

  const left = Math.min(...allPoints.map(point => point.x))
  const top = Math.min(...allPoints.map(point => point.y))
  const toRelativePoint = (point: Point): [number, number] => [point.x - left, point.y - top]

  const nextElement: PPTLineElement = {
    ...element,
    left,
    top,
    start: toRelativePoint(points.start),
    end: toRelativePoint(points.end),
  }

  if (points.broken) nextElement.broken = toRelativePoint(points.broken)
  else delete nextElement.broken

  if (points.broken2) nextElement.broken2 = toRelativePoint(points.broken2)
  else delete nextElement.broken2

  if (points.curve) nextElement.curve = toRelativePoint(points.curve)
  else delete nextElement.curve

  if (points.cubic) {
    nextElement.cubic = [
      toRelativePoint(points.cubic[0]),
      toRelativePoint(points.cubic[1]),
    ]
  }
  else delete nextElement.cubic

  return nextElement
}

/**
 * Rotate line element: rotate all control points and reconstruct line data
 * @param element Line element
 * @param center Group rotation center point
 * @param angle Rotation Angle
 */
export const rotateLineElement = (element: PPTLineElement, center: Point, angle: number) => {
  const absolutePoints = getAbsoluteLinePoints(element)
  const rotatedPoints = rotateAbsoluteLinePoints(absolutePoints, center, angle)
  return rebuildLineElement(element, rotatedPoints)
}

export const getLineElementLength = (element: PPTLineElement) => {
  const deltaX = element.end[0] - element.start[0]
  const deltaY = element.end[1] - element.start[1]
  const len = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
  return len
}

export const getBroken2LineDirection = (element: PPTLineElement) => {
  if (element.broken2Direction) return element.broken2Direction

  const { minX, maxX, minY, maxY } = getElementRange(element)
  return maxX - minX >= maxY - minY ? 'horizontal' : 'vertical'
}

export interface AlignLine {
  value: number
  range: [number, number]
}

/**
 * De-duplicate a group of alignment snap lines: keep only one for the same position, taking the min/max of all snap lines as the new range
 * @param lines List of alignment snap line info
 */
export const uniqAlignLines = (lines: AlignLine[]) => {
  const uniqLines: AlignLine[] = []
  lines.forEach(line => {
    const index = uniqLines.findIndex(_line => _line.value === line.value)
    if (index === -1) uniqLines.push(line)
    else {
      const uniqLine = uniqLines[index]
      const rangeMin = Math.min(uniqLine.range[0], line.range[0])
      const rangeMax = Math.max(uniqLine.range[1], line.range[1])
      const range: [number, number] = [rangeMin, rangeMax]
      const _line = { value: line.value, range }
      uniqLines[index] = _line
    }
  })
  return uniqLines
}

/**
 * Generate new IDs for each slide based on the slide list, mapping them from old IDs
 * Mainly used when editing slides to maintain the original relationships of slide IDs
 * @param slides SlideList
 */
export const createSlideIdMap = (slides: Slide[]) => {
  const slideIdMap: IdMap = {}
  for (const slide of slides) {
    slideIdMap[slide.id] = nanoid(10)
  }
  return slideIdMap
}

/**
   * Generate new IDs for each element based on the element list, mapping them from old IDs
   * Mainly used when copying elements to maintain the original relationships of element IDs
   * For example: if two elements belong to the same group, they will still share a new group ID after copying
   * @param elements Element list data
   */
export const createElementIdMap = (elements: PPTElement[]) => {
  const groupIdMap: IdMap = {}
  const elIdMap: IdMap = {}
  for (const element of elements) {
    const groupId = element.groupId
    if (groupId && !groupIdMap[groupId]) {
      groupIdMap[groupId] = nanoid(10)
    }
    elIdMap[element.id] = nanoid(10)
  }
  return {
    groupIdMap,
    elIdMap,
  }
}

/**
 * Get sub-colors matching the color palette based on the table's theme color
 * @param themeColor Theme Color
 */
export const getTableSubThemeColor = (themeColor: string) => {
  const rgba = tinycolor(themeColor)
  return [
    rgba.setAlpha(0.3).toRgbString(),
    rgba.setAlpha(0.1).toRgbString(),
  ]
}

/**
 * Get line path string
 * @param element Line element
 */
export const getLineElementPath = (element: PPTLineElement) => {
  const start = element.start.join(',')
  const end = element.end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${start} L${mid} L${end}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${start} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${end}`
    return `M${start} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${end}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${start} Q${mid} ${end}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${start} C${p1} ${p2} ${end}`
  }
  return `M${start} L${end}`
}

/**
 * Calculate the inward shrink distance of the line body for rendering based on endpoints type and width
 * @param point Line EndpointsType
 * @param width LineWidth
 */
const getLinePointRetractionOffset = (point: LinePoint, width: number) => {
  const size = width < 2 ? 2 : width
  if (point === 'arrow') return size
  if (point === 'dot') return size / 2
  return 0
}

/**
 * Calculate distance between two line points
 * @param p1 First point
 * @param p2 Second point
 */
const getLinePointDistance = (p1: [number, number], p2: [number, number]) => {
  const deltaX = p2[0] - p1[0]
  const deltaY = p2[1] - p1[1]
  return Math.sqrt(deltaX * deltaX + deltaY * deltaY)
}

/**
 * Translate line coordinates along the target point by the specified offset
 * @param point Current point
 * @param target Target point
 * @param offset Offset distance
 */
const getLinePointByOffset = (
  point: [number, number],
  target: [number, number],
  offset: number,
) => {
  const distance = getLinePointDistance(point, target)
  if (!distance) return point

  const ratio = offset / distance
  return [
    point[0] + (target[0] - point[0]) * ratio,
    point[1] + (target[1] - point[1]) * ratio,
  ] as [number, number]
}

/**
 * Get adjacent control points at the start and end of the line path to calculate the shrink direction
 * @param element Line element
 */
const getLinePathTurningPoints = (element: PPTLineElement) => {
  if (element.broken) return [element.broken]

  if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') {
      return [
        [element.broken2[0], element.start[1]],
        [element.broken2[0], element.end[1]],
      ] as [number, number][]
    }
    return [
      [element.start[0], element.broken2[1]],
      [element.end[0], element.broken2[1]],
    ] as [number, number][]
  }

  if (element.curve) return [element.curve]
  if (element.cubic) return [element.cubic[0], element.cubic[1]]
  return []
}

/**
 * Get line path string for actual rendering:
 * Keep endpoint markers aligned to original start/end, only shrinking the visible line body inward as needed
 * @param element Line element
 */
export const getLineElementRenderPath = (element: PPTLineElement) => {
  const turningPoints = getLinePathTurningPoints(element)

  let start = element.start
  let end = element.end

  const startOffset = getLinePointRetractionOffset(element.points[0], element.width)
  const endOffset = getLinePointRetractionOffset(element.points[1], element.width)

  if (startOffset) {
    const nextPoint = turningPoints[0] || element.end
    const offset = Math.min(startOffset, getLinePointDistance(element.start, nextPoint) / 2)
    start = getLinePointByOffset(element.start, nextPoint, offset)
  }

  if (endOffset) {
    const prevPoint = turningPoints[turningPoints.length - 1] || element.start
    const offset = Math.min(endOffset, getLinePointDistance(prevPoint, element.end) / 2)
    end = getLinePointByOffset(element.end, prevPoint, offset)
  }

  const startPoint = start.join(',')
  const endPoint = end.join(',')
  if (element.broken) {
    const mid = element.broken.join(',')
    return `M${startPoint} L${mid} L${endPoint}`
  }
  else if (element.broken2) {
    const direction = getBroken2LineDirection(element)
    if (direction === 'horizontal') return `M${startPoint} L${element.broken2[0]},${element.start[1]} L${element.broken2[0]},${element.end[1]} ${endPoint}`
    return `M${startPoint} L${element.start[0]},${element.broken2[1]} L${element.end[0]},${element.broken2[1]} ${endPoint}`
  }
  else if (element.curve) {
    const mid = element.curve.join(',')
    return `M${startPoint} Q${mid} ${endPoint}`
  }
  else if (element.cubic) {
    const [c1, c2] = element.cubic
    const p1 = c1.join(',')
    const p2 = c2.join(',')
    return `M${startPoint} C${p1} ${p2} ${endPoint}`
  }
  return `M${startPoint} L${endPoint}`
}

/**
 * Determine if an element is within the viewport
 * @param element Element
 * @param parent Parent element
 */
export const isElementInViewport = (element: HTMLElement, parent: HTMLElement): boolean => {
  const elementRect = element.getBoundingClientRect()
  const parentRect = parent.getBoundingClientRect()

  return (
    elementRect.top >= parentRect.top &&
    elementRect.bottom <= parentRect.bottom
  )
}
