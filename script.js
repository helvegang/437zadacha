const searchInput = document.querySelector("input");    /* ---ИНПУТ */
const dropdownContainer = document.querySelector(".dropdown-container");   /* ---контейнер для выпадающего списка */
const selectedContainer = document.querySelector(".selected-container");   /* ---выбирает весь список выбранных */

function eventDropdown(event) {  
    let target = event.target;
    if (!target.classList.contains("dropdown-content")) { 
    return;
    }
    addSelected(target);
    searchInput.value = "";
    clearDropdownList();

    dropdownContainer.removeEventListener("click", eventDropdown);  /* слушатель события удаляется после того как отработал, потом при вводе в инпут опять создается */

    selectedContainer.addEventListener('click', eventSelectedClose); /* создание слушателя для зыкрытия карточки репозитория */
};

function eventSelectedClose(event) {
    let target = event.target;
    if (!target.classList.contains("button-close")) return; 

    target.parentElement.remove();  
    selectedContainer.removeEventListener('click', eventSelectedClose); /* слушатель события удаляется после того как отработал, потом создается при отрытии новой карточки репозит. */
};

async function searchRepositories() {
    dropdownContainer.addEventListener("click", eventDropdown); /* создание слушателя для открытия реп. из выпадающего списка перенес сюда */
    if (searchInput.value.trim() == "") {
        clearDropdownList();
        return;
        }
    else {

    try {
     let response = await fetch(`https://api.github.com/search/repositories?q=${searchInput.value}`);
    if (response.ok) {
      let repositories = await response.json();
      searchDropdown(repositories);
      }
    else return null;
    } catch(error) {
        console.log(error)
    }
  
    }
    
  };

function searchDropdown(repositoriesObj) {
    clearDropdownList();
    let notFound = '<div class="notFound">Ничего не найдено</div>';
    if (repositoriesObj.total_count == 0) {
        dropdownContainer.insertAdjacentHTML('afterbegin', notFound);
        return;
    }
    for (let reposIndex = 0; reposIndex < 5; reposIndex ++) {
      let name = repositoriesObj.items[reposIndex].name;
      let owner = repositoriesObj.items[reposIndex].owner.login;
        let stars = repositoriesObj.items[reposIndex].stargazers_count;
      
      let dropdownTags = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
      dropdownContainer.insertAdjacentHTML('afterbegin', dropdownTags);
    }
  }


function clearDropdownList() {
    dropdownContainer.innerHTML = "";
}


function addSelected(target) {
    let name = target.textContent;
    let owner = target.dataset.owner;
    let stars = target.dataset.stars;
    let selectedTag = `<div class="selected">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="button-close"></button></div>`;
    selectedContainer.insertAdjacentHTML('afterbegin', selectedTag);
}

function debounce(fn, debounceTime) {
    
    let timer;
    return function wrapper(...args) {
        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
    }, debounceTime);
    };

};










const searchRepositoriesDebounce = debounce(searchRepositories, 600);
searchInput.addEventListener("input", searchRepositoriesDebounce);
