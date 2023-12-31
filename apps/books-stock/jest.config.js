module.exports = {
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // coveragePathIgnorePatterns: ["/node_modules/", "/src/db/"],
  // coverageProvider: "v8",
  // coverageReporters: ["json", "text", "lcov", "clover"],
  moduleFileExtensions: ["js", "ts", "tsx"],
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  "setupFiles": [
    "<rootDir>/jest/setEnvVars.js"
  ],
  testEnvironment: "node"
};
