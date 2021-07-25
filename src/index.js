const plugin = require("tailwindcss/plugin");

function createTextClampPlugin() {
  return plugin(function ({ addUtilities }) {
    const minViewWidthInRem = 640 / 16;
    const maxViewWidthInRem = 1280 / 16;
    const minRem = 0.5;
    const maxRem = 10;
    const pace = 0.05;

    function normalizeString(str) {
      return str.toString().replace(".", "");
    }

    function clampCalculator(minFontSize, maxFontSize) {
      const slope =
        (maxFontSize - minFontSize) / (maxViewWidthInRem - minViewWidthInRem);
      const yAxisIntersection = -minViewWidthInRem * slope + minFontSize;

      return `clamp(${minFontSize}rem, ${yAxisIntersection.toFixed(2)}rem + ${slope.toFixed(2) * 100}vw, ${maxFontSize}rem)`;
    }

    function generatePossibilities() {
      const possibilities = {};
      for (let i = minRem; i < maxRem; i += pace) {
        for (let j = i + 0.2; j <= maxRem; j += pace) {
          i = Number(i.toFixed(2));
          j = Number(j.toFixed(2));
          const first = normalizeString(i);
          const second = normalizeString(j);
          const clamp = clampCalculator(i, j);

          possibilities[`.clamptext-${first}-${second}`] = { fontSize: clamp };
          possibilities[`.clampline-${first}-${second}`] = {
            lineHeight: clamp,
          };
        }
      }

      return possibilities;
    }

    const newUtilities = generatePossibilities();

    addUtilities(newUtilities);
  });
}

module.exports = createTextClampPlugin();
