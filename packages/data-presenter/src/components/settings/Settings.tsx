import { FunctionalComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { MESSAGE_TYPES } from '../../types/MESSAGE_TYPES'
import Input from '../common/Input'

const Settings: FunctionalComponent = () => {
  const [blackListedPages, setBlackListedPages] = useState<string[]>([])
  const [pageToBlackList, setPageToBlackList] = useState('')
  const [inputKey, setInputKey] = useState(1)

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

  const addBlackList = (url: string) => {
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

  return (
    <div>
      <div>Settings</div>
      <div className="">
        {blackListedPages.map((url, i) => (
          <div key={`url-${i}`}>
            <hr />
            <div className="flex items-center py-1">
              <div className="w-10/12">{url}</div>
              <div
                className="flex-grow pl-2 cursor-pointer hover:underline"
                onClick={() => removeBlackList(url)}>
                Delete
              </div>
            </div>
          </div>
        ))}
        <div className="flex items-center">
          <div className="w-10/12">
            <Input
              key={inputKey}
              onChange={setPageToBlackList}
              placeholder="Enter the url you want to blacklist. E.g www.cnn.com."
            />
          </div>
          <div
            className="flex-grow pl-2 cursor-pointer hover:underline"
            onClick={() => addBlackList(pageToBlackList)}>
            Add
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
