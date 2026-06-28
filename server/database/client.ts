import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from './schema'
import { dataDir } from '../utils/paths'

const sqlite = new Database(dataDir('app.db'))
export const db = drizzle(sqlite, { schema })
export const rawDb = sqlite
