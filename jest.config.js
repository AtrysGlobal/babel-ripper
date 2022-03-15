/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@dictionaries/(.*)$': '<rootDir>/src/dictionaries/$1',
    '^@enums/(.*)$': '<rootDir>/src/enums/$1',
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
    '^@helpers/(.*)$': '<rootDir>/src/helpers/$1',
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@locales/(.*)$': '<rootDir>/src/locales/$1',
    '^@srctypes/(.*)$': '<rootDir>/src/types/$1',
  },
};
