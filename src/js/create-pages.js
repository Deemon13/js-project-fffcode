import { refs } from "./refs"
export function createLibrary() {
    refs.filmsContainerRef.innerHTML = " "
    refs.headerButtons.innerHTML = `
        <button type="button">Watched</button>
        <button type="button">queue</button>`
}
export function createHome() {
    // refs.filmsContainerRef.innerHTML =``;
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