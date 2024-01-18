const { MongoClient, ObjectId } = require('mongodb')
const cron = require('node-cron')
require('dotenv').config()
const PORT = process.env.PORT
const URI = process.env.URI
const express = require('express')
const api = express()

const client = new MongoClient(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
const myDB = client.db('outdatedapi')
const versions = myDB.collection('versions')

const compareVersion = require('./functions/compareVersion')
const mailer = require('./functions/mailer')

const main = async () => {
  try {
    api.post('/outdated-packages/add/:repo/:mail', async (req, res) => {
      try {
        const mail = req.params.mail
        const repo = req.params.repo

        filter = { Repo: repo }

        if (await versions.find({ Repo: repo })) {
          await versions.updateOne(filter, { $set: { mail: mail } })
          res.status(200).json(`${mail} Addet to ${repo} outdated system`)

          await mailer(mail, versions)
        } else {
          res.status(500).json('Internal Server Error')
        }
      } catch (error) {
        console.error('Hata:', error)
        res.status(500).json('internal server error:', error.message)
      }
    })

    api.get('/outdated-packages/:name/:repo', async (req, res) => {
      try {
        const owner = req.params.name
        const repo = req.params.repo
        res.json(await compareVersion(owner, repo))

        versions.insertOne({
          Owner: owner,
          Repo: repo,
          mail: 'initial@example.com',
        })
        console.log('İnserted to database')
        res.status(200)
      } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
      }
    })

    api.listen(PORT, () => {
      console.log(`Api listening at localhost:${PORT}`)
    })
  } catch (error) {
    console.error('Hata:', error.message)
  }
}

main()
