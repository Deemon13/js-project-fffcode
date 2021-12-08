import { refs } from "./refs"
import { createLibraryPlug } from './library-plug';

export function createLibrary() {
refs.header.classList.add('library');
    refs.filmsContainerRef.innerHTML = " "
    refs.headerButtons.innerHTML = `
        <button class="btn btn__hover-focus" type="button" data-action="watched">Watched</button>
        <button class="btn btn__hover-focus" type="button" data-action="queue">queue</button>`
    createLibraryPlug();
    document.querySelector(".plug-message").textContent = "Add movies to the queue so you don't forget to watch them later!"
}
export function createHome() {
    // refs.filmsContainerRef.innerHTML =``;
    refs.header.classList.remove('library');
    refs.headerFunctional.innerHTML =
       `<form class="search-form g" id="search-form">
        <input
          class="search-form_input"
          type="text"
          name="searchQuery"
          autocomplete="off"
          placeholder="Поиск фильмов"
        />
        <button class="search-form_btn" type="submit">
        </button>
      </form>`
}