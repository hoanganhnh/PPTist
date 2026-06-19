import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const readSource = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('media input accepts only trimmed http(s) URLs and has no local upload path', async () => {
  const source = await readSource('src/views/Editor/CanvasTool/MediaInput.vue')

  assert.doesNotMatch(source, /FileInput|uploadVideo|uploadAudio|URL\.createObjectURL|MIME_MAP/)
  assert.match(source, /const isValidMediaUrl = \(url: string\)/)
  assert.match(source, /\^https\?:\\\/\\\//)
  assert.match(source, /const src = videoSrc\.value\.trim\(\)/)
  assert.match(source, /const src = audioSrc\.value\.trim\(\)/)
  assert.match(source, /emit\('insertVideo', \{ src \}\)/)
  assert.match(source, /emit\('insertAudio', \{ src \}\)/)
})

test('pasting video or audio reports a friendly error without creating blob elements', async () => {
  const source = await readSource('src/hooks/usePasteDataTransfer.ts')

  assert.doesNotMatch(source, /createVideoElement|createAudioElement|URL\.createObjectURL|MIME_MAP/)
  assert.match(source, /Video paste not supported/)
  assert.match(source, /Audio paste not supported/)
  assert.match(source, /createImageElement/)
  assert.match(source, /getImageDataURL/)
})

test('PPTX import skips embedded media and shows one aggregate warning', async () => {
  const source = await readSource('src/hooks/useImport.ts')

  assert.match(source, /let skippedMediaCount = 0/)
  assert.match(source, /el\.type === 'audio' && el\.blob[\s\S]*skippedMediaCount\+\+/)
  assert.match(source, /el\.type === 'video' && el\.blob[\s\S]*skippedMediaCount\+\+/)
  assert.doesNotMatch(source, /src:\s*el\.blob/)
  assert.match(source, /message\.warning\(`\$\{skippedMediaCount\} video\/audio elements were skipped — embed via URL instead`\)/)
  assert.equal(
    source.match(/video\/audio elements were skipped/g)?.length,
    1,
    'import should emit one aggregate warning',
  )
  assert.match(source, /imageMode: 'base64'/)
})
