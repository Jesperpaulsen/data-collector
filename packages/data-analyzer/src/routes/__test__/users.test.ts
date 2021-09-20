import request from 'supertest'

import { User } from '@data-collector/types'

import { getAdminToken } from '../../../test/utils'
import { app } from '../../app'
import firebaseAdmin from '../../services/firebase-admin'

const createUser = async (expectedCode = 201) => {
  const testUser: Partial<User> = {
    email: 'test@test.com',
    name: 'Test Testesen'
  }

  const res = await request(app)
    .post('/users')
    .send({ ...testUser, password: 'test123' })
    .expect(expectedCode)
  return { testUser, res }
}

describe('route: /users method: POST', () => {
  beforeEach(async () => {
    const allAccounts = await firebaseAdmin.auth.listUsers()
    expect(allAccounts.users.length).toBe(0)

    const allUserDocs = await firebaseAdmin.firestore.getAllUsers()
    expect(allUserDocs.empty).toBeTruthy()
  })

  it('returns 500 if email exists when creating user', async () => {
    await createUser()
    await createUser(500)
  })

  it('returns 400 if missing email when creating user', async () => {
    await request(app).post('/users').send({ password: 'test123' }).expect(400)
  })

  it('returns 400 if missing password when creating user', async () => {
    await request(app)
      .post('/users')
      .send({ email: 'test@test.com', name: 'Test' })
      .expect(400)
  })

  it('returns 400 if missing name when creating user', async () => {
    await request(app)
      .post('/users')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(400)
  })

  it('returns 400 with invalid email', async () => {
    await request(app)
      .post('/users')
      .send({ email: 'testtest.com', name: 'Test', password: 'test123' })
      .expect(400)
  })

  it('returns 400 with invalid password', async () => {
    await request(app)
      .post('/users')
      .send({ email: 'test@test.com', password: 'tes', name: 'Test' })
      .expect(400)
  })

  it('returns 201 and creates a user sucessfully', async () => {
    const { res, testUser } = await createUser()

    const userInDatabase = await firebaseAdmin.firestore.getUser(res.body.uid)

    expect(userInDatabase?.uid.length).toBe(28)
    expect(userInDatabase?.email).toEqual(testUser.email)
    expect(userInDatabase?.name).toEqual(testUser.name)
    expect(userInDatabase?.role).toEqual('user')
    // @ts-ignore
    expect(userInDatabase?.password).toBeUndefined()
  })
})

describe('route /users/admin/:uid method: PUT', () => {
  it('returns 401 if not logged in as admin', async () => {
    const { res } = await createUser()
    await request(app)
      .put(`/users/admin/${res.body.uid}`)
      .send({ role: 'admin' })
      .expect(401)
  })

  it('returns 200 and updates user to admin if issued by admin', async () => {
    const token = await getAdminToken()
    const { res } = await createUser()
    await request(app)
      .put(`/users/admin/${res.body.uid}`)
      .set('authorization', `Bearer ${token}`)
      .send({ role: 'admin' })
      .expect(200)

    const userInDatabase = await firebaseAdmin.firestore.getUser(res.body.uid)
    expect(userInDatabase).toEqual({ ...res.body, role: 'admin' })
  })

  it('returns 200 and degrades user to user if issued by admin', async () => {
    const token = await getAdminToken()
    const { res } = await createUser()
    await request(app)
      .put(`/users/admin/${res.body.uid}`)
      .set('authorization', `Bearer ${token}`)
      .send({ role: 'user' })
      .expect(200)

    const userInDatabase = await firebaseAdmin.firestore.getUser(res.body.uid)
    expect(userInDatabase).toEqual({ ...res.body, role: 'user' })
  })
})
