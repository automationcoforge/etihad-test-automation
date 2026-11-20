import type { Locator, Page } from '@playwright/test';
import { StepRunner } from './step-runner';

export class UIActions {
  constructor(
    private readonly page: Page,
    private readonly steps: StepRunner,
  ) {}

  click(locator: Locator, description: string): Promise<void> {
    return this.steps.run(`Click: ${description}`, () => locator.click());
  }

  fill(locator: Locator, value: string, description: string): Promise<void> {
    return this.steps.run(`Fill: ${description}`, () => locator.fill(value));
  }

  press(locator: Locator, key: string, description: string): Promise<void> {
    return this.steps.run(`Press ${key}: ${description}`, () => locator.press(key));
  }

  check(locator: Locator, description: string): Promise<void> {
    return this.steps.run(`Check: ${description}`, () => locator.check());
  }

  selectOption(
    locator: Locator,
    values: Parameters<Locator['selectOption']>[0],
    description: string,
  ): Promise<string[]> {
    return this.steps.run(`Select option: ${description}`, () =>
      locator.selectOption(values),
    );
  }

  waitFor(
    locator: Locator,
    state: 'attached' | 'detached' | 'visible' | 'hidden',
    description: string,
  ): Promise<void> {
    return this.steps.run(`Wait for ${state}: ${description}`, () =>
      locator.waitFor({ state }),
    );
  }

  scrollIntoView(locator: Locator, description: string): Promise<void> {
    return this.steps.run(`Scroll to: ${description}`, () =>
      locator.scrollIntoViewIfNeeded(),
    );
  }

  navigate(url: string, description: string): Promise<unknown> {
    return this.steps.run(`Navigate: ${description}`, () =>
      this.page.goto(url, { waitUntil: 'domcontentloaded' }),
    );
  }
}
