/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/src/tests/e2e/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/tests/setup.ts"],
  testTimeout: 30000,
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
