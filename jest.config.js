const { transform } = require("typescript");

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'js'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest'
    },
    testMatch: ['**/?(*.)+(spec|test).ts'],
    setupFiles: ['./jest.setup.js'],
}