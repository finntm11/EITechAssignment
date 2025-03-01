import { pathsToModuleNameMapper } from 'ts-jest';

const { paths } = require('./tsconfig.json').compilerOptions;

export default {
  preset: 'jest-preset-angular',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  transform: {
    '^.+\\.(ts|js|mjs|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(paths || {}, {
    prefix: '<rootDir>/',
  }),
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary'],
  coverageDirectory: '<rootDir>/coverage/jest',
};
