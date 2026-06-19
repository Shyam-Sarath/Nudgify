const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/shyam sarath s.p/OneDrive/Desktop/4D/mobile';

function modifyFile(filePath, replacements) {
  const absolutePath = path.resolve(projectRoot, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File does not exist: ${absolutePath}`);
    return;
  }
  let content = fs.readFileSync(absolutePath, 'utf8');
  let original = content;
  
  for (const r of replacements) {
    content = content.replace(r.target, r.replacement);
  }
  
  if (content !== original) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Modified: ${filePath}`);
  } else {
    console.log(`No changes for: ${filePath}`);
  }
}

// 1. Add errorContainer to colors.ts
modifyFile('src/theme/colors.ts', [
  { target: "  error: '#ba1a1a', // Crimson", replacement: "  error: '#ba1a1a', // Crimson\n  errorContainer: '#ffdad6'," },
  { target: "  error: '#ffdad6',", replacement: "  error: '#ffdad6',\n  errorContainer: '#93000a'," }
]);

// 2. Fix ErrorState theme import
modifyFile('src/components/ui/ErrorState.tsx', [
  { target: "from '../theme';", replacement: "from '../../theme';" }
]);

// 3. Fix Header theme import
modifyFile('src/components/ui/Header.tsx', [
  { target: "from '../theme';", replacement: "from '../../theme';" }
]);

console.log('Fix last errors script finished!');
