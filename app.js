const { MongoClient } = require('mongodb')
require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const express = require('express')
const api = express()

/*const client = new MongoClient(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  const myDB = client.db('outdatedapi')
  const versions = myDB.collection("versions")
*/

const compareVersion = require('./functions/compareVersion')

const main = async () => {
  try {
    api.get('/outdated-packages/:name/:repo', async (req, res) => {
      const owner = req.params.name
      const repo = req.params.repo
      await compareVersion(req, res, owner, repo)
    })

    api.listen(PORT, () => {
      console.log(`Api listening at localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Hata:', error.message)
  }
}

main()
