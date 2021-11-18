import { Fragment, FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import Input from '../common/Input'
import Button from '../common/Button'
import { SHOW_USAGE } from '../../config'

const validateUrl = (input: string) => {
  let url: URL

  try {
    url = new URL(input)
  } catch (e) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

const Settings: FunctionalComponent = () => {
  const [blackListedPages, setBlackListedPages] = useState<string[]>([])
  const [pageToBlackList, setPageToBlackList] = useState('')
  const [inputKey, setInputKey] = useState(1)
  const [error, setError] = useState('')

  useEffect(() => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.REQUEST_BLACKLISTED_PAGES
    })

    chrome.runtime.onMessage.addListener((details) => {
      const { type } = details

      if (type === MESSAGE_TYPES.SEND_BLACKLISTED_PAGES) {
        const { payload } = details
        setBlackListedPages(payload)
      }
    })
  }, [setBlackListedPages])

  useEffect(() => {
    setError('')
  }, [pageToBlackList])

  const addBlackList = (url: string) => {
    if (!validateUrl(url)) {
      setError(
        'Make sure you add a valid url, that starts with either http or https'
      )
      return
    }
    setError('')
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.ADD_BLACKLISTED_PAGE,
      payload: url
    })
    setPageToBlackList('')
    setInputKey((inputKey) => inputKey + 1)
  }

  const removeBlackList = (url: string) => {
    chrome.runtime.sendMessage({
      type: MESSAGE_TYPES.DELETE_BLACKLISTED_PAGE,
      payload: url
    })
  }

  const resetCounter = () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.REQUEST_RESET_COUNTER })
  }

  return (
    <div>
      {SHOW_USAGE && (
        <Fragment>
          <div>
            If the reported usage doesn't look correct, you can try to reset
            todays usage manually:
          </div>
          <div className="flex justify-center pt-2">
            <Button onClick={resetCounter}>Reset counter</Button>
          </div>
        </Fragment>
      )}
      <div className="pt-4 text-base">Blacklisted domains.</div>
      <div className="text-sm">
        We won't report the usage from these urls. The list of urls are only
        stored on your computer and not in our database.
      </div>
      <div className="flex items-center py-4">
        <div className="w-10/12">
          <Input
            key={inputKey}
            onChange={setPageToBlackList}
            placeholder="Enter the url you want to blacklist. E.g https://www.cnn.com"
          />
        </div>
        <div
          className="flex-grow pl-2 cursor-pointer hover:underline"
          onClick={() => addBlackList(pageToBlackList)}>
          Add
        </div>
      </div>
      {error.length > 0 && <div className="text-sm text-red-700">{error}</div>}
      {blackListedPages.length > 0 && (
        <Fragment>
          Blacklisted pages:
          <div className="bg-white rounded shadow-lg text-black p-2">
            {blackListedPages.map((url, i) => (
              <div key={`url-${i}`}>
                <div className="flex items-center py-1">
                  <div className="w-10/12 text-sm">{url}</div>
                  <div
                    className="flex-grow pl-2 cursor-pointer hover:underline"
                    onClick={() => removeBlackList(url)}>
                    Delete
                  </div>
                </div>
                <hr className="bg-black" />
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  )
}

export default Settings
