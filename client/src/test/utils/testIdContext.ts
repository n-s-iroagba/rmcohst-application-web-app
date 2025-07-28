import { generateComponentFormTestIds } from "@/utils/testIdGenerator";


interface TestIdContextValue<T> {
  FIELD_TEST_IDS: Record<keyof T, string>;
  SUBMIT_BUTTON_TEST_ID: string;
}

class TestIdContext<T extends Record<string, any>> {
  private context: TestIdContextValue<T> | null = null;

  setContext(defaultData: T, testIdBase: string): void {
    this.context = generateComponentFormTestIds(defaultData, testIdBase);
  }

  getContext(): TestIdContextValue<T> {
    if (!this.context) {
      throw new Error('TestIdContext has not been initialized. Call setContext() first.');
    }
    return this.context;
  }

  reset() {
    this.context = null;
  }
}

// Create a singleton instance
export const testIdContext = new TestIdContext();
