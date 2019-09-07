module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["@netsells"],
  // required to lint *.vue files
  plugins: ["vue"],
  // add your custom rules here
  rules: {
    test: /.(vue|js)$/,
    loader: "eslint-loader",
    enforce: "pre",
    exclude: /node_modules/
  }
};
