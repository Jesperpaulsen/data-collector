import { FunctionalComponent } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

interface Props {
  headers: {
    label: string
    value: string
    sortable?: boolean
  }[]
  data: { [id: string]: any }
}

const CustomTable: FunctionalComponent<Props> = ({ headers, data }) => {
  const [sortedDataKeys, setSortedDataKeys] = useState(Object.keys(data))
  const [keyToSort, setKeyToSort] = useState<string>()

  // BIG TODO: Rewrite this ugly MF
  const sort = useCallback(() => {
    console.log(data)
    const allDataKeys = Object.keys(data)
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
    setSortedDataKeys(allDataKeys)
  }, [data, keyToSort])

  useEffect(() => {
    sort()
  }, [sort])

  console.log(sortedDataKeys)

  return (
    <div className="flex justify-center">
      <table className="border-collapse overflow-auto max-h-164">
        <thead className="bg-gray-100 rounded-l-xr rounded-r-xl shadow-lg">
          <tr>
            {headers.map((header, i) => (
              <th
                key={`header-${header.value}`}
                className={`px-6 py-2 text-xs text-gray-500 cursor-pointer hover:bg-gray-100 ${
                  keyToSort === header.value ? 'bg-gray-200' : ''
                }`}
                onClick={() => setKeyToSort(header.value)}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white overflow-auto max-h-96">
          {sortedDataKeys.map((dataKey, i) => (
            <tr
              key={`table-${dataKey}`}
              className="whitespace-nowrap border-b border-gray-100 hover:bg-gray-300">
              {headers.map((header) => (
                <td
                  key={`table-${i}-${header.value}`}
                  className="px-6 py-4 text-sm text-gray-500">
                  {data[dataKey][header.value]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CustomTable
