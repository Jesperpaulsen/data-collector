const setupFiles = ['<rootDir>/.jestEnvVars.js']
if (!process.env.GCP_SA_KEY) setupFiles.push('<rootDir>/firebase.vars.js')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['dist'],
  setupFiles,
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts']
}
