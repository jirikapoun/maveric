// import React from 'react'
import ReactDOM from 'react-dom/client'

export const load = view => {
  ReactDOM.hydrateRoot(
    document.getElementById('root')!,
    view,
  )
}

export default load

globalThis.loadView = load

// export default function load(view, params) {
//   const element = React.createElement(view, params)
//   ReactDOM.hydrateRoot(
//     document.getElementById('root')!,
//     element,
//   )
// }
