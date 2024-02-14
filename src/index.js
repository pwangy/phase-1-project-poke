// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const searchFormSubmit = document.querySelector("form")
const filter = document.querySelector('#filter')
const profile = document.querySelector('#profile')
const profileWrapper = document.createElement('article')
const img = document.createElement('img')
const profileHeader = document.createElement('hgroup')
const name = document.createElement('h3')
const id = document.createElement('span')
const flavorText = document.createElement('p')
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
const growthRow = document.createElement('tr')
const growthLabel = document.createElement('td')
const growthValue = document.createElement('td')

let allPokeArray = []
let sortedList = []
let searchedList = []
let specificPokeInfo = []
const teamArray = [null, null, null, null, null, null]
let currentPoke = ''

// ! Fetch Data
const getPokemon = () => {
    return fetch(`${pokeAPI}pokemon/?limit=151`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })  
        .then(allPokeList => {
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
            allPokeArray = allPokeList.results
        })
        .catch(err => console.error(err))
}

const getSpecificPoke = (currentPoke) => {
    return fetch(currentPoke)
    .then(res => {
        if (res.ok) {
            return res.json()
        }
        throw res.statusText
    })
    .then(pokeInfo => {
        specificPokeInfo = pokeInfo
        return pokeInfo
    })
    .catch(err => console.error(err))
}

const getSpecies = (species) => {
    return fetch(species)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })
        .then(speciesInfo => {
            displaySpeciesDetail(speciesInfo)
        })
        .catch(err => console.error(err))
}

// Populates initial list of pokemon, filter and search results get sent here
const displayAllPokemon = (eachPoke) => {
    const li = document.createElement('li')
    li.innerText = eachPoke.name
    li.id = eachPoke.url
    li.addEventListener('click', e => handleClick(e))
    li.setAttribute('draggable', true)
    li.setAttribute('poke-data', eachPoke.name)
    li.addEventListener('dragstart', handleDragStart)
    resultsList.appendChild(li)
}

// <!---- FILTER FUNCTIONALITY ---->
// 1. Filter Event Listener
filter.addEventListener('change', e => {
    // need e.preventDefault()?
    handleFilterChange(e.target.value)
})

// 2. Filter Click Handler
const handleFilterChange = (filterName) => {
    resultsList.innerHTML = ''
    if (filterName === "azByName") {
        getPokemons().then((allPokeList) => {filterByAZ(allPokeList)})
    }
    if (filterName === "zaByName") {
        getPokemons().then((allPokeList) => {filterByZA(allPokeList)})
    }
}

// 3. Filter Array of Pokemon Alphabetically
const filterByAZ = () => {
    sortedList = [...allPokeArray]
    sortedList.sort((a, b) => {
      //localeCompare() method returns a negative value if a should be sorted before b, 
      //a positive value if a should be sorted after b, and 0 if they are equal
      return a.name.localeCompare(b.name)  
    })
    renderFilteredNames(sortedList)
}

// 3. Filter Array of Pokemon Z to A
const filterByZA = (allPokeList) => {
    const sortedList = [...allPokeList]
    sortedList.sort((a, b) => {
      //localeCompare() method returns a negative value if a should be sorted before b, 
      //a positive value if a should be sorted after b, and 0 if they are equal   
      return b.name.localeCompare(a.name)  
    })
    renderFilteredNames(sortedList)
}

// 4. Filter Display Function --> Same as function below used for Search
const renderFilteredNames = (sortedList) => {
    sortedList.forEach(pokemon => {
        displayAllPokemon(pokemon)
    })
}

// <!---- SEARCH FUNCTIONALITY ---->
// 1. Search Event Listener
searchFormSubmit.addEventListener('submit', e => {
    e.preventDefault()
    searchByName(e.target.search.value)
})

// 2. Search Input Function
const searchByName = (searchName) => {
    resultsList.innerHTML = ''
    allPokeArray.forEach(pokemon => {
        const lowercaseName = searchName.toLowerCase()
        if (pokemon.name.includes(lowercaseName)) {
            searchedList.push(pokemon)
            displayAllPokemon(pokemon)
        }
    })
}

// <!---- EVENT HANDLERS ---->
const handleClick = (e) => {
    // console.log(details)
    reset()
    currentPoke = e.target.id //sets specific pokemon's url
    return getSpecificPoke(currentPoke)
        .then(pokeInfo => {
            // debugger
        displayProfile(pokeInfo)
    })
}

// Drag and Drop stuff
const setupDragDrop = () => {
    document.querySelectorAll('.members').forEach(member => {
        member.addEventListener('dragover', handleDragOver)
        member.addEventListener('dragenter', handleDragEnter)
        member.addEventListener('drop', handleDrop)
    })
}

// Update Container
const updateTeamUI = () => {
    document.querySelectorAll('.members').forEach((member, index) => {
        const pokemon = teamArray[index];
        member.innerHTML = '' // clear slot
        if (pokemon) {
            const imgElement = document.createElement('img')
            imgElement.src = pokemon.imageUrl // set image source to stored url
            imgElement.alt = pokemon.name
            member.appendChild(imgElement) // append the image to the slot

            const nameElement = document.createElement('p')
            nameElement.textContent = pokemon.name // set pokemon name
            member.appendChild(nameElement) // append name to slot

             //add click event listener to members
            member.addEventListener('click', () => handleClickTeam(pokemon.detailUrl))
        }
    })
}
// new version of handleClick that works with team container
const handleClickTeam = (detailUrl) => {
    reset()
    currentPoke = detailUrl //sets specific pokemon's url
    return getSpecificPoke(currentPoke)
  }

//! Display pokemon profile
// Reset and clear profile before loading another
const reset = () => {
    profileWrapper.remove()
    img.remove()
    name.remove()
    id.remove()
    flavorText.innerText = ''
    flavorText.remove()
    stats.remove()
    heightRow.remove()
    weightRow.remove()
    abilityRow.remove()
    growthRow.remove()
    abilityArray = []
}

// Use data from second fetch call for specific poke data
const displayProfile = (pokeInfo) => {
    profileWrapper.id = 'profile-wrapper'
    profileWrapper.setAttribute('poke-data', pokeInfo.name)
    profileWrapper.setAttribute('img-src', img.src = pokeInfo.sprites.front_default)
    profileWrapper.setAttribute('detail-url', currentPoke)
    profileWrapper.setAttribute('draggable', true)
    profileWrapper.addEventListener('dragstart', handleDragStart)

    // set image, name, pokedex number
    img.src = pokeInfo.sprites.other.dream_world.front_default
    img.setAttribute('draggable', false)
    const setName = pokeInfo.name
    const capFirstLetter = setName[0].toUpperCase()
    img.alt = pokeInfo.name
    name.innerText = `${capFirstLetter}${setName.slice(1)}`
    name.id = 'display-name'
    id.innerText = `#${pokeInfo.id}`

    // list abilities
    abilityLabel.innerText = 'Abilities:'
    abilityLabel.className = 'column'
    const abilityObj = pokeInfo.abilities
    const abilityArray = []
    const abilityCount = abilityObj.length
    for (let i = 0; i < abilityCount; i++ ) {
        abilityArray.push(abilityObj[i].ability.name)
    }
    abilityValue.innerText = abilityArray.join(', ')
    abilityRow.append(abilityLabel, abilityValue)

    // set height
    heightLabel.innerText = 'Height:'
    heightLabel.className = 'column'
    heightValue.innerText = pokeInfo.height
    heightRow.append(heightLabel, heightValue)
   
    // set weight
    weightLabel.innerText = 'Weight:'
    weightLabel.className = 'column'
    weightValue.innerText = pokeInfo.weight
    weightRow.append(weightLabel, weightValue)
  
    // fetch flavor text and growth info from Species endpoint
    let species = ''
    species = pokeInfo.species.url
    return getSpecies(species)
}

// use data from species-specific endpoint and append everything to display profile
const displaySpeciesDetail = (speciesInfo) => {
    // get flavor text, remove line breaks, set text
    flavor = speciesInfo.flavor_text_entries[1].flavor_text
    const removeLineBreaks = flavor.split('\n')
    const flavorClean = removeLineBreaks.join(' ')
    flavorText.innerText = flavorClean
    flavorText.id = 'flavor-text'

    // set growth rate
    growthLabel.innerText = 'Growth Rate:'
    growthLabel.className = 'column'
    growthValue.innerText = speciesInfo.growth_rate.name
    growthRow.append(growthLabel, growthValue)

    // nest and show
    stats.append(abilityRow, heightRow, weightRow, growthRow)
    profileHeader.append(name, id)
    profileWrapper.append(img, profileHeader, flavorText, stats)
    profile.append(profileWrapper)
}

//drag and drop event handlers
const handleDragStart = e => {
    const data = {
        name: e.target.getAttribute('poke-data'), 
        imageUrl: e.target.getAttribute('img-src'),
        detailUrl: e.target.getAttribute('detail-url'),
    }
    e.dataTransfer.setData('application/json', JSON.stringify(data)) // package and set name, imageUrl, detailUrl
}

const handleDragOver = e => e.preventDefault()
const handleDragEnter = e => e.preventDefault()

const handleDrop = e => {
    e.preventDefault();
    const { name, imageUrl, detailUrl } = JSON.parse(e.dataTransfer.getData('application/json'));
    const slotIndex = parseInt(e.target.getAttribute('data-index'), 10); // identify team slot

    if (slotIndex >= 0 && slotIndex < teamArray.length) {
        teamArray[slotIndex] = { name, imageUrl, detailUrl } // store name, imageUrl, detailUrl
        updateTeamUI() // invoke to update UI with name/images and stored detailUrl
    } else {
        alert('Invalid slot')
}}

// ! Start app logic on load
const startTeamBuilder = () => {
    getPokemon()
    setupDragDrop()
}

startTeamBuilder()