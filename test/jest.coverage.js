module.exports = {
  rootDir: "..",
  preset: "ts-jest",
  testEnvironment: "node",
  testTimeout: 15000,
  testMatch: ["<rootDir>/src/*.test.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "json", "lcov", "clover"],
  collectCoverage: true,
  collectCoverageFrom: ["<rootDir>/src/**/*.ts", "!<rootDir>/src/*/*.test.ts"],
};
