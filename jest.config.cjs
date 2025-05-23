/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    // Mock CSS modules (if you use them)
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Mock other static assets if needed
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    // Mock react-markdown
    '^react-markdown$': '<rootDir>/__mocks__/react-markdown.js',
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.app.json', // ensure it uses the app-specific tsconfig
      allowJs: true, 
    }],
  },
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // Simplify transformIgnorePatterns as react-markdown is now mocked.
  // Default is usually ["/node_modules/", "\\.pnp\\.[^\\\/]+$"]
  // We might still need to transform lucide-react if it's ESM and used directly in tests or other components.
  transformIgnorePatterns: [
    '/node_modules/(?!lucide-react)/',
  ],
};
