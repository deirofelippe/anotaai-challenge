module.exports = {
  clearMocks: true,
  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // setupFiles: ["<rootDir>/jest-setup-env.ts"],
  // moduleNameMapper: {
  //   "^@/(.*)$": ["<rootDir>/src/$1"],
  // },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  }
};
