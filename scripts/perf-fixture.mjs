import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const outputArg = process.argv[2] ?? 'scripts/perf-fixture.md';
const sectionCountArg = Number.parseInt(process.argv[3] ?? '500', 10);
const sectionCount = Number.isFinite(sectionCountArg) && sectionCountArg > 0 ? sectionCountArg : 500;

const lines = ['# MD-View Performance Fixture', '', `Generated sections: ${sectionCount}`, ''];

for (let i = 1; i <= sectionCount; i += 1) {
  lines.push(`## Section ${i}`);
  lines.push('');
  lines.push(`Paragraph ${i}: This is synthetic markdown content for editor and preview performance baselines.`);
  lines.push('');
  lines.push('- Item A');
  lines.push('- Item B');
  lines.push('- Item C');
  lines.push('');
  lines.push('```ts');
  lines.push(`export const section${i} = "performance-fixture-${i}";`);
  lines.push('```');
  lines.push('');
}

const outputPath = resolve(outputArg);
writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');

console.log(`Wrote fixture to ${outputPath}`);
console.log(`Line count: ${lines.length + 1}`);
