// Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const searchFormSubmit = document.querySelector('form')
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

// Fetch Data
const fetchPokemon = () => {
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

const fetchSpecificPoke = (currentPoke) => {
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

const fetchSpecies = (species) => {
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

// Populates Initial List of Pokemon, Filter and Search Results Get Sent Here
const displayAllPokemon = (pokeListObj) => {
    fetch(pokeListObj.url) // fetch the detailed Pokémon data
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch Pokémon details')
            return response.json()
        })
        .then(details => {
            const li = document.createElement('li')
            li.innerText = details.name
            li.id = pokeListObj.url
            resultsList.appendChild(li)
            li.addEventListener('click', e => handleClick(e, details))
            li.setAttribute('draggable', true)
            li.setAttribute('poke-data', details.name) // set name for drag-and-drop
            li.setAttribute('img-src', details.sprites.front_default) // set img-src for drag and drop
            li.setAttribute('detail-url', pokeListObj.url) //store id for drag and drop
            li.addEventListener('dragstart', handleDragStart)
        
        })
        .catch(error => console.error('Error fetching Pokémon details:', error))
  }

// Filter Event Listener
filter.addEventListener('change', e => {
    handleFilterChange(e.target.value)
})

// Filter Click Handler
const handleFilterChange = (filterName) => {
    resultsList.innerHTML = ''
    if (filterName === 'azByName') {
        filterByAZ(allPokeArray)
    }
    if (filterName === 'zaByName') {
        filterByZA(allPokeArray)
}}

// Apply Filter: A to B
const filterByAZ = () => {
    sortedList = [...allPokeArray]
    sortedList.sort((a, b) => {
      return a.name.localeCompare(b.name)  
    })
    renderFilteredNames(sortedList)
}

// Apply Filter: Z to A
const filterByZA = () => {
    const sortedList = [...allPokeArray]
    sortedList.sort((a, b) => {
      return b.name.localeCompare(a.name)  
    })
    renderFilteredNames(sortedList)
}

// Filter Display Function
const renderFilteredNames = (sortedList) => {
    sortedList.forEach(pokemon => {
        displayAllPokemon(pokemon)
    })
}
// Search Event Listener
searchFormSubmit.addEventListener('submit', e => {
    e.preventDefault()
    searchByName(e.target.search.value)
})

// Search Input Function
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

// Handle Click on Pokemon Name in Selector
const handleClick = (e) => {
    reset()
    currentPoke = e.target.id //sets specific pokemon's url
    return fetchSpecificPoke(currentPoke)
        .then(pokeInfo => {
        displayProfile(pokeInfo)
    })
}

// Drag and Drop Setup
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
        const pokemon = teamArray[index]
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

// Handle Click on Team 
const handleClickTeam = (detailUrl) => {
    reset()
    currentPoke = detailUrl //sets specific pokemon's url
    return fetchSpecificPoke(currentPoke)
    .then(pokeInfo => {
    displayProfile(pokeInfo)
})
}

// Reset and Clear Profile Before Loading Another
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

// Use Data From Second Fetch Call for Specific Poke Data
const displayProfile = (pokeInfo) => {
    profileWrapper.id = 'profile-wrapper'
    profileWrapper.setAttribute('poke-data', pokeInfo.name)
    profileWrapper.setAttribute('img-src', img.src = pokeInfo.sprites.front_default)
    profileWrapper.setAttribute('detail-url', currentPoke)
    profileWrapper.setAttribute('draggable', true)
    profileWrapper.addEventListener('dragstart', handleDragStart)

    // Set Image, Name, Pokedex number
    img.src = pokeInfo.sprites.other.dream_world.front_default
    img.setAttribute('draggable', false)
    const setName = pokeInfo.name
    const capFirstLetter = setName[0].toUpperCase()
    img.alt = pokeInfo.name
    name.innerText = `${capFirstLetter}${setName.slice(1)}`
    name.id = 'display-name'
    id.innerText = `#${pokeInfo.id}`

    // List Abilities
    abilityLabel.innerText = 'Abilities:'
    abilityLabel.className = 'column'
    const abilityInfo = pokeInfo.abilities
    const abilityArray = []
    const abilityCount = abilityInfo.length
    for (let i = 0; i < abilityCount; i++ ) {
        abilityArray.push(abilityInfo[i].ability.name)
    }
    abilityValue.innerText = abilityArray.join(', ')
    abilityRow.append(abilityLabel, abilityValue)

    // Set Height
    heightLabel.innerText = 'Height:'
    heightLabel.className = 'column'
    heightValue.innerText = pokeInfo.height
    heightRow.append(heightLabel, heightValue)
   
    // Set Weight
    weightLabel.innerText = 'Weight:'
    weightLabel.className = 'column'
    weightValue.innerText = pokeInfo.weight
    weightRow.append(weightLabel, weightValue)
  
    // Fetch Flavor Text and Growth Info from Species Endpoint
    let species = ''
    species = pokeInfo.species.url
    return fetchSpecies(species)
}

// Use Data From Species-Specific Endpoint and Append Everything to Display Profile
const displaySpeciesDetail = (speciesInfo) => {
    // Get Flavor Text, Remove Line Breaks, Set Text
    flavor = speciesInfo.flavor_text_entries[1].flavor_text
    const removeLineBreaks = flavor.split('\n')
    const flavorClean = removeLineBreaks.join(' ')
    flavorText.innerText = flavorClean
    flavorText.id = 'flavor-text'

    // Set Growth Rate
    growthLabel.innerText = 'Growth Rate:'
    growthLabel.className = 'column'
    growthValue.innerText = speciesInfo.growth_rate.name
    growthRow.append(growthLabel, growthValue)

    // Nest and Show
    stats.append(abilityRow, heightRow, weightRow, growthRow)
    profileHeader.append(name, id)
    profileWrapper.append(img, profileHeader, flavorText, stats)
    profile.append(profileWrapper)
}
//Drag and Drop Event Handlers
const handleDragStart = e => {
    const dragData = {
        name: e.target.getAttribute('poke-data'), 
        imageUrl: e.target.getAttribute('img-src'),
        detailUrl: e.target.getAttribute('detail-url'),
    }
    e.dataTransfer.setData('application/json', JSON.stringify(dragData)) // package and set name, imageUrl, detailUrl
}

const handleDragOver = e => e.preventDefault()
const handleDragEnter = e => e.preventDefault()

const handleDrop = e => {
    e.preventDefault()
    const { name, imageUrl, detailUrl } = JSON.parse(e.dataTransfer.getData('application/json'));
    const slotIndex = parseInt(e.target.getAttribute('data-index'), 10); // identify team slot

    if (slotIndex >= 0 && slotIndex < teamArray.length) {
        teamArray[slotIndex] = { name, imageUrl, detailUrl } // store name, imageUrl, detailUrl
        updateTeamUI() // invoke to update UI with name/images and stored detailUrl
    } else {
        alert('Invalid slot')
}}

// Start App Logic On Load
const startTeamBuilder = () => {
    fetchPokemon()
    setupDragDrop()
}

startTeamBuilder()