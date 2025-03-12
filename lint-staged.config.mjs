const config = {
  '*': ['prettier --write --cache --ignore-unknown'],
  'src/**/*.(ts|tsx)': ['eslint --cache --fix'],
};

export default config;
