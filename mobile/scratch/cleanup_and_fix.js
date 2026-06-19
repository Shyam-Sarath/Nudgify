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

function deleteFile(filePath) {
  const absolutePath = path.resolve(projectRoot, filePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
    console.log(`Deleted: ${filePath}`);
  } else {
    console.log(`File already deleted: ${filePath}`);
  }
}

// 1. Move ErrorState.tsx and update imports
const errorStateContent = fs.readFileSync(path.resolve(projectRoot, 'src/components/ErrorState.tsx'), 'utf8')
  .replace("import { Button } from './Button';", "import { Button } from './Button';")
  .replace("style?: ViewStyle;", "style?: StyleProp<ViewStyle>;")
  .replace("import { View, Text, StyleSheet } from 'react-native';", "import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';");

fs.writeFileSync(path.resolve(projectRoot, 'src/components/ui/ErrorState.tsx'), errorStateContent, 'utf8');
console.log('Moved ErrorState.tsx to ui/');

// 2. Move Header.tsx
const headerContent = fs.readFileSync(path.resolve(projectRoot, 'src/components/Header.tsx'), 'utf8');
fs.writeFileSync(path.resolve(projectRoot, 'src/components/ui/Header.tsx'), headerContent, 'utf8');
console.log('Moved Header.tsx to ui/');

// 3. Update src/components/ui/index.ts to export ErrorState and Header
modifyFile('src/components/ui/index.ts', [
  {
    target: "export { Divider } from './Divider';",
    replacement: "export { Divider } from './Divider';\nexport { ErrorState } from './ErrorState';\nexport { Header } from './Header';"
  }
]);

// 4. Update src/components/index.ts to ONLY export from ui and business
fs.writeFileSync(path.resolve(projectRoot, 'src/components/index.ts'), `export * from './ui';
export * from './business';
`, 'utf8');
console.log('Updated src/components/index.ts exports');

// 5. Delete obsolete files
const obsoleteFiles = [
  'src/theme/theme.ts',
  'src/components/Button.tsx',
  'src/components/Input.tsx',
  'src/components/Card.tsx',
  'src/components/LoadingSkeleton.tsx',
  'src/components/Badge.tsx',
  'src/components/EmptyState.tsx',
  'src/components/ErrorState.tsx',
  'src/components/Header.tsx',
];
obsoleteFiles.forEach(deleteFile);

// 6. Fix BottomSheet.tsx SafeAreaView and absoluteFillObject
modifyFile('src/components/ui/BottomSheet.tsx', [
  {
    target: "import { Modal as RNModal, StyleSheet, View, Pressable, StyleProp, ViewStyle, SafeAreaView } from 'react-native';",
    replacement: "import { Modal as RNModal, StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';\nimport { SafeAreaView } from 'react-native-safe-area-context';"
  },
  {
    target: "StyleSheet.absoluteFillObject",
    replacement: "StyleSheet.absoluteFill"
  }
]);

// 7. Fix ChefCard.tsx absoluteFillObject
modifyFile('src/components/business/ChefCard.tsx', [
  {
    target: "StyleSheet.absoluteFillObject",
    replacement: "StyleSheet.absoluteFill"
  }
]);

// 8. Fix ChefDashboardScreen.js styles.headerLeft
modifyFile('src/screens/chef/ChefDashboardScreen.js', [
  {
    target: "  container: {\n    flex: 1,\n  },",
    replacement: "  container: {\n    flex: 1,\n  },\n  headerLeft: {},\n"
  }
]);

console.log('Cleanup and Fix script finished!');
