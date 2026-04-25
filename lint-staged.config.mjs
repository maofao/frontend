const lintStagedConfig = {
  "*.{js,mjs,cjs,ts,tsx}": ["eslint --fix --max-warnings 0"],
  "*.{js,mjs,cjs,ts,tsx,json,md,css,yml,yaml}": ["prettier --write"],
  "*.css": ["stylelint --fix --allow-empty-input"],
};

export default lintStagedConfig;
