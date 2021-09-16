import firebaseAdmin from '../firebase-admin'

describe('firebase admin service', () => {
  it('.env variables are correctly initalized', () => {
    const [testEnv, authPort, firestorePort] = [
      'NODE_ENV',
      'FIREBASE_AUTH_EMULATOR_HOST',
      'FIRESTORE_EMULATOR_HOST'
    ].map((value) => process.env[value])

    expect(testEnv).toBe('test')
    expect(authPort).toBe('localhost:9099')
    expect(firestorePort).toBe('localhost:8080')
  })

  it('is beeing initialized', () => {
    expect(firebaseAdmin.admin.auth).toBeDefined()
    expect(firebaseAdmin.admin.firestore).toBeDefined()
  })
})
