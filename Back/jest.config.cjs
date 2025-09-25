module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['**/?(*.)+(spec|test).[jt]s'],
  transform: {},
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  testPathIgnorePatterns: ['/node_modules/']
};
