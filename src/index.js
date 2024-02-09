// ! Declare Globals
const pokeAPI = 'https://pokeapi.co/api/v2/'
const h1 = document.querySelector('h1')
const selector = document.querySelector('#selector')
const resultsList = document.querySelector('#pokemon-list')
const profile = document.querySelector('#profile')
// const howTo = document.querySelector('#how-to')


const teamArray = [null, null, null, null, null, null]

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
            allPokeList.results.forEach(pokemon => displayAllPokemon(pokemon))
        //    {debugger}
        })
        .catch(err => console.error(err))
}

//Display 
const displayAllPokemon = (pokeListObj) => {
    console.log(pokeListObj)
    const li = document.createElement('li')
    li.innerText = pokeListObj.name
    resultsList.appendChild(li)
    li.addEventListener('click', e => handleClick(e))
    //! make list items draggable and attach event listener
    li.setAttribute('draggable', true);
    li.setAttribute('poke-data', pokeListObj.name); // stores name
    li.addEventListener('dragstart', handleDragStart)
}


// Event Handlers
const handleClick = e => {
    console.log(e.target)
}
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

// ! Start app logic on load
const loadStuff = () => {
    getPokemon()
    setupDragDrop()
}

loadStuff()