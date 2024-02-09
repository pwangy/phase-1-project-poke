// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
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
            console.log(allPokeList.results)
        //    {debugger}
        })
        .catch(err => console.error(err))
}

// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
}

loadStuff()