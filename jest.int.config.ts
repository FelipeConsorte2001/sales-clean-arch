const { pathsToModuleNameMapper } = require('ts-jest')
const tsconfig = require('./tsconfig.json')
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testRegex: '.*\\..*int-spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  transformIgnorePatterns: [
    '/node_modules/(?!(@faker-js/faker|@prisma/client))/',
  ],
}
