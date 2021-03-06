module.exports = {
  content: ['index.html', './src/**/*.{js,jsx,ts,tsx,vue,html}'],
  theme: {
    extend: {
      colors: {
        icon: {
          inactive: '#7a7a7a',
          hover: '#8c9290',
          active: '#15e38a',
          'split-active': '#15e38a transparent #15e38a transparent'
        }
      },
      animation: {
        'bounce-horizontal': 'bounce-horizontal-animation 2s infinite ease'
      },
      keyframes: {
        'bounce-horizontal-animation': {
          '50%': { 'background-position': 'left' }
        }
      }
    },
  },
  plugins: [],
}
