import { FunctionalComponent } from 'preact'

const Box: FunctionalComponent = ({ children }) => {
  return (
    <div className="py-4 my-2 bg-white shadow-xl rounded-xl">{children}</div>
  )
}

export default Box
