import request from 'supertest'

import { NetworkCall } from '@data-collector/types'

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
  url: 'https://github.com/users/Jesperpaulsen/feature_preview/indicator_check',
  manuallyCalculated: true,
  size: 1855,
  userId: 'iK3zNJGCP0Ry6ENuiZTSTPFVeVW2'
}

const createNetworkCall = async (
  networkCall: NetworkCall,
  token: string,
  expectedCode = 201
) => {
  const res = await request(app)
    .post('/network-call')
    .set('authorization', `Bearer ${token}`)
    .send(networkCall)
    .expect(expectedCode)
  return { testNetworkCall, res }
}

describe('route: /network-call method: POST', () => {
  beforeEach(async () => {
    const allNetworkCallDocs =
      await firebaseAdmin.firestore.getAllNetworkCalls()
    expect(allNetworkCallDocs.empty).toBeTruthy()
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
    await createNetworkCall(networkCall, token, 201)
  })
})
