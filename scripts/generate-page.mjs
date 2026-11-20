import { mkdir, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, resolve } from 'node:path';

const pageName = process.argv[2];
if (!pageName || !/^[a-z][a-z0-9-]*$/.test(pageName)) {
  console.error('Usage: npm run generate:page -- <page-name> (lowercase letters, digits, hyphens)');
  process.exitCode = 1;
} else {
  const className = pageName
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
  const folder = resolve('src', 'pages', pageName);
  const expectedParent = resolve('src', 'pages');
  const pathFromPages = relative(expectedParent, folder);

  if (!pathFromPages || pathFromPages.startsWith('..') || isAbsolute(pathFromPages)) {
    throw new Error('Page path must stay inside src/pages.');
  }

  const files = new Map([
    [`${pageName}pageLocators.ts`, `import type { Page } from '@playwright/test';\n\nexport class ${className}PageLocators {\n  constructor(private readonly page: Page) {}\n}\n`],
    [`${pageName}pagemethods.ts`, `import type { Page } from '@playwright/test';\nimport { BasePage } from '../../core/base-page';\nimport { ${className}PageLocators } from './${pageName}pageLocators';\n\nexport class ${className}PageMethods extends BasePage {\n  readonly locators: ${className}PageLocators;\n\n  constructor(page: Page) {\n    super(page, '${className}');\n    this.locators = new ${className}PageLocators(page);\n  }\n}\n`],
    [`${pageName}pageflows.ts`, `import type { Page } from '@playwright/test';\nimport { BaseFlow } from '../../core/base-flow';\nimport { ${className}PageMethods } from './${pageName}pagemethods';\n\nexport class ${className}PageFlows extends BaseFlow {\n  readonly methods: ${className}PageMethods;\n\n  constructor(page: Page) {\n    super('${className}PageFlows');\n    this.methods = new ${className}PageMethods(page);\n  }\n}\n`],
  ]);

  await mkdir(folder, { recursive: true });
  for (const [fileName, contents] of files) {
    const filePath = join(folder, fileName);
    try {
      await writeFile(filePath, contents, { flag: 'wx' });
    } catch (error) {
      if (error.code === 'EEXIST') {
        throw new Error(`Refusing to overwrite existing file: ${filePath}`);
      }
      throw error;
    }
    console.log(`Created ${filePath}`);
  }
}
