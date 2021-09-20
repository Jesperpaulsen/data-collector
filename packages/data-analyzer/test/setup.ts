import axios from 'axios'

const deleteAccounts = async () => {
  return axios.delete(
    'http://localhost:9099/emulator/v1/projects/data-collector-ff33b/accounts',
    { headers: { Authorization: 'Bearer owner' } }
  )
}

const deleteDocs = () => {
  return axios.delete(
    'http://localhost:8080/emulator/v1/projects/data-collector-ff33b/databases/(default)/documents',
    { method: 'DELETE' }
  )
}

const deleteAccountsAndDocs = async () => {
  const promises = [deleteAccounts(), deleteDocs()]
  await Promise.all(promises)
}

beforeEach(async () => {
  await deleteAccountsAndDocs()
})

afterAll(async () => {
  await deleteAccountsAndDocs()
})
