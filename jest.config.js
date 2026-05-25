module.exports = {
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!(expo-localization)/)"],
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/.expo/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
