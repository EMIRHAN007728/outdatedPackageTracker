const getPackage = require('./getPackage')
const getVersions = require('./getVersions')

async function compareVersion(owner, repo) {
  try {
    // GitHub reposundan package.json içeriğini al
    const packageJsonContent = await getPackage(owner, repo)
    const packageObject = JSON.parse(packageJsonContent)
    const dependencies = packageObject.dependencies

    // Bağımlılıkların isimlerini al
    const packageNames = Object.keys(dependencies)

    // Bağımlılıkların en son sürümlerini al
    const latestVersions = await getVersions(packageNames)

    // Eski sürümleri içeren bir dizi oluştur
    const outdatedModules = []

    // Bağımlılıkları karşılaştır
    packageNames.forEach((packageName) => {
      const currentVersion = dependencies[packageName]
      const latestVersion = latestVersions.find(
        (pkg) => pkg.Name === packageName,
      )?.Version

      if (latestVersion && currentVersion !== latestVersion) {
        outdatedModules.push({
          Name: packageName,
          CurrentVersion: currentVersion,
          LatestVersion: latestVersion,
        })
      }
    })

    // Eski sürümleri içeren diziyi yazdır
    return outdatedModules
  } catch (error) {
    return 'Version Error'
  }
}

module.exports = compareVersion
