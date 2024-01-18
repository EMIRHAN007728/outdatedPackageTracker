async function getVersion(dependencies) {
  try {
    const latestVersions = []

    for (let i = 0; i < dependencies.length; i++) {
      const packageName = dependencies[i]

      const result = await fetch(
        `https://registry.npmjs.org/${packageName}/latest`,
      )
      if (!result.ok) {
        throw new Error(
          `NPM üzerinden ${packageName} paketi alınamadı. Hata Kodu: ${result.status}`,
        )
      }

      const packageInfo = await result.json()

      latestVersions.push({
        Name: packageInfo.name,
        Version: packageInfo.version,
      })
    }

    // Tüm sürüm bilgilerini döndür
    return latestVersions
  } catch (error) {
    console.error('Hata:', error.message)
    throw error // Hataları yukarı iletebilir veya özel bir şekilde yönetebilirsiniz
  }
}

module.exports = getVersion
