// ! Fetch Data
const getPokemon = () => {
    return fetch(`${pokeAPI}pokemon`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })  
        .then(allPokeList => {
            allPokeList.results.forEach(pokemon => getPokemonDetails(pokemon))
        })
        
        .catch(err => console.error(err))
}

const getPokemonDetails = (pokemon) => {
    fetch(pokemon.url) // Fetch the detailed Pokémon data
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch Pokémon details')
        return response.json()
      })
      .then(details => {displayAllPokemon(details)})
      .catch(error => console.error('Error fetching Pokémon details:', error))
    }

// DISPLAY FUNCTIONS
const displayAllPokemon = (details) => {
    console.log(details)
      const li = document.createElement('li')
      li.innerText = details.name
      li.id = pokeListObj.url
      resultsList.appendChild(li)
      li.addEventListener('click', e => handleClick(e, details))
      li.setAttribute('draggable', true)
      li.setAttribute('poke-data', details.name) // set name for drag-and-drop
      li.setAttribute('img-src', details.sprites.front_default) // set img-src for drag and drop
      li.addEventListener('dragstart', handleDragStart)
    }

// const addAttributesToLis = (details) => {
//     const li = document.createElement('li')
//     li.innerText = details.name
//     li.id = pokeListObj.url
//     resultsList.appendChild(li)
//     li.addEventListener('click', e => handleClick(e, details))
//     li.setAttribute('draggable', true)
//     li.setAttribute('poke-data', details.name) // set name for drag-and-drop
//     li.setAttribute('img-src', details.sprites.front_default) // set img-src for drag and drop
//     li.addEventListener('dragstart', handleDragStart) 
// }