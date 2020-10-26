// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import React, {useState, useEffect, useRef} from 'react'

function useLocalStorageState (key, defaultvalue='') {
  //TODO seralize and 
  const [state, setState] = useState(()=> {
    const valueStoraged = window.localStorage.getItem(key)
    if (valueStoraged) {
      return JSON.parse(valueStoraged)
    }
    return defaultvalue
  })

  const prevKeyReference = useRef(key)
  
  useEffect(() => {
    const prevKey = prevKeyReference.current
    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    prevKeyReference.current = key
    window.localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState]

}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') || initialName
  const [name, setName] = useLocalStorageState('name')

  function handleChange(event) {
    setName(event.target.value)
  }

  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name}/>
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
