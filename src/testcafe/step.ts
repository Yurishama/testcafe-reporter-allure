/* eslint-disable class-methods-use-this,no-param-reassign */
import { loadReporterConfig } from '../utils/config';

const reporterConfig = loadReporterConfig();

export class TestStep {
  public screenshotAmount: number;

  public name: string;

  constructor(name: string) {
    this.screenshotAmount = 0;

    if (name) {
      this.name = name;
    } else {
      this.name = reporterConfig.LABEL.DEFAULT_STEP_NAME;
    }
  }

  public registerScreenshot(): void {
    this.screenshotAmount += 1;
  }

  public addStepToTest(test: TestController): void {
    // Steps can be added to the metadata of the test for persistance.
    const meta: any = this.getMeta(test);
    if (!meta.steps) {
      meta.steps = [];
    }
    meta.steps.push(this);
  }

  // Using the Testcontroller type might cause an error because of a confict with TestCafé's TestController
  private getMeta(testController: any): any {
    let { meta } = testController.testRun.test;
    if (!meta) {
      meta = {};
      testController.testRun.test.meta = meta;
    }
    return meta;
  }
}

/* The TestController loses its parameters when returned as a TestControllerPromise. 
   Therefore the steps cannot be added without a clean TestController.
*/
export default async function step(name: string, testController: TestController, stepAction: any) {
  let stepPromise = stepAction;
  const testStep = new TestStep(name);

  if (reporterConfig.ENABLE_SCREENSHOTS) {
    stepPromise = stepPromise.takeScreenshot();
    testStep.registerScreenshot();
  }

  testStep.addStepToTest(testController);
  return stepPromise;
}