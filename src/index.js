// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'

const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')

const profile = document.querySelector('#profile')
const profileWrapper = document.createElement('article')
// const profileHeader = document.createElement('div')
const img = document.createElement('img')
const name = document.createElement('h3')
const id = document.createElement('span')
const description = document.createElement('p')
// stats table
const stats = document.createElement('table')
const abilityRow = document.createElement('tr')
const abilityLabel = document.createElement('td')
const abilityValue = document.createElement('td')

const heightRow = document.createElement('tr')
const heightLabel = document.createElement('td')
const heightValue = document.createElement('td')
const weightRow = document.createElement('tr')
const weightLabel = document.createElement('td')
const weightValue = document.createElement('td')

const teamArray = []
let currentPoke = ''

// ! Ref for filtering
// search field /pokemon

// Type endpoint GET https://pokeapi.co/api/v2/type/{id or name}/
// "generation": "https://pokeapi.co/api/v2/generation/"

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
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
        })
        .catch(err => console.error(err))
}

const getSpecificPoke = (currentPoke) => {
    console.log(currentPoke)
    return fetch(currentPoke)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })  
        .then(pokeInfoObj => {
            displayProfile(pokeInfoObj)
        })
        .catch(err => console.error(err))
}

//Display 
const displayAllPokemon = (pokeListObj) => {
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    li.id = pokeListObj.url
    resultsList.appendChild(li)
    li.addEventListener('click', e => handleClick(e, pokeListObj))
}

// Event Handlers
const reset = () => {
    currentPoke = ''
    profileWrapper.remove()
    img.remove()
    name.remove()
    stats.remove()
    heightRow.remove()
    weightRow.remove()
    abilityArray = []
    console.log(`current poke has been reset ${currentPoke}`)
}   

const handleClick = (e, pokeListObj) => {
    reset()
    currentPoke = e.target.id //sets specific pokemon's url
    console.log(`setting current poke to ${currentPoke}`)
    return getSpecificPoke(currentPoke)
}

//! Display pokemon profile
const displayProfile = (pokeInfoObj) => {
    console.log(pokeInfoObj) // print array of poke info
    profileWrapper.id = 'profile-wrapper' // for styling

    // set image, name, pokedex number
    img.src = pokeInfoObj.sprites.other.dream_world.front_default
    img.alt = pokeInfoObj.name //to uppercase
    name.innerText = pokeInfoObj.name
    id.innerText = `#${pokeInfoObj.id}`
    
    // list abilities
    abilityLabel.innerText = 'Abilities'
    const abilityObj = pokeInfoObj.abilities
    const abilityArray = []
    const abilityCount = abilityObj.length
    for (let i = 0; i < abilityCount; i++ ) {
        abilityArray.push(abilityObj[i].ability.name)
    }
    abilityValue.innerText = abilityArray.join(', ')
    abilityRow.append(abilityLabel, abilityValue)

    // set height
    
    heightLabel.innerText = 'Height'
    heightValue.innerText = pokeInfoObj.height
    heightRow.append(heightLabel, heightValue)
   
    // set weight
    weightLabel.innerText = 'Weight'
    weightValue.innerText = pokeInfoObj.weight
    weightRow.append(weightLabel, weightValue)

    // nest and show
    stats.append(abilityRow, heightRow, weightRow) 
    profileWrapper.append(img, name, id, stats)
    profile.append(profileWrapper)

    // fetch species info growth-rate,
    let species = ''
    species = pokeInfoObj.species.url
    console.log(`species set to ${species}`)

    return getSpecies(species)
}

// include a call to 
// https://pokeapi.co/api/v2/pokemon-species/`${id}`
// to fetch
// flavor text, growth rate, 

const getSpecies = (species) => {
    return fetch(species)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })
        .then(speciesObj => {
            console.log(speciesObj)
            displaySpeciesDetail(speciesObj)
        })
        .catch(err => console.error(err))
}

const displaySpeciesDetail = (speciesObj) => {
    // description.innerText = speciesObj.

    // set growth rate
    const growthRow = document.createElement('tr')
    const growthLabel = document.createElement('td')
    const growthValue = document.createElement('td')
    growthLabel.innerText = 'Growth Rate'
    growthValue.innerText = speciesObj.growth_rate.name
    growthRow.append(growthLabel, growthValue)

    stats.append(growthRow)
}

// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
}

loadStuff()