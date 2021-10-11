import { FunctionalComponent } from 'preact'

interface Props {
  close: () => void
}

const Modal: FunctionalComponent<Props> = ({ close, children }) => {
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center backdrop-filter backdrop-blur-sm"
      onClick={close}>
      <div className="bg-white p-4 pt-10 rounded-lg text-black relative">
        <button
          className={`focus:outline-none focus:border-none absolute top-5 right-5 w-10 md:w-12 h-10 md:h-12 flex items-center justify-center z-50 rounded-full bg-grey-50 dark:bg-grey-800 hover:bg-grey-100 dark:hover:bg-grey-700 transition ease-in-out duration-300`}
          aria-label="close"
          onClick={close}>
          <svg
            className={'text-black dark:text-white w-4 md:w-5 3xl:w-6'}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 22.88 22.88">
            <path
              d="M.324 1.909a1.14 1.14 0 010-1.587 1.14 1.14 0 011.587 0l9.523 9.539L20.973.322a1.12 1.12 0 011.571 0 1.112 1.112 0 010 1.587l-9.523 9.524 9.523 9.539a1.112 1.112 0 010 1.587 1.12 1.12 0 01-1.571 0l-9.539-9.539-9.523 9.539a1.14 1.14 0 01-1.587 0c-.429-.444-.429-1.159 0-1.587l9.523-9.539L.324 1.909z"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className="z-50">{children}</div>
      </div>
    </div>
  )
}

export default Modal
