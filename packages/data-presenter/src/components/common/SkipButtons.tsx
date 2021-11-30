import { FunctionalComponent } from 'preact'

interface Props {
  currentIndex: number
  maxIndex: number
  prevBtnClicked: () => void
  nextBtnClicked: () => void
  infinty?: boolean
}

const SkipButtons: FunctionalComponent<Props> = ({
  currentIndex,
  maxIndex,
  prevBtnClicked,
  nextBtnClicked,
  infinty = false
}) => {
  const prevClicked = () => {
    if (currentIndex > 0 || infinty) prevBtnClicked()
  }

  const nextClicked = () => {
    if (currentIndex < maxIndex - 1 || infinty) nextBtnClicked()
  }

  return (
    <div className="flex z-0">
      <div
        onClick={prevClicked}
        className={`border bg-white hover:bg-gray-300 text-black flex justify-center items-center w-9 h-9 rounded ${
          currentIndex > 0 || infinty
            ? 'cursor-pointer'
            : 'cursor-not-allowed opacity-50'
        }`}>
        <svg
          width="10"
          height="17"
          viewBox="0 0 10 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8.5 15.5L1.5 8.5L8.5 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        onClick={nextClicked}
        className={`border bg-white hover:bg-gray-300 text-black flex justify-center items-center w-9 h-9 rounded ${
          currentIndex < maxIndex - 1 || infinty
            ? 'cursor-pointer'
            : 'cursor-not-allowed opacity-50'
        }`}>
        <svg
          width="10"
          height="17"
          viewBox="0 0 10 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M1.5 1.5L8.5 8.5L1.5 15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  )
}

export default SkipButtons
