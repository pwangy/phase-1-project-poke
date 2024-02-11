// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const searchFormSubmit = document.querySelector("form")
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

const getPokemons = () => {
    return fetch(`${pokeAPI}pokemon`)
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
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    li.id = pokeListObj.url
    resultsList.appendChild(li)
    li.addEventListener('click', e => handleClick(e, pokeListObj))
    //! make list items draggable and attach event listener
    li.setAttribute('draggable', true);
    li.setAttribute('poke-data', pokeListObj.name); // stores name
    //li.setAttribute('img-src', imageUrl); //!might use this to store imageUrl?
    li.addEventListener('dragstart', handleDragStart)
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
    getPokemons().then(allPokeList => {
        allPokeList.forEach(pokemon => {
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
        searchResult.innerText = searchName
        resultsList.append(searchResult)
    }
    
    // <!---- EVENT HANDLERS ---->
    const handleClick = (e, pokeListObj) => {
        reset()
        currentPoke = e.target.id //sets specific pokemon's url
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
    //update team ui
    const updateTeamUI = () => {
        document.querySelectorAll('.members').forEach((member, index) => {
            member.innerText = teamArray[index] ? teamArray[index] : '';
        });
    }
    //! drag and drop event handlers
    const handleDragStart = e => {
        let data;
        //! changed so both list and wrapper use setAttribute('pokedata'
        data = e.target.getAttribute('poke-data'); //store data
        e.dataTransfer.setData('text/plain', data);
    };
    
    const handleDragOver = e => {
        e.preventDefault();
    };
    
    const handleDragEnter = e => {
        e.preventDefault(); 
    };
    
    const handleDrop = e => {
        e.preventDefault(); 
        const pokeNameDrag = e.dataTransfer.getData('text/plain');
        const slotIndex = parseInt(e.target.getAttribute('data-index'), 10);
        
        if (slotIndex >= 0 && slotIndex < teamArray.length) {
            teamArray[slotIndex] = pokeNameDrag;
            updateTeamUI();
        } else {
            console.error("Invalid slot");
        }
    };

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

const displaySpeciesDetail = (speciesObj) => {
    // get flavor text, remove line breaks, set text
    flavor = speciesObj.flavor_text_entries[1].flavor_text
    const removeLineBreaks = flavor.split('\n')
    const flavorClean = removeLineBreaks.join(' ')
    flavorText.innerText = flavorClean
    flavorText.id = 'flavor-text'

    // set growth rate
    growthLabel.innerText = 'Growth Rate'
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