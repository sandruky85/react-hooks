// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, {useState, useEffect} from 'react'
import {ErrorBoundary, useErrorHandler} from 'react-error-boundary'
import {PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'

function ErrorFallBack({error, resetErrorBoundary}) {
  return (
    <div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = useState({
    status: pokemonName ? 'pending' : 'idle',
    pokemon: null,
    error: null,
  })

  const {status, pokemon, error} = state

  useErrorHandler(error)
  
  useEffect(()=>{
    if (!pokemonName) {
      return
    }
    setState({status: 'pending'})
    fetchPokemon(pokemonName).then(
      pokemonData => {
        setState({pokemon: pokemonData, status:'resolved'})
        
      },
      error => {
        setState({error: error, status:'rejected'})
        
      }
    )
  }, [pokemonName])
  
  if(status === 'idle' ) {
    return <div>Submit a pokemon...</div>
  }

  if(status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  }
  
  if(status === 'rejected') {
    throw error
  }

  if(status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  } 
  
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  function handleReset() {
    setPokemonName('')
  }

  return (
    <div className="pokemon-info-app">
        <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
        <hr />
        <div className="pokemon-info">
          <ErrorBoundary 
            FallbackComponent={ErrorFallBack} 
            onReset={handleReset} 
            resetKeys={[pokemonName]}
          >
            <PokemonInfo pokemonName={pokemonName} />
          </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
