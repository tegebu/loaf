module.exports = {
  verbose: true,
  bail: true,
  roots: [
    'src'
  ],
  testRegex: '/__tests__/.+\\.spec\\.tsx?$',
  testPathIgnorePatterns: [
    'node_modules',
    'dist'
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'Mock'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  moduleFileExtensions: [
    'js',
    'jsx',
    'ts',
    'tsx'
  ],
  testURL: 'http://localhost'
};
