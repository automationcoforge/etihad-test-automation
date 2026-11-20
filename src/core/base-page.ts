import type { Page } from '@playwright/test';
import { Logger } from './logger';
import { StepRunner } from './step-runner';
import { UIActions } from './ui-actions';

export abstract class BasePage {
  protected readonly logger: Logger;
  protected readonly steps: StepRunner;
  readonly ui: UIActions;

  protected constructor(protected readonly page: Page, pageName: string) {
    this.logger = new Logger(pageName);
    this.steps = new StepRunner(this.logger);
    this.ui = new UIActions(page, this.steps);
  }
}
