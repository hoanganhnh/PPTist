import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import assert from 'node:assert/strict'

const readSource = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('FSDS mode keeps local snapshot history enabled', async () => {
  const [snapshotSource, databaseSource, appSource] = await Promise.all([
    readSource('src/store/snapshot.ts'),
    readSource('src/utils/database.ts'),
    readSource('src/App.vue'),
  ])

  assert.doesNotMatch(snapshotSource, /if\s*\(\s*isFsdsMode\(\)\s*\)\s*return/)
  assert.doesNotMatch(databaseSource, /db\s*=\s*null\s+as\s+unknown/)
  assert.match(appSource, /await\s+snapshotStore\.initSnapshotDatabase\(\)/)
})
