/**
 * Mantine's own CSS uses `light-dark()` and `rem()`, which only compile with
 * postcss-preset-mantine. Without it nothing errors - the styles just come out
 * wrong, which is a much worse failure than a build break.
 */
module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
  },
};
