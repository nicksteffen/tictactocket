export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^~/(.*)$': '<rootDir>/$1'
    },
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    transform: {
        '^.+\\.ts$': 'ts-jest'
    },
    testMatch: [
        // '<rootDir>/tests/**/*.(spec|test).ts'
        '<rootDir>/**/*.(spec|test).ts'
    ]
};
