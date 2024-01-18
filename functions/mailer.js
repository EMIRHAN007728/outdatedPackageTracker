const cron = require('node-cron')
const nodemailer = require('nodemailer')
require('dotenv').config()
const compareVersion = require('../functions/compareVersion')
const sendOutdatedPackageEmail = async (email, db) => {
  // Nodemailer ile mail gönderimi için gerekli ayarlar
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  const document = await db.findOne({ mail: email })
  const owner = document.Owner
  const repo = document.Repo
  const outdatedpackages = await compareVersion(owner, repo)

  // Cron görevi oluştur ve her 24 saatte bir çalıştır
  cron.schedule('0 0 */1 * *', async () => {
    console.log('mailer started')
    try {
      // Burada Outdatedpackage mesajı oluşturabilirsiniz
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Outdatedpackage Warning',
        text: 'Outdated Packages: ' + JSON.stringify(outdatedpackages),
      }

      // Mail gönder
      await transporter.sendMail(mailOptions)

      console.log(`Outdatedpackage email sent to ${email}`)
    } catch (error) {
      console.error('Hata:', error.message)
      throw new Error('Mailer Error')
    }
  })
}

module.exports = sendOutdatedPackageEmail
