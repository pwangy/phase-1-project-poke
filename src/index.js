// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const profile = document.querySelector('#profile')
const profileWrapper = document.createElement('article')
const img = document.createElement('img')
const name = document.createElement('h3')

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
        //    {debugger}
        })
        .catch(err => console.error(err))
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
}

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

//Display 
const displayAllPokemon = (pokeListObj) => {
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    //! make list items draggable and attach event listener
    li.setAttribute('draggable', true);
    li.setAttribute('poke-data', pokeListObj.name); // stores name
    li.addEventListener('dragstart', handleDragStart)
    li.id = pokeListObj.url
    resultsList.appendChild(li)
    li.addEventListener('click', e => handleClick(e, pokeListObj))
}

// Event Handlers


//Drag and Drop stuff

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
    e.dataTransfer.setData('text/plain', e.target.getAttribute('poke-data'));

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
    e.target.innerText = pokeNameDrag; // sets the inner text of the target to the pokemonName
    const slotIndex = parseInt(e.target.getAttribute('data-index'), 10);

    if (slotIndex >= 0 && slotIndex < teamArray.length) {
        teamArray[slotIndex] = pokeNameDrag;
        updateTeamUI();
    } else {
        console.error("Invalid slot");
    }
};
const reset = () => {
    profileWrapper.remove()
    img.src = ''
    img.alt = ''
    name.innerText = ''
} 

const handleClick = (e, pokeListObj) => {
    reset()
    currentPoke = e.target.id //sets specific pokemon's url
    return getSpecificPoke(currentPoke)
}

//! Display pokemon profile
const displayProfile = (pokeInfoObj) => {
    console.log(pokeInfoObj) // print array of poke info
    
    profileWrapper.id = 'profile-wrapper'
    profileWrapper.name = pokeInfoObj.id
    img.src = pokeInfoObj.sprites.other.dream_world.front_default
    img.alt = pokeInfoObj.name
    name.innerText = pokeInfoObj.name

    profileWrapper.append(img, name)
    profile.append(profileWrapper)

    //! Make profileWrapper draggable
    profileWrapper.setAttribute('draggable', true);
    profileWrapper.addEventListener('dragstart', handleDragStart);
    // ability, attacks
    // stage?
    // type
    // strength
}

// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
    setupDragDrop()
}

loadStuff()