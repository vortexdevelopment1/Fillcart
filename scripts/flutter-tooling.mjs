#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, '..');

const packages = [
  {
    name: 'packages/flutter_shared',
    path: resolve(rootDir, 'packages/flutter_shared'),
  },
  {
    name: 'apps/vendor-app',
    path: resolve(rootDir, 'apps/vendor-app'),
  },
];

const action = process.argv[2];

if (!action || !['format', 'analyze', 'test'].includes(action)) {
  console.error('Usage: node scripts/flutter-tooling.mjs <format|analyze|test>');
  process.exit(1);
}

const getCommand = (action) => {
  switch (action) {
    case 'format':
      return {
        cmd: 'dart',
        args: ['format', '--set-exit-if-changed', 'lib', 'test'],
      };
    case 'analyze':
      return {
        cmd: 'flutter',
        args: ['analyze'],
      };
    case 'test':
      return {
        cmd: 'flutter',
        args: ['test'],
      };
  }
};

const { cmd, args } = getCommand(action);

for (const pkg of packages) {
  console.log(`\n=== Running '${cmd} ${args.join(' ')}' in ${pkg.name} ===`);

  const result = spawnSync(cmd, args, {
    cwd: pkg.path,
    stdio: 'inherit',
    shell: true,
  });

  if (result.error) {
    console.error(`Failed to execute ${cmd} in ${pkg.name}:`, result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(
      `\n❌ Command failed with exit code ${result.status} in ${pkg.name}`,
    );
    process.exit(result.status ?? 1);
  }
}

console.log(`\n✅ Flutter ${action} passed across all Flutter packages.`);
process.exit(0);
