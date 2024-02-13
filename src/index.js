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
            // console.log(allPokeList)
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
        })
        .catch(err => console.error(err))
}

const getPokemons = () => {
    return fetch(`${pokeAPI}pokemon/`)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })  
        .then(allPokeList => allPokeList.results)
        .catch(err => console.error(err))
}

// DISPLAY FUNCTIONS
const displayAllPokemon = (pokeListObj) => {
  fetch(pokeListObj.url) // Fetch the detailed Pokémon data
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
      li.addEventListener('dragstart', handleDragStart)
    })
    .catch(error => console.error('Error fetching Pokémon details:', error))
}

// <!---- FILTER FUNCTIONALITY ---->
// 1. Filter Event Listener
filter.addEventListener('change', e => {
    // need e.preventDefault()?
    // console.log(e.target.value)
    handleFilterChange(e.target.value)   
})

// 2. Filter Click Handler
const handleFilterChange = (filterName) => {
    resultsList.innerHTML = ""
    if (filterName === "alphabeticalByName") {
        getPokemons().then((allPokeList) => {filterByAZ(allPokeList)})
    }
}

// 3. Filter Array of Pokemon Alphabetically
const filterByAZ = (allPokeList) => {
    const sortedList = [...allPokeList]
    sortedList.sort((a, b) => {
      //localeCompare() method returns a negative value if a should be sorted before b, 
      //a positive value if a should be sorted after b, and 0 if they are equal   
      return a.name.localeCompare(b.name)  
    })
    renderFilteredNames(sortedList)
}

// 4. Filter Display Function --> Same as function below used for Search
const renderFilteredNames = (sortedList) => {
    sortedList.forEach(pokemon => {
        const filterResult = document.createElement("li")
        filterResult.innerText = pokemon.name
        resultsList.append(filterResult)
})
}
    
// <!---- SEARCH FUNCTIONALITY ---->
// Search Event Listener

searchFormSubmit.addEventListener('submit', e => {
    e.preventDefault()
    searchByName(e.target.search.value)
})

// 2. Search Input Function
const searchByName = (searchName) => {
    resultsList.innerHTML = ''
    getPokemons().then(allPokeList => {
        allPokeList.forEach(pokemon => {
            const lowercaseName = searchName.toLowerCase()
            if (pokemon.name.includes(lowercaseName)) {
                renderSearchedName(pokemon.name) 
            }
            })
            .catch(err => console.error(err))
})
}
                      
// Searched Name Display Function
const renderSearchedName = (searchName) => {
    const searchResult = document.createElement('li')
    searchResult.innerText = searchName
    resultsList.append(searchResult)
}
    
// <!---- EVENT HANDLERS ---->
const handleClick = (e, pokeListObj) => {
  reset()
  currentPoke = e.target.id //sets specific pokemon's url
  const bg = ['../assets/bg/01.png', '../assets/bg/02.png', '../assets/bg/03.png', '../assets/bg/04.png']
  profileWrapper.style.backgroundImage = 'url('+ bg[Math.floor(Math.random() * bg.length)] + ')'
  return getSpecificPoke(currentPoke)
}

// Drag and Drop stuff
const setupDragDrop = () => {
    document.querySelectorAll('.members').forEach(member => {
        member.addEventListener('dragover', handleDragOver);
        member.addEventListener('dragenter', handleDragEnter);
        member.addEventListener('drop', handleDrop);
    });
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
        }
    })
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

const getSpecificPoke = (currentPoke) => {
    fetch(currentPoke)
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

const displayProfile = (pokeInfoObj) => {
    profileWrapper.id = 'profile-wrapper'
    profileWrapper.setAttribute('poke-data', pokeInfoObj.name)
    profileWrapper.setAttribute('img-src', img.src = pokeInfoObj.sprites.front_default)
    profileWrapper.setAttribute('draggable', true)
    profileWrapper.addEventListener('dragstart', handleDragStart)

    // set image, name, pokedex number
    img.src = pokeInfoObj.sprites.other.dream_world.front_default
    const setName = pokeInfoObj.name
    const capFirstLetter = setName[0].toUpperCase()
    img.alt = pokeInfoObj.name
    name.innerText = `${capFirstLetter}${setName.slice(1)}`
    name.id = 'display-name'
    id.innerText = `#${pokeInfoObj.id}`

    // list abilities
    abilityLabel.innerText = 'Abilities:'
    abilityLabel.className = 'column'
    const abilityObj = pokeInfoObj.abilities
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
    heightValue.innerText = pokeInfoObj.height
    heightRow.append(heightLabel, heightValue)
   
    // set weight
    weightLabel.innerText = 'Weight:'
    weightLabel.className = 'column'
    weightValue.innerText = pokeInfoObj.weight
    weightRow.append(weightLabel, weightValue)
  
    // fetch flavor text and growth info from Species endpoint
    let species = ''
    species = pokeInfoObj.species.url
    return getSpecies(species)
}

const getSpecies = (species) => {
    return fetch(species)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })
        .then(speciesObj => {
            displaySpeciesDetail(speciesObj)
        })
        .catch(err => console.error(err))
}

//drag and drop event handlers
const handleDragStart = e => {
    const data = {
        name: e.target.getAttribute('poke-data'), 
        imageUrl: e.target.getAttribute('img-src')
    }
    e.dataTransfer.setData('application/json', JSON.stringify(data)) // package and set both name and URL
}

const handleDragOver = e => {
    e.preventDefault()
}

const handleDragEnter = e => {
    e.preventDefault()
}

const handleDrop = e => {
    e.preventDefault()
    const { name, imageUrl } = JSON.parse(e.dataTransfer.getData('application/json'))
    const slotIndex = parseInt(e.target.getAttribute('data-index'), 10)

    if (slotIndex >= 0 && slotIndex < teamArray.length) {
        teamArray[slotIndex] = { name, imageUrl } // store both name and image URL
        updateTeamUI() // invoke to update UI with name/images
    } else {
        console.error("Invalid slot")
    }
}

const displaySpeciesDetail = (speciesObj) => {
    // get flavor text, remove line breaks, set text
    flavor = speciesObj.flavor_text_entries[1].flavor_text
    const removeLineBreaks = flavor.split('\n')
    const flavorClean = removeLineBreaks.join(' ')
    flavorText.innerText = flavorClean
    flavorText.id = 'flavor-text'

    // set growth rate
    growthLabel.innerText = 'Growth Rate:'
    growthLabel.className = 'column'
    growthValue.innerText = speciesObj.growth_rate.name
    growthRow.append(growthLabel, growthValue)

    // nest and show
    stats.append(abilityRow, heightRow, weightRow, growthRow)
    profileHeader.append(name, id)
    profileWrapper.append(img, profileHeader, flavorText, stats)
    profile.append(profileWrapper)
}

// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
    setupDragDrop()
}

loadStuff()