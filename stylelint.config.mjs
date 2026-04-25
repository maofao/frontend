const stylelintConfig = {
  extends: ["stylelint-config-standard", "stylelint-config-css-modules"],
  ignoreFiles: ["**/node_modules/**", ".next/**", "out/**", "build/**"],
};

export default stylelintConfig;
