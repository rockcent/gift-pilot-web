module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/__tests__/**/*.test.ts?(x)'],
  transform: { '^.+\\.tsx?$': ['babel-jest', { configFile: './babel.config.cjs' }] },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@user/(.*)$': '<rootDir>/src/pages/user/$1',
    '^@admin/(.*)$': '<rootDir>/src/pages/admin/$1'
  },
  transformIgnorePatterns: ['/node_modules/(?!@rockcent/)']
};
