// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const resultsListItems = document.querySelector('.search-results')
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
        .then(allPokeList => {displayAllPokemon(allPokeList.results)})
        //     // allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
        // })
        .catch(err => console.error(err))    
}



//// <!---- SEARCH FUNCTIONALITY TRY #2  ---->

// DISPLAY FUNCTIONS

// Displays a List Item for a Pokemon in the Results Area

const displayAllPokemon = (allPokeList) => {
    const htmlString = Array.from(allPokeList).map((pokemon) => {
        return `
        <li class="search-results">${pokemon.name}</li>
        `
    })
    .join("");
resultsList.innerHTML = htmlString;
}



// const displayAllPokemon = (allPokeList) => {
//     const li = document.createElement('li')
//     li.innerText = pokemon.name
//     li.className = "search-results"
//     resultsList.appendChild(li)
//     li.addEventListener('click', e => handleClick(e))
// }

//// <!---- SEARCH FUNCTIONALITY TRY #2  ---->

// Search Event Listener

searchFormSubmit.addEventListener('submit', e => {
    e.preventDefault()
    const searchValue = e.target.search.value;
    const filteredPokemon = resultsListArray.filter(pokemon => {
       return pokemon.name.includes(searchValue)
    })
    console.log(filteredPokemon)
})





// Create Array

// let resultsListArray = [];




// // For Loop through List Items for Searched Name

// const searchByName = (searchValue) => {
//     for (i = 0; i < resultsListItems.length; i++) {
//         if resultsListItems[i].innerText.toLowerCase()
//             .includes(searchValue.toLowerCase()) {
//         resultsListItems[i].classList.remove("is-hidden");
//         } else {
//             resultsListItems[i].classList.add("is-hidden");
//         }
//     }
// }




// <!---- EVENT HANDLERS ---->

const handleClick = e => {
    console.log(e.target)
}


// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
}

loadStuff()



// // <!---- SEARCH FUNCTIONALITY TRY #1  ---->

// // Search Event Listener

// searchFormSubmit.addEventListener('submit', e => {
//     e.preventDefault()
//     searchByName(e.target.search.value)
// })

// // Search Input Function

// const searchByName = (searchValue) => {
//     resultsList.innerHTML = ""
//     getPokemon().then(allPokeList => {
//        console.log(allPokeList)
//         // allPokeList.results.forEach(pokemon => {
//         //     console.log(pokemon)
//         //         if (pokemon.name.startsWith(searchValue)) {
//         //             renderSearchedName(pokemon)   

//                         // const lowercaseName = searchName.toLowerCase()
//             // if (pokemon.name.toLowerCase().startsWith(lowercaseName)) {
//             //     renderSearchedName(pokemon)
                   
//         })
         
//         }
    



// // Searched Name Display Function

// const renderSearchedName = (pokemonName) => {
//     // console.log(pokemonName)
//     const searchResult = document.createElement("li")
//     li.innerText = pokemonName.name 
//     resultsList.append(searchResult)
// }

// // Append Multiple List Items to Search Results

