module.exports = {
  transform: {
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!uuid)" // Transform the uuid module
  ]
};