import { refs } from './refs';
import { createLibraryPlug } from './library-plug';
import { icons } from '..';

const searchIcon = `${icons}#icon-search`;

export function createLibrary() {
  refs.header.classList.add('library');
  refs.filmsContainerRef.innerHTML = ' ';
  refs.headerButtons.innerHTML = `
        <button class="btn btn__hover-focus" type="button" data-action="watched">Watched</button>
        <button class="btn btn__hover-focus" type="button" data-action="queue">queue</button>`;
  createLibraryPlug();
}
export function createHome() {
  // refs.filmsContainerRef.innerHTML =``;
  refs.header.classList.remove('library');
  refs.headerFunctional.innerHTML = `<form class="search-form g" id="search-form">
        <input
          class="search-form_input"
          type="text"
          name="searchQuery"
          autocomplete="off"
          placeholder="Searching movie"
        />
        <button class="search-form_btn" type="submit">
              <svg class="search__btn-icon">
                  <use href="${searchIcon}"></use>
              </svg>
        </button>
      </form>`;
}
