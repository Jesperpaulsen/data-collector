module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/__tests__'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    'node_modules/variables/.+\\.(j|t)sx?$': 'ts-jest'
  },
  testRegex: '(/__tests__/.*.(test|spec)).(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  coveragePathIgnorePatterns: ['(tests/.*.mock).(jsx?|tsx?)$'],
  testTimeout: 30000,
  transformIgnorePatterns: ['node_modules/(?!variables/.*)'],
  setupFiles: ['<rootDir>/.jestEnvVars.js']
}
