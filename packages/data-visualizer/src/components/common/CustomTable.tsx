import { FunctionalComponent } from 'preact'

interface Props {
  headers: {
    label: string
    value: string
    sortable?: boolean
  }[]
  data: { [id: string]: any }
}

const CustomTable: FunctionalComponent<Props> = ({ headers, data }) => {
  return (
    <div className="container flex justify-center max-h-screen overflow-auto">
      <div className="flex flex-col">
        <div className="w-full">
          <div className="border-b border-gray-200 shadow">
            <table className="border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, i) => (
                    <th
                      key={`header-${header.value}`}
                      className="px-6 py-2 text-xs text-gray-500">
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white">
                {Object.entries(data).map(([key, value], i) => (
                  <tr
                    key={`table-${key}`}
                    className="whitespace-nowrap border-b border-gray-100 hover:bg-gray-300">
                    {headers.map((header) => (
                      <td
                        key={`table-${i}-${header.value}`}
                        className="px-6 py-4 text-sm text-gray-500">
                        {value[header.value]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomTable
