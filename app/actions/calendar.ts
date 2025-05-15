'use server'

import { authActionClient } from '@/lib/safe-action'
import fs from 'fs/promises'
import path from 'path'

export const update = authActionClient.action(async ({ ctx }) => {
  console.log('update', ctx.username)
})

// export async function update(newData: any) {
//   const filePath = path.join(process.cwd(), 'data/calendar.json')
//   await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8')
// }
