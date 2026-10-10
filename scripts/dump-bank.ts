// Prints every question with its marked answer, for proof-reading:  npx vite-node scripts/dump-bank.ts
import { BANK } from '../src/data/bank'

for (const q of BANK) {
  const tag = q.source === 'nptel' ? '' : `  [${q.source}]`
  console.log(`\n${q.id}${tag}  ${q.q.replace(/\s+/g, ' ')}`)
  if (q.code) console.log(q.code.split('\n').map((l) => '    | ' + l).join('\n'))
  q.options.forEach((o, i) => {
    const mark = i === q.answer ? '  <== ANSWER' : q.alsoCorrect?.includes(i) ? '  <== also ok' : ''
    console.log(`    ${String.fromCharCode(97 + i)}. ${o.replace(/\n/g, ' / ')}${mark}`)
  })
}
