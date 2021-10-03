export  default  {
    moduleDirectories: ['node_modules', '<rootDir>'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    extensionsToTreatAsEsm: ['.ts'],
    "globals": {
      "ts-jest": {
        "useESM": true
      }
    },
  };