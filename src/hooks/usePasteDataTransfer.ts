import { getImageDataURL } from '@/utils/image'
import message from '@/utils/message'
import useCreateElement from './useCreateElement'
import useImport from './useImport'

export default () => {
  const { createImageElement } = useCreateElement()
  const { importSpecificFile, importPPTXFile } = useImport()

  const pasteDataTransfer = (dataTransfer: DataTransfer) => {
    const dataItems = dataTransfer.items
    const dataTransferFirstItem = dataItems[0]

    // Check if paste event contains valid files; insert them if present, else continue to text
    let isFile = false

    for (const item of dataItems) {
      if (item.kind === 'file') {
        if (item.type.indexOf('image') !== -1) {
          const imageFile = item.getAsFile()
          if (imageFile) {
            getImageDataURL(imageFile).then(dataURL => createImageElement(dataURL))
            isFile = true
          }
        }
        else if (item.type.indexOf('video') !== -1) {
          message.error('Video paste not supported — use Insert > Audio/Video to embed by URL')
          isFile = true
        }
        else if (item.type.indexOf('audio') !== -1) {
          message.error('Audio paste not supported — use Insert > Audio/Video to embed by URL')
          isFile = true
        }
      }
    }

    if (!isFile && dataTransferFirstItem && dataTransferFirstItem.kind === 'file') {
      if (!isFile && dataTransferFirstItem.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
        const pptxFile = dataTransferFirstItem.getAsFile()
        if (pptxFile) {
          importPPTXFile([pptxFile])
          isFile = true
        }
      }
      else if (!isFile) {
        const unknownFile = dataTransferFirstItem.getAsFile()

        if (unknownFile && unknownFile.name) {
          const ext = unknownFile.name.split('.').pop() || ''

          if (ext === 'pptist') {
            importSpecificFile([unknownFile])
            isFile = true
          }
        }
      }
    }

    return { isFile, dataTransferFirstItem }
  }

  return {
    pasteDataTransfer,
  }
}
