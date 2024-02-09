// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const results = document.querySelector('#pokemon-list')
// const howTo = document.querySelector('#how-to')


const teamArray = []


// ! Ref for filtering
// search field /pokemon

// Type endpoint GET https://pokeapi.co/api/v2/type/{id or name}/
// "generation": "https://pokeapi.co/api/v2/generation/"



//! Display pokemon profile


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
            allPokeList.results.forEach(result => displayAllPokemon(result))
        //    {debugger}
        })
        .catch(err => console.error(err))
}

//Display 

const displayAllPokemon = (pokeListObj) => {
    console.log(pokeListObj)
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    results.appendChild(li)
    li.addEventListener('click', e => handleClick(e))
}


// Event Handlers

const handleClick = e => {
    console.log(e.target)
}


// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
}

loadStuff()