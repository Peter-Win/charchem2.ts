module.exports = {
  roots: [
    "<rootDir>/src",
  ],
  testEnvironment: "jsdom",
  moduleNameMapper: {
  },
  preset: "ts-jest",
  "setupFiles": ["jest-canvas-mock"],
};
