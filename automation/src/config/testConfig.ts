export const testConfig = {
  baseUrl: process.env.TEST_BASE_URL || "http://localhost:3000",
  timeout: 30000,
  viewport: {
    width: 1280,
    height: 800,
  },
  credentials: {
    testUser: {
      email: process.env.TEST_USER_EMAIL || "test@example.com",
      password: process.env.TEST_USER_PASSWORD || "testpassword",
    },
  },
};
