module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
