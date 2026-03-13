const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey.json')

const ADMIN_UID = 'Pj0KEq51XjPp3wZydLrXxKDfR8k2'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

async function setAdminClaim() {
  try {
    await admin.auth().setCustomUserClaims(ADMIN_UID, { isAdmin: true })
    const user = await admin.auth().getUser(ADMIN_UID)
    console.log('✅ Success! Custom claims set:')
    console.log('   UID:', ADMIN_UID)
    console.log('   Claims:', user.customClaims)
    console.log('')
    console.log('👉 Sign out of jsprep.pro and sign back in.')
    console.log('🔒 Delete scripts/serviceAccountKey.json now!')
  } catch (error) {
    console.error('❌ Failed:', error.message)
  }
  process.exit(0)
}

setAdminClaim()