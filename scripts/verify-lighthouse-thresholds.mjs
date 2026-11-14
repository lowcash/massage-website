import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const outputDir = path.resolve(process.cwd(), 'test-results')

// Floors from measured local runs (2026-11-14): desktop perf 66 / mobile perf 77.
// Mobile gate set to 70 per Wave 1 brief; other categories keep headroom under 100.
const thresholds = {
  desktop: {
    performance: 60,
    accessibility: 100,
    bestPractices: 100,
    seo: 95,
  },
  mobile: {
    performance: 70,
    accessibility: 100,
    bestPractices: 100,
    seo: 95,
  },
}

const modes = Object.keys(thresholds)
const failures = []

for (const mode of modes) {
  const reportPath = path.join(outputDir, `lighthouse-${mode}.json`)
  const reportRaw = await fs.readFile(reportPath, 'utf8')
  const report = JSON.parse(reportRaw)
  const modeThresholds = thresholds[mode]

  for (const [category, minimum] of Object.entries(modeThresholds)) {
    const score = report?.scores?.[category]
    if (typeof score !== 'number') {
      failures.push(`${mode}:${category} missing score in ${reportPath}`)
      continue
    }

    if (score < minimum) {
      failures.push(`${mode}:${category} score ${score} is below baseline ${minimum}`)
    }
  }
}

if (failures.length > 0) {
  console.error('Lighthouse baseline failed:')
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('Lighthouse baseline passed for desktop and mobile thresholds.')
