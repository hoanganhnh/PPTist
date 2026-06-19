import assert from 'node:assert/strict'
import { Buffer } from 'node:buffer'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import ts from 'typescript'
import { reactive } from 'vue'

const readSource = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

async function importTypeScriptModule(path) {
  const source = await readSource(path)
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`)
}

test('FSDS save snapshot unwraps reactive Pinia state without mutating it', async () => {
  const { createSerializableDeckSnapshot } = await importTypeScriptModule(
    'src/integrations/fsds/deck-mapper.ts',
  )
  const reactivePayload = {
    title: 'Course slides',
    data: {
      theme: reactive({ fontName: 'Arial' }),
      slides: reactive([{ id: 'slide-1', elements: [] }]),
    },
    version: 1,
  }

  assert.throws(() => structuredClone(reactivePayload), { name: 'DataCloneError' })
  const snapshot = createSerializableDeckSnapshot(reactivePayload)
  assert.deepEqual(snapshot, {
    title: 'Course slides',
    data: {
      theme: { fontName: 'Arial' },
      slides: [{ id: 'slide-1', elements: [] }],
    },
    version: 1,
  })
  assert.notEqual(snapshot.data.theme, reactivePayload.data.theme)
  assert.notEqual(snapshot.data.slides, reactivePayload.data.slides)

  const appSource = await readSource('src/App.vue')
  assert.doesNotMatch(appSource, /structuredClone\(mapStoreToSavePayload\(/)
  assert.match(
    appSource,
    /async function handleFsdsSave\(\): Promise<void> \{[\s\S]*?try \{[\s\S]*?createSerializableDeckSnapshot\(/,
  )
})

test('FSDS child bridge reports rejected save handlers instead of silently ending the request', async () => {
  const { executeSaveHandler } = await importTypeScriptModule(
    'src/integrations/fsds/parent-bridge.ts',
  )
  let failureCount = 0

  await executeSaveHandler(
    () => Promise.reject(new Error('internal details')),
    () => {
      failureCount += 1
    },
  )

  assert.equal(failureCount, 1)
})

test('FSDS child bridge does not emit fallback failure for handled save outcomes', async () => {
  const { executeSaveHandler } = await importTypeScriptModule(
    'src/integrations/fsds/parent-bridge.ts',
  )
  let failureCount = 0

  await executeSaveHandler(
    () => Promise.resolve(),
    () => {
      failureCount += 1
    },
  )

  assert.equal(failureCount, 0)
})
