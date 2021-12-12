import { saveArrMoviesToLocalStorage, getArrMoviesFromLocalStorage } from "../index";
import API from "./api-func";
import Utils from "./utils";
import { refs } from './refs';
import { pagination, settings, onClickPageHome } from "../index";
import { getGenresArray, genresArray } from '../js/genres';
import { listenModalClick, onGalleryModalOpen } from "../js/modal";

export function sortByGenres() {
  refs.filterBtn.addEventListener("click", onGenresButtonClick)
}

export function onSearchFilmsByGenre(event) {
    event.preventDefault()
  let movieGenreId = event.target.id;
  API.getFilmsByGenresFilter(movieGenreId).then(results => {
    Utils.clearFoo();
    getGenresArray(Utils.genresName);
    saveArrMoviesToLocalStorage(results);
    const data = getArrMoviesFromLocalStorage();
    Utils.renderMarkup(data);
    listenModalClick(onGalleryModalOpen);
    pagination.then(res => {
      settings.movieGenreId = movieGenreId;
      settings.type = 'films-by-genre';
      res.reset(data.total_pages);
      /* res.movePageTo(1); */
    });
  });
}

function hideFilterList() {
  refs.filterHiddenContainer.classList.add("visually-hidden");
  refs.filterBox.innerHTML = "";
  refs.filterBtn.removeAttribute('disabled');
}

function onGenresButtonClick() {
  refs.filterHiddenContainer.classList.remove("visually-hidden");
  renderGenresListMarkup(genresArray);
  refs.filterBtn.setAttribute('disabled', true);
  refs.filterHiddenContainer.addEventListener("click", onGenreChoosed);
}

function onGenreChoosed(event) {
  onSearchFilmsByGenre(event);
  hideFilterList();
}

refs.filterChooseAll.addEventListener("click", onClickPageHome);

export function showGenresFilter() {
  refs.genresBtn.classList.remove("visually-hidden");
}

export function hideGenresFilter() {
  refs.genresBtn.classList.add("visually-hidden");
}

function renderGenresListMarkup(genres) {
  const markup = genres
    .map(({ id, name }) => {
      return `
      <li class="genres-menu--list-item">
          <a class="genres-menu--link" id=${id}>${name}</a>
      </li>`;
})
.join('');

refs.filterBox.insertAdjacentHTML('beforeend', markup);
}

