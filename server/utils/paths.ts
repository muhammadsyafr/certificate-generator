import { join } from 'path'

export function dataDir(...parts: string[]) {
  const base = process.env.DATA_DIR || process.cwd()
  return join(base, ...parts)
}
