import { FunctionalComponent } from 'preact'
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks'

import { HostDoc } from '../../../types/host-doc'
import Input from '../Input'

import TableFooter from './TableFooter'

interface Props {
  headers: {
    label: string
    value: string
    sortable?: boolean
    renderMethod?: (argument: any) => string
  }[]
  data: { [id: string]: any }
}

const hostsPerPage = 10

const CustomTable: FunctionalComponent<Props> = ({ headers, data }) => {
  const [keyToSort, setKeyToSort] = useState<string>()
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(0)

  const sortedDataKeys = useMemo(() => {
    setCurrentPage(0)
    let allDataKeys = Object.keys(data)
    if (query.length) {
      allDataKeys = allDataKeys.filter((dataKey) =>
        data[dataKey].hostOrigin?.includes(query)
      )
    }

    const fallbackKey =
      keyToSort || Object.keys(Object.keys(allDataKeys)[0] || {})[0]

    allDataKeys.sort((dataKeyA, datakeyB) => {
      const dataObjectA = data[dataKeyA][fallbackKey]
      const dataObjectB = data[datakeyB][fallbackKey]
      if (typeof dataObjectA === 'number') {
        return dataObjectB - dataObjectA
      } else if (typeof dataObjectA === 'string') {
        return dataObjectA.localeCompare(dataObjectB)
      } else return 0
    })

    return allDataKeys
  }, [data, keyToSort, query])

  const sortedDataSubset = useMemo(() => {
    const startIndex = currentPage * hostsPerPage
    const endIndex = startIndex + hostsPerPage
    const allSortedData = [...sortedDataKeys]
    return allSortedData.slice(startIndex, endIndex)
  }, [currentPage, sortedDataKeys])

  return (
    <div className="container mx-auto p-6">
      <div className="w-72 py-4">
        <Input
          onChange={(query) => setQuery(query.toLowerCase())}
          placeholder="Search for hosts"
        />
      </div>
      <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
        <div className="w-full overflow-x-auto">
          <table className="w-full">
            <thead className="rounded-l-xr rounded-r-xl shadow-lg">
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={`header-${header.value}`}
                    className={`px-6 py-2 text-sm md:text-md font-semibold tracking-wide text-left uppercase text-gray-500 cursor-pointer hover:bg-gray-100 ${
                      keyToSort === header.value ? 'bg-gray-200' : 'bg-white'
                    }`}
                    onClick={() => setKeyToSort(header.value)}>
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {sortedDataSubset.map((dataKey, i) => (
                <tr
                  key={`table-${dataKey}`}
                  className="whitespace-nowrap border-b border-gray-100 hover:bg-gray-300">
                  {headers.map((header) => (
                    <td
                      key={`table-${i}-${header.value}`}
                      className="px-6 py-4 text-sm text-gray-500 border">
                      {header.renderMethod
                        ? header.renderMethod(data[dataKey][header.value])
                        : data[dataKey][header.value]}
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
        numberOfItems={sortedDataKeys.length}
      />
    </div>
  )
}

export default CustomTable
