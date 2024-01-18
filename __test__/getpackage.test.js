const getPackage = require('../functions/getPackage')

const response = {
  dependencies: {
    autoprefixer: '^10.4.2',
    postcss: '^8.4.5',
    'svelte-range-slider-pips': '^2.0.2',
    tailwindcss: '^3.0.18',
  },
}

test('Is it working', async () => {
  const packageData = await getPackage('peymil', 'CoolModFiles')
  const result = JSON.parse(packageData).dependencies

  expect(result).toEqual(response.dependencies)
})
