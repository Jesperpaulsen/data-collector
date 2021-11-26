import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'

interface Props {
  itemsPerPage: number
  numberOfItems: number
  currentPage: number
  setCurrentPage: (newPage: number) => void
}

const TableFooter: FunctionalComponent<Props> = ({
  itemsPerPage,
  numberOfItems,
  currentPage,
  setCurrentPage
}) => {
  const readableCurrentPage = useMemo(() => currentPage + 1, [currentPage])
  const numberOfPages = useMemo(
    () => Math.ceil(numberOfItems / itemsPerPage),
    [numberOfItems, itemsPerPage]
  )

  const nextPage = () => {
    const page = currentPage + 1
    if (page + 1 > currentPage) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    const page = currentPage - 1
    if (page + 1 > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="w-full flex justify-between">
      <div className="text-sm">
        Showing page <span className="font-bold">{readableCurrentPage}</span> of{' '}
        <span className="font-bold">{numberOfPages}</span>
      </div>
      <div className="flex z-0">
        <div
          onClick={prevPage}
          className={`border bg-white hover:bg-gray-300 text-black flex justify-center items-center w-9 h-9 rounded ${
            currentPage > 0 ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
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
          onClick={nextPage}
          className={`border bg-white hover:bg-gray-300 text-black flex justify-center items-center w-9 h-9 rounded ${
            currentPage < numberOfPages - 1
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
    </div>
  )
}

export default TableFooter
