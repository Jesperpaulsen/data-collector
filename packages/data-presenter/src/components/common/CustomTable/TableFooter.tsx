import { FunctionalComponent } from 'preact'
import { useMemo } from 'preact/hooks'
import SkipButtons from '../SkipButtons'

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
      <SkipButtons
        currentIndex={currentPage}
        maxIndex={numberOfPages}
        nextBtnClicked={nextPage}
        prevBtnClicked={prevPage}
      />
    </div>
  )
}

export default TableFooter
