const getVersion = require('../functions/getVersions')

const dependencies = ['dotenv']
const expected = { Name: 'dotenv', Version: '16.3.1' }

test('Is it working', async () => {
  const versions = await getVersion(dependencies)

  // Check if at least one object in the versions array matches the expected object
  expect(versions).toContainEqual(expected)
})
