import { type Config } from "jest";

export default {
  verbose: true,
  rootDir: "src",
  moduleFileExtensions: ["js", "json", "ts"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/$1",
  },
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": ["ts-jest", { useESM: true }], // support esm module like vitest
  },
  transformIgnorePatterns: [
    // allow jest transform lodash-es to commonjs module
    // because lodash-es only support esm module
    "/node_modules/(?!lodash-es)/",
  ],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  detectOpenHandles: true,
  forceExit: true,
  setupFilesAfterEnv: ["<rootDir>/../test/jest.setup.ts"],
} as Config;
