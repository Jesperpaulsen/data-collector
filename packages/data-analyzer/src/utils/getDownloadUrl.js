const admin = require('firebase-admin')

const serviceAccount = require('../../serviceAccount.json')

const options = {
  projectId: 'data-collector-ff33b',
  credential: serviceAccount
    ? admin.credential.cert(serviceAccount)
    : admin.credential.applicationDefault()
}
console.log(process.env.FIRESTORE_EMULATOR_HOST)
admin.initializeApp(options)

const bucket = admin.storage().bucket('gs://data-collector-ff33b.appspot.com')
const file = bucket.file('informationLetters/information_letter.pdf')

const main = async () => {
  const signedUrls = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  console.log(signedUrls[0])
}

main().catch(() => process.exit(1))
