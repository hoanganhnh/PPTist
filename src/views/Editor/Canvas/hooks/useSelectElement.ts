import type { Ref } from 'vue'
import { uniq } from 'lodash'
import { storeToRefs } from 'pinia'
import { useMainStore, useKeyboardStore } from '@/store'
import type { PPTElement } from '@/types/slides'

export default (
  elementList: Ref<PPTElement[]>,
  moveElement: (e: MouseEvent | TouchEvent, element: PPTElement) => void,
) => {
  const mainStore = useMainStore()
  const { activeElementIdList, activeGroupElementId, handleElementId, editorAreaFocus } = storeToRefs(mainStore)
  const { ctrlKeyState, ctrlOrShiftKeyActive } = storeToRefs(useKeyboardStore())

  // Selected Elements
  // startMove indicates whether to enter drag move state after selection
  const selectElement = (e: MouseEvent | TouchEvent, element: PPTElement, startMove = true) => {
    if (!editorAreaFocus.value) mainStore.setEditorareaFocus(true)

    // If target is not selected, select it
    // If Ctrl/Shift is held, toggle multi-select state; otherwise select only target element
    // If target is in a group, select the rest of the group members together
    if (!activeElementIdList.value.includes(element.id)) {
      let newActiveIdList: string[] = []

      if (ctrlOrShiftKeyActive.value) {
        newActiveIdList = [...activeElementIdList.value, element.id]
      }
      else newActiveIdList = [element.id]
      
      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = [...newActiveIdList, ...groupMembersId]
      }

      mainStore.setActiveElementIdList(uniq(newActiveIdList))
      mainStore.setHandleElementId(element.id)
    }

    // When clicking selected elements with Ctrl: don't deselect immediately
    // Since Ctrl + Click and Ctrl + Drag Copy share the same mousedown
    // Record start position to distinguish between click and drag on mouseup
    // On click, cancel selection on mouseup; on drag, handle via drag logic
    else if (ctrlKeyState.value && startMove) {
      const startPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const startPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY
      const target = e.target as HTMLElement

      target.onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if (startPageX === currentPageX && startPageY === currentPageY) {
          let newActiveIdList: string[] = []

          if (element.groupId) {
            const groupMembersId: string[] = []
            elementList.value.forEach((el: PPTElement) => {
              if (el.groupId === element.groupId) groupMembersId.push(el.id)
            })
            newActiveIdList = activeElementIdList.value.filter(id => !groupMembersId.includes(id))
          }
          else {
            newActiveIdList = activeElementIdList.value.filter(id => id !== element.id)
          }

          if (newActiveIdList.length > 0) {
            mainStore.setActiveElementIdList(newActiveIdList)
          }
        }
        target.onmouseup = null
      }
    }

    // If target is already selected and Ctrl/Shift pressed, deselect it
    // Unless target is the last selected element or part of the last selected group
    // If target is in a group, deselect the rest of the group members together
    else if (ctrlOrShiftKeyActive.value) {
      let newActiveIdList: string[] = []

      if (element.groupId) {
        const groupMembersId: string[] = []
        elementList.value.forEach((el: PPTElement) => {
          if (el.groupId === element.groupId) groupMembersId.push(el.id)
        })
        newActiveIdList = activeElementIdList.value.filter(id => !groupMembersId.includes(id))
      }
      else {
        newActiveIdList = activeElementIdList.value.filter(id => id !== element.id)
      }

      if (newActiveIdList.length > 0) {
        mainStore.setActiveElementIdList(newActiveIdList)
      }
    }

    // If target is selected but not active, set it as the active element
    else if (handleElementId.value !== element.id) {
      mainStore.setHandleElementId(element.id)
    }

    // If target is already selected and active, clicking again activates it in multi-selection
    else if (activeGroupElementId.value !== element.id) {
      const startPageX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
      const startPageY = e instanceof MouseEvent ? e.pageY : e.changedTouches[0].pageY

      ;(e.target as HTMLElement).onmouseup = (e: MouseEvent) => {
        const currentPageX = e.pageX
        const currentPageY = e.pageY

        if (startPageX === currentPageX && startPageY === currentPageY) {
          mainStore.setActiveGroupElementId(element.id)
          ;(e.target as HTMLElement).onmouseup = null
        }
      }
    }

    if (startMove) moveElement(e, element)
  }

  return {
    selectElement,
  }
}
