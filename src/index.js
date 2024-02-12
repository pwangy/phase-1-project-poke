// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'

const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const searchFormSubmit = document.querySelector("form")

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
        //    {debugger}
        })
        .catch(err => console.error(err))
}

const getPokemons = () => {
    console.log("a")
    return fetch(`${pokeAPI}pokemon`)
        .then(res => {
            console.log("a")
            if (res.ok) {
                return res.json()
            }
            throw res.statusText
        })  
        .then(allPokeList => allPokeList.results)
        .catch(err => console.error(err))
}

// DISPLAY FUNCTIONS //! 
const displayAllPokemon = (pokeListObj) => {
    fetch(pokeListObj.url)
        .then(response => response.json())
        .then(pokemonDetails => {
            const li = document.createElement('li')
            //console.log(pokemonDetails);
            li.id = pokemonDetails.url
            li.innerText = pokemonDetails.name
            li.setAttribute('draggable', true)
            li.setAttribute('poke-data', pokemonDetails.name)
            li.setAttribute('img-src', pokemonDetails.sprites.front_default) // assign imgUrl
            li.addEventListener('dragstart', handleDragStart)
            resultsList.appendChild(li);
            li.addEventListener('click', e => handleClick(e, pokemonDetails))
        });
};


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
const getSpecificPoke = (currentPoke) => {
    // console.log(currentPoke)
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

// Drag and Drop stuff
const setupDragDrop = () => {
    document.querySelectorAll('.members').forEach(member => {
        member.addEventListener('dragover', handleDragOver)
        member.addEventListener('dragenter', handleDragEnter)
        member.addEventListener('drop', handleDrop)
    });
}
// Update Container
const updateTeamUI = () => {
    document.querySelectorAll('.members').forEach((member, index) => {
        const pokemon = teamArray[index];
        member.innerHTML = '' // clear slot
        if (pokemon) {
            const imgElement = document.createElement('img');
            imgElement.src = pokemon.imageUrl // set image source to stored url
            imgElement.alt = pokemon.name
            member.appendChild(imgElement) // append the image to the slot

            const nameElement = document.createElement('p');
            nameElement.textContent = pokemon.name; // set pokemon name
            member.appendChild(nameElement); // append name to slot
        }
    })
}

//drag and drop event handlers
const handleDragStart = e => {
    const data = {
        name: e.target.getAttribute('poke-data'), 
        imageUrl: e.target.getAttribute('img-src')
    };
    e.dataTransfer.setData('application/json', JSON.stringify(data)); // package and set both name and URL
};

const handleDragOver = e => {
    e.preventDefault()
};

const handleDragEnter = e => {
    e.preventDefault()
};

const handleDrop = e => {
    e.preventDefault(); 
    const { name, imageUrl } = JSON.parse(e.dataTransfer.getData('application/json'))
    const slotIndex = parseInt(e.target.getAttribute('data-index'), 10);

    if (slotIndex >= 0 && slotIndex < teamArray.length) {
        teamArray[slotIndex] = { name, imageUrl } // store both name and image URL
        updateTeamUI() // invoke to update UI with name/images
    } else {
        console.error("Invalid slot")
    }
};

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

const handleClick = (e) => {
    reset();
    console.log(e.currentTarget);
    const pokeUrl = e.currentTarget.getAttribute('id'); 
    if (pokeUrl) {
        getSpecificPoke(pokeUrl);
    } else {
        console.error("URL is not defined.");
    }
};
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
    profileWrapper.setAttribute('poke-data', pokeInfoObj.name);
    profileWrapper.setAttribute('draggable', true);
    profileWrapper.addEventListener('dragstart', handleDragStart);
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
    setupDragDrop()
}

loadStuff()