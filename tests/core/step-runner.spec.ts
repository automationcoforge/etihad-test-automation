import { expect, test } from '@playwright/test';
import { Logger } from '../../src/core/logger';
import { StepRunner } from '../../src/core/step-runner';

test('runs an explicitly named step and returns its result', async () => {
  const runner = new StepRunner(new Logger('StepRunner'));

  await expect(
    runner.run('Searching for flights', async () => 'completed search'),
  ).resolves.toBe('completed search');
});

test('logs and rethrows errors from explicitly named steps', async () => {
  const runner = new StepRunner(new Logger('StepRunner'));

  await expect(
    runner.run('Searching for flights', async () => {
      throw new Error('step failed');
    }),
  ).rejects.toThrow('step failed');
});
