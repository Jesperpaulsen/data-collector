module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest'
  },
  setupFiles: ['<rootDir>/.jestEnvVars.js', '<rootDir>/firebase.vars.js'],
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  transformIgnorePatterns: ['node_modules/(?!@node-fetch)/']
}
