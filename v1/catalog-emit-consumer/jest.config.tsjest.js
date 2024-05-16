/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // setupFiles: ["<rootDir>/jest-setup-env.ts"],
  // moduleNameMapper: {
  //   "^@/(.*)$": ["<rootDir>/src/$1"],
  // },
  collectCoverage: true,
  mapCoverage: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
  // preset: 'ts-jest',
  // testEnvironment: 'node'
};
