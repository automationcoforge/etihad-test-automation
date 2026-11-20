import { Logger } from './logger';
import { StepRunner } from './step-runner';

export abstract class BaseFlow {
  readonly steps: StepRunner;

  protected constructor(flowName: string) {
    this.steps = new StepRunner(new Logger(flowName));
  }
}
