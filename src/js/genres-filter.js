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
  refs.filterBtn.classList.remove("filters-menu--open");
}

function onGenresButtonClick() {
  if(refs.filterBtn.classList.contains("filters-menu--open")) {
    hideFilterList();
    return;
  }
  refs.filterBtn.classList.add("filters-menu--open");
  refs.filterHiddenContainer.classList.remove("visually-hidden");
  renderGenresListMarkup(genresArray);
  refs.filterBox.addEventListener("click", onGenreChoosed);
  refs.filterChooseAll.addEventListener("click", onAllGenresChoosed);
  document.addEventListener('keydown', onEscPress);
}

function onGenreChoosed(event) {
  onSearchFilmsByGenre(event);
  hideFilterList();
}

function onAllGenresChoosed() {
  onClickPageHome();
  hideFilterList();
}

function onEscPress(event) {
  const ESC_KEY_CODE = 'Escape';
  if(event.code === ESC_KEY_CODE) {
    document.removeEventListener('keydown', onEscPress);
    hideFilterList();
  }
}

const clickBody = document.querySelector('main');
clickBody.addEventListener("click", (event) => {
  event.stopPropagation();
  

  if (hideFilterList) {
    document.removeEventListener('keydown', hideFilterList);
    hideFilterList();
  }
});

export function showGenresFilter() {
  refs.filterBtn.classList.remove("visually-hidden");
}

export function hideGenresFilter() {
  refs.filterBtn.classList.add("visually-hidden");
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

