import ReactDOM from 'react-dom/client'

export const loadView: typeof globalThis['loadView'] = view => {
  const root = document.getElementById('root')

  if (!root) {
    throw new Error('Root element not found')
  }

  ReactDOM.hydrateRoot(root, view)
}
export default loadView

globalThis.loadView = loadView
