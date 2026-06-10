const fs = require('fs');
const dir = '.design_tmp/bilimtrack-blog/project/assets/';

let inlineSrc = fs.readFileSync(dir + 'icons-inline.js', 'utf8');
inlineSrc = inlineSrc.slice(0, inlineSrc.indexOf('function icon'));
const ICON = (new Function(inlineSrc + '\n return ICON;'))();

let adminSrc = fs.readFileSync(dir + 'admin-icons.js', 'utf8');
const merged = (new Function('ICON', adminSrc + '\n return ICON;'))(ICON);

const out =
  '/* AUTO-GENERATED from the design bundle (icons-inline.js + admin-icons.js).\n' +
  '   Inline Tabler/custom SVGs that render reliably everywhere. */\n\n' +
  'export const ICONS: Record<string, string> = ' +
  JSON.stringify(merged, null, 2) + ';\n\n' +
  'export type IconName = keyof typeof ICONS;\n';
fs.writeFileSync('src/shared/ui/Icon/icons.ts', out);
console.log('Wrote', Object.keys(merged).length, 'icons:', Object.keys(merged).sort().join(', '));
