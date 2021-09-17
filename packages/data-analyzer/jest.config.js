const setupFiles = ['<rootDir>/.jestEnvVars.js']
if (!process.env.GCP_SA_KEY) setupFiles.push('<rootDir>/firebase.vars.js')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': 'ts-jest'
  },
  setupFiles,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
}
