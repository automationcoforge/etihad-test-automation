import { test } from '@playwright/test';
import { Logger } from './logger';

export class StepRunner {
  constructor(private readonly logger: Logger) {}

  async run<T>(name: string, action: () => Promise<T>): Promise<T> {
    return test.step(name, async () => {
      this.logger.info(`Starting: ${name}`);
      try {
        const result = await action();
        this.logger.info(`Completed: ${name}`);
        return result;
      } catch (error) {
        this.logger.error(`Failed: ${name}`, error);
        throw error;
      }
    });
  }
}
