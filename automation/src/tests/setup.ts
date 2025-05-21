// Increase timeout for all tests
jest.setTimeout(30000);

// Global setup before all tests
beforeAll(() => {
  // Add any global setup here
  console.log("Starting E2E tests...");
});

// Global teardown after all tests
afterAll(() => {
  // Add any global cleanup here
  console.log("Finished E2E tests.");
});
