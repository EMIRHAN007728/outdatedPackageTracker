async function getFileContent(owner, repo) {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/package.json`

  try {
    const response = await fetch(apiUrl)

    if (response.ok) {
      const data = await response.json()
      const content = atob(data.content) // Base64 kodlu içeriği çıkarma
      return content
    } else if (response.status === 404) {
      return null
    } else {
      throw new Error(
        `GitHub API'den dosya alınamadı. Hata Kodu: ${response.status}`,
      )
    }
  } catch (error) {
    console.error('Hata:', error.message)
  }
}

module.exports = getFileContent
