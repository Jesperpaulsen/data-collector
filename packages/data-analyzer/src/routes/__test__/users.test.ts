import request from 'supertest'

import { User } from '@data-collector/types'

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
    const allAccounts = await firebaseAdmin.admin.auth.listUsers()
    expect(allAccounts.users.length).toBe(0)

    const allUserDocs = await firebaseAdmin.admin.firestore.getAllUsers()
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

    const userInDatabase = await firebaseAdmin.admin.firestore.getUser(
      res.body.uid
    )

    expect(userInDatabase?.uid.length).toBe(28)
    expect(userInDatabase?.email).toEqual(testUser.email)
    expect(userInDatabase?.name).toEqual(testUser.name)
    expect(userInDatabase?.role).toEqual('user')
    expect(userInDatabase?.password).toBeUndefined()
  })
})

describe('route /users/admin/:uid method: PUT', () => {
  it('returns 401 if not logged in as admin', async () => {
    const { res } = await createUser()

    await request(app).put(`/users/admin/${res.body.uid}`).expect(401)
  })

  it('updates user to admin', async () => {
    const { res } = await createUser()

    await request(app).put(`/users/admin/${res.body.uid}`).expect(200)
  })
})
