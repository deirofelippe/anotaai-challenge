module.exports = {
  clearMocks: true,
  moduleDirectories: ['node_modules', '<rootDir>/'],
  // setupFiles: ["<rootDir>/jest-setup-env.ts"],
  // moduleNameMapper: {
  //   "^@/(.*)$": ["<rootDir>/src/$1"],
  // },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest'
  },

  collectCoverage: false,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  collectCoverageFrom: ['./src/Usecases/**', './src/Validators/**'],
  coverageThreshold: {
    global: {
      lines: 85
    }
  }
};
