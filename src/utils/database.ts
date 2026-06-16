import Dexie, { type EntityTable } from 'dexie'
import { databaseId } from '@/store/main'
import type { Slide } from '@/types/slides'
import { LOCALSTORAGE_KEY_DISCARDED_DB } from '@/configs/storage'
import { isFsdsMode } from '@/integrations/fsds/parent-bridge'

export interface writingBoardImg {
  id: string
  dataURL: string
}

export interface Snapshot {
  id: number
  index: number
  slides: Slide[]
}

const databaseNamePrefix = 'PPTist'

// Delete invalid/expired databases
// On app unload (close or refresh), record database ID in localStorage as invalid
// App initialization: check all databases and delete flagged/invalid ones
// Databases older than 12 hours will also be deleted to prevent leaks from crashes
export const deleteDiscardedDB = async () => {
  // Skip IndexedDB cleanup in FSDS mode — snapshot DB is disabled
  if (isFsdsMode()) return

  const now = new Date().getTime()

  const localStorageDiscardedDB = localStorage.getItem(LOCALSTORAGE_KEY_DISCARDED_DB)
  const localStorageDiscardedDBList: string[] = localStorageDiscardedDB ? JSON.parse(localStorageDiscardedDB) : []

  const databaseNames = await Dexie.getDatabaseNames()
  const discardedDBNames = databaseNames.filter(name => {
    if (name.indexOf(databaseNamePrefix) === -1) return false
    
    const [prefix, id, time] = name.split('_')
    if (prefix !== databaseNamePrefix || !id || !time) return true
    if (localStorageDiscardedDBList.includes(id)) return true
    if (now - (+time) >= 1000 * 60 * 60 * 12) return true

    return false
  })

  for (const name of discardedDBNames) Dexie.delete(name)
  localStorage.removeItem(LOCALSTORAGE_KEY_DISCARDED_DB)
}

/**
 * In FSDS mode, skip Dexie DB creation entirely — rely on manual save.
 * In standalone mode, create the snapshot DB as before.
 */
let db: (Dexie & {
  snapshots: EntityTable<Snapshot, 'id'>,
  writingBoardImgs: EntityTable<writingBoardImg, 'id'>,
})

if (!isFsdsMode()) {
  db = new Dexie(`${databaseNamePrefix}_${databaseId}_${new Date().getTime()}`) as Dexie & {
    snapshots: EntityTable<Snapshot, 'id'>,
    writingBoardImgs: EntityTable<writingBoardImg, 'id'>,
  }

  db.version(1).stores({
    snapshots: '++id',
    writingBoardImgs: 'id',
  })
}
else {
  // Provide a no-op stub so imports don't crash in FSDS mode.
  // Snapshot operations should be guarded by isFsdsMode() checks.
  db = null as unknown as typeof db
}

export { db }