import { useState } from 'react'

export function App({ on }) {
  if (on) {
    const [value] = useState(0)
    return <p>{value}</p>
  }
  return null
}
