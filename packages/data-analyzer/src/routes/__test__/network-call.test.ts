import request from 'supertest'

import { NetworkCall, NetworkCallDoc, User } from '@data-collector/types'

import { getUserToken } from '../../../test/utils'
import { app } from '../../app'
import firebaseAdmin from '../../services/firebase-admin'

const testNetworkCall: NetworkCall = {
  headers:
    "cache-control: max-age=900, privatecontent-encoding: gzipcontent-security-policy: default-src 'none'; base-uri 'self'; block-all-mixed-content; child-src github.githubassets.com; connect-src 'self' uploads.github.com www.githubstatus.com collector.githubapp.com api.github.com github-cloud.s3.amazonaws.com github-production-repository-file-5c1aeb.s3.amazonaws.com github-production-upload-manifest-file-7fdce7.s3.amazonaws.com github-production-user-asset-6210df.s3.amazonaws.com cdn.optimizely.com logx.optimizely.com/v1/events translator.github.com wss://alive.github.com; font-src github.githubassets.com; form-action 'self' github.com gist.github.com; frame-ancestors 'none'; frame-src render.githubusercontent.com viewscreen.githubusercontent.com; img-src 'self' data: github.githubassets.com identicons.github.com collector.githubapp.com github-cloud.s3.amazonaws.com secured-user-images.githubusercontent.com/ *.githubusercontent.com; manifest-src 'self'; media-src github.com user-images.githubusercontent.com/; script-src github.githubassets.com; style-src 'unsafe-inline' github.githubassets.com; worker-src github.githubassets.com github.com/socket-worker-0af8a29d.js gist.github.com/socket-worker-0af8a29d.jscontent-type: application/json; charset=utf-8date: Mon, 20 Sep 2021 13:17:18 GMTetag: W/\"b086cd16a5d1e1190981cda623503729\"expect-ct: max-age=2592000, report-uri=\"https://api.github.com/_private/browser/errors\"permissions-policy: interest-cohort=()referrer-policy: origin-when-cross-origin, strict-origin-when-cross-originserver: GitHub.comstrict-transport-security: max-age=31536000; includeSubdomains; preloadvary: X-PJAX, X-PJAX-Container, Accept-Encoding, Accept, X-Requested-Withx-content-type-options: nosniffx-frame-options: denyx-github-request-id: D4F3:108B8:140886F:15C4463:614889DDx-xss-protection: 0",
  hostOrigin: 'https://github.com',
  hostPathname: '/marketplace/actions/github-action-for-firebase',
  timestamp: Date.now(),
  type: 'json',
  targetOrigin: 'https://github.com',
  targetPathname: '/users/Jesperpaulsen/feature_preview/indicator_check',
  manuallyCalculated: true,
  size: 1855,
  userId: 'iK3zNJGCP0Ry6ENuiZTSTPFVeVW2'
}

const testNetworkCallDoc: NetworkCallDoc = {
  hostOrigin: 'https://github.com',
  size: 1855,
  userId: 'iK3zNJGCP0Ry6ENuiZTSTPFVeVW2',
  CO2: 374,
  country: 'NO',
  date: firebaseAdmin.firestore.getDateString(),
  numberOfCallsWithoutSize: 3,
  uid: firebaseAdmin.firestore.getDocId(
    'country',
    'iK3zNJGCP0Ry6ENuiZTSTPFVeVW2'
  )!
}

const createNetworkCall = async (
  networkCall: NetworkCall,
  token: string,
  expectedCode = 201,
  isUpdate = false
) => {
  const res = await request(app)
    [isUpdate ? 'put' : 'post'](
      `/network-call${isUpdate ? `/${networkCall.uid}` : ''}`
    )
    .set('authorization', `Bearer ${token}`)
    .send(networkCall)
    .expect(expectedCode)
  return { res }
}

describe('route: /network-call method: POST', () => {
  beforeEach(async () => {
    const allNetworkCallDocs =
      await firebaseAdmin.firestore.getAllNetworkCalls()
    expect(allNetworkCallDocs.length).toBe(0)
  })

  it('returns 401 if not logged in when creating network call', async () => {
    await createNetworkCall(testNetworkCall, '', 401)
  })

  it('returns 400 if missing field when creating network call', async () => {
    const { token } = await getUserToken()
    for (const field of Object.keys(testNetworkCall)) {
      const networkCall = { ...testNetworkCall }
      delete networkCall[field]
      await createNetworkCall(networkCall, token, 400)
    }
  })

  it('returns 400 if userId is wrong when creating network call', async () => {
    const { token } = await getUserToken()
    const networkCall = { ...testNetworkCall, userId: '12345test' }
    await createNetworkCall(networkCall, token, 400)
  })

  it('returns 401 if trying to add a network call for a different user', async () => {
    const { token } = await getUserToken()
    await createNetworkCall(testNetworkCall, token, 401)
  })

  it('returns 201 when logged in when creating network call', async () => {
    const { token, user } = await getUserToken()
    const networkCall = { ...testNetworkCall, userId: user.uid }
    const { res } = await createNetworkCall(networkCall, token, 201)

    const countryDoc = await firebaseAdmin.firestore.getNetworkCall(
      'country',
      testNetworkCallDoc.uid!
    )

    const hostDoc = await firebaseAdmin.firestore.getNetworkCall(
      'host',
      testNetworkCallDoc.uid!
    )

    expect(countryDoc).toBeDefined()
    expect(hostDoc).toBeDefined()
  })
})

describe('route: /network-call/:uid method: PUT', () => {
  let user: User
  let token: string

  beforeEach(async () => {
    const allNetworkCallDocs =
      await firebaseAdmin.firestore.getAllNetworkCalls()
    expect(allNetworkCallDocs.length).toBe(0)
    const res = await getUserToken()
    user = res.user
    token = res.token
  })

  it('returns 401 if not logged in when updating network call', async () => {
    await createNetworkCall(testNetworkCall, '', 401, true)
  })

  it('returns 400 if userId is wrong when updating network call', async () => {
    const { token } = await getUserToken()
    const networkCall = { ...testNetworkCall, userId: '12345test' }
    await createNetworkCall(networkCall, token, 400, true)
  })

  it('returns 401 if trying to update a network call for a different user', async () => {
    const { token } = await getUserToken()
    const res = await firebaseAdmin.firestore.storeNetworkCall(
      testNetworkCall,
      '123'
    )
    const networkCall = { ...testNetworkCall, uid: res.host }
    await createNetworkCall(networkCall, token, 401, true)
  })

  it('returns 400 if uid for network call is missing when updating network call', async () => {
    const networkCall = { ...testNetworkCall, userId: user.uid }
    delete networkCall.uid
    await createNetworkCall(networkCall, token, 400, true)
  })

  // TODO: Update this with the new structure
  it.skip('returns 200 when logged in when updating network call', async () => {
    const { token, user } = await getUserToken()
    const networkCall = { ...testNetworkCall, userId: user.uid! }
    const uid = '123'
    const networkCallWithUid = { ...networkCall, uid }

    const { res } = await createNetworkCall(
      networkCallWithUid,
      token,
      200,
      true
    )
  })
})

const createBatchNetworkCalls = async (
  { userId, networkCalls }: { userId: string; networkCalls: NetworkCall[] },
  token: string,
  expectedCode: number
) => {
  const res = await request(app)
    .post('/network-call/batch')
    .set('authorization', `Bearer ${token}`)
    .send({ userId, networkCalls })
    .expect(expectedCode)

  return { res }
}

describe('route: /network-call/batch method: POST', () => {
  beforeEach(async () => {
    const allNetworkCallDocs =
      await firebaseAdmin.firestore.getAllNetworkCalls()
    expect(allNetworkCallDocs.length).toBe(0)
  })

  it('returns 401 if not logged in when creating batched network call', async () => {
    const { user } = await getUserToken()
    await createBatchNetworkCalls(
      { userId: user.uid, networkCalls: [testNetworkCall] },
      '',
      401
    )
  })

  // TODO: Make sure sanitation works on arrays
  it.skip('returns 400 if missing field when creating batched network call', async () => {
    const { user, token } = await getUserToken()
    for (const field of Object.keys(testNetworkCall)) {
      const networkCall = { ...testNetworkCall }
      delete networkCall[field]
      await createBatchNetworkCalls(
        { userId: user.uid, networkCalls: [networkCall] },
        token,
        400
      )
    }
  })

  it('returns 400 if userId is wrong when creating batched network call', async () => {
    const { token } = await getUserToken()
    const networkCall = { ...testNetworkCall }
    await createBatchNetworkCalls(
      { userId: '12345test', networkCalls: [networkCall] },
      token,
      400
    )
  })

  it('returns 401 if trying to add batched network calls for a different user', async () => {
    const { token } = await getUserToken()
    await createBatchNetworkCalls(
      { userId: testNetworkCall.userId!, networkCalls: [testNetworkCall] },
      token,
      401
    )
  })

  it('returns 201 when creating batched network calls', async () => {
    const { token, user } = await getUserToken()
    await createBatchNetworkCalls(
      { userId: user.uid, networkCalls: [testNetworkCall] },
      token,
      201
    )
  })
})

describe('route: /network-call/user/:uid method: GET', () => {
  beforeEach(async () => {
    const allNetworkCallDocs =
      await firebaseAdmin.firestore.getAllNetworkCalls()
    expect(allNetworkCallDocs.length).toBe(0)
  })

  it('returns 401 if not logged in when fetching network call', async () => {
    await request(app).get('/network-call/user/1234').send().expect(401)
  })

  it('returns 401 if trying to get network calls for a different user', async () => {
    const { token } = await getUserToken()
    await request(app)
      .get('/network-call/user/12345')
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(401)
  })

  it('returns 200 and network calls when fetching network calls for user', async () => {
    const { token, user } = await getUserToken()
    await request(app)
      .get(`/network-call/user/${user.uid}`)
      .set('authorization', `Bearer ${token}`)
      .send()
      .expect(200)
  })
})
