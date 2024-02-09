// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const searchFormSubmit = document.querySelector("form");
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
            console.log(allPokeList)
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
        //    {debugger}
        })
        .catch(err => console.error(err))
}



// DISPLAY FUNCTIONS

// Display All Pokemon in Results List
const displayAllPokemon = (pokeListObj) => {
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    resultsList.appendChild(li)
    li.addEventListener('click', e => handleClick(e))
}


// <!---- SEARCH FUNCTIONALITY ---->

// Search Event Listener

searchFormSubmit.addEventListener('submit', e => {
    e.preventDefault()
    searchByName(e.target.search.value)
})

// Search Input Function

const searchByName = (searchName) => {
    resultsList.innerHTML = ""
    getPokemon().then(allPokeList => {
        allPokeList.results.forEach(pokemon => {
            // const lowercaseName = searchName.toLowerCase()
            // if (pokemon.name.toLowerCase().startsWith(lowercaseName)) {
            //     renderSearchedName(pokemon)
                if (pokemon.name.startsWith(searchName)) {
                    renderSearchedName(pokemon.name)   
            }
            
        })
    })

}

// Searched Name Display Function

const renderSearchedName = (searchName) => {
    const searchResult = document.createElement("li")
    li.innerText = searchName.name 
    resultsList.append(searchResult)
}

// Append Multiple List Items to Search Results





// <!---- EVENT HANDLERS ---->

const handleClick = e => {
    console.log(e.target)
}


// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
}

loadStuff()