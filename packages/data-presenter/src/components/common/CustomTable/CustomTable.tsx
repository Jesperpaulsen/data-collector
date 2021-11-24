import { FunctionalComponent } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'

import { UsageReport } from '../../../types/UsageReport'
import Input from '../Input'

import TableFooter from './TableFooter'

interface Props {
  headers: {
    label: string
    value: string
    sortable?: boolean
    renderMethod?: (args: any) => string
  }[]
  data: any[]
  onClick?: (report: UsageReport) => void
}

const hostsPerPage = 10

const CustomTable: FunctionalComponent<Props> = ({
  headers,
  data,
  onClick
}) => {
  const [currentPage, setCurrentPage] = useState(0)

  const sortedDataSubset = useMemo(() => {
    const startIndex = currentPage * hostsPerPage
    const endIndex = startIndex + hostsPerPage
    const allData = [...data]
    return allData.slice(startIndex, endIndex)
  }, [currentPage, data])

  return (
    <div className="container mx-auto p-6">
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="rounded-l-xr rounded-r-xl shadow-lg">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={`header-${header.value}`}
                    className="px-6 py-2 text-sm md:text-md font-semibold tracking-wide text-left uppercase text-gray-500 cursor-pointer hover:bg-gray-100 bg-white">
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedDataSubset.map((dataKey, i) => (
                <tr
                  key={`table-${dataKey}`}
                  onClick={(e: any) => {
                    if (onClick) {
                      e.stopPropagation()
                      onClick(data[i])
                    }
                  }}
                  className="whitespace-nowrap border-b border-gray-100 hover:bg-gray-300 cursor-pointer">
                  {headers.map((header) => (
                    <td
                      key={`table-${i}-${header.value}`}
                      className="px-6 py-4 text-sm text-gray-500 border">
                      {data[i] && header.renderMethod
                        ? header.renderMethod(data[i][header.value])
                        : data[i][header.value]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TableFooter
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={hostsPerPage}
        numberOfItems={data.length}
      />
    </div>
  )
}

export default CustomTable
