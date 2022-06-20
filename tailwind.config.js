module.exports = {
  content: [
    './_includes/**/*.html',
    './_layouts/**/*.html',
    './_posts/*.md',
    './*.html',
  ],
  corePlugins: {
    backgroundOpacity: false,
    textOpacity: false
  },
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'sans-serif'],
      serif: ['PT Serif', 'serif'],
    },
    colors: {
      matisse: '#3366BB'
    },
    extend: {},
  },
  plugins: []
}
