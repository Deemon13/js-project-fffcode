import icons from '/images/icons.svg';
import youtubeicon from '/images/youtube.svg';
export { icons };
export { youtubeicon };
import './sass/main.scss';
import 'animate.css';
import API from './js/api-func';
import { refs } from './js/refs';
import { createLibrary } from './js/create-pages';
import { createHome } from './js/create-pages';
import { getGenresArray, transformGenresList } from './js/genres';
import { modal } from './js/modal';
import { listenModalClick, onGalleryModalOpen } from './js/modal';
import { onCloseModal, onClickBtnQueue, onClickBtnWatched } from './js/modal';
import Utils from './js/utils';
import SearchProps from './js/search';
import { initPagination } from './js/pagination';
import { renderQueue, renderWatched } from './js/render-library';
import { logo } from './js/ligo';
import scrollUp from './js/scrollUp';
import scrollDown from './js/scrollDown';
import { sortByGenres, showGenresFilter, hideGenresFilter } from './js/genres-filter';

const settings = { page: 1, type: 'popular-films' };
export { settings };

let pagination = null;

// export const LOCALSTORAGE_ARR_MOVIES = "arr-current-movies";

API.getPopularFilms().then(results => {
  Utils.spinner();
  const { page, total_results: totalResults } = results;
  getGenresArray(Utils.genresName);
  saveArrMoviesToLocalStorage(results); // сохраняем в локал массив найденных фильмов
  Utils.renderMarkup(getArrMoviesFromLocalStorage()); // рисуем
  listenModalClick(onGalleryModalOpen);
  pagination = initPagination({
    page,
    itemsPerPage: 20,
    totalItems: totalResults,
  });
});

// логика хедера
// при загрузке страницы добавляется динамически инпут
createHome();
sortByGenres();

refs.pageLibrary.addEventListener('click', onClickPageLibrary); //слушатель на кнопке библиотеки

function onClickPageLibrary() {
  refs.pageHome.classList.add('page-home__color-ack');
  refs.pageHome.classList.remove('header__link_current');
  refs.pageLibrary.classList.add('header__link_current');
  // imgHero.srs = ''
  hideGenresFilter();
  createLibrary(); //рендер кнопок на странице библиотеки

  document.querySelector("[data-action='watched']").addEventListener('click', onClickBtnWatched);
  document.querySelector("[data-action='queue']").addEventListener('click', onClickBtnQueue);
  document.querySelector("[data-action='queue']").classList.toggle('activeBtnEl');

  refs.pageHome.addEventListener('click', onClickPageHome);
  const queueMovies = renderQueue();
  if (!queueMovies) {
    pagination.then(res => {
      settings.type = 'queue';
      res.reset(0);
      res.movePageTo(1);
    });
    return;
  }
  pagination.then(res => {
    settings.type = 'queue';
    res.reset(queueMovies.length);
    res.movePageTo(1);
  });
}

// refs.pageHome.classList.add('page-home__color-ack');
export async function onClickPageHome() {
  refs.pageHome.classList.remove('page-home__color-ack');
  refs.pageLibrary.classList.remove('header__link_current');
  refs.pageHome.classList.add('header__link_current');

  createHome(); //рендер кнопок на главной странице
  showGenresFilter();
  getGenresArray(Utils.genresName);
  Utils.clearFoo();
  const data = getArrMoviesFromLocalStorage();
  Utils.renderMarkup(data);

  listenModalClick(onGalleryModalOpen);
  refs.pageLibrary.addEventListener('click', onClickPageLibrary);
  refs.pageHome.removeEventListener('click', onClickPageHome);
  pagination.then(res => {
    settings.type = 'popular-films';
    res.reset(data.total_pages);
    res.movePageTo(1);
  });
}
const logoHome = document.querySelector('.header__logo');
logoHome.addEventListener('click', onClickLogo);
function onClickLogo(e) {
  onClickPageHome();
}

/// Реализация поиска кинофильма по ключевому слову (на главной странице)

document.querySelector('.search-form').addEventListener('submit', SearchProps.checkRequest);

/////////////////////////////////////////////////

export { pagination };
export function saveArrMoviesToLocalStorage(arrMovies) {
  localStorage.setItem('arr-current-movies', JSON.stringify(arrMovies)); // сохраняем в локал данные про фильмы
}
export function getArrMoviesFromLocalStorage() {
  const savedArrMovies = localStorage.getItem('arr-current-movies');
  return JSON.parse(savedArrMovies); // получаем данные про фильмы с локала
}

refs.openTeamBtn.addEventListener('click', openTeamModal);

function openTeamModal(event) {
  event.preventDefault();
  toggleTeam();
  document.addEventListener('keydown', onEscKeyPress);
  refs.closeTeamBtn.addEventListener('click', onTeamModalClose);
  refs.team.addEventListener('click', onBackdropClick);
}

function toggleTeam() {
  refs.team.classList.toggle('is-hidden');
}

function onTeamModalClose() {
  toggleTeam();
  refs.closeTeamBtn.removeEventListener('click', onTeamModalClose);
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    toggleTeam();
    document.removeEventListener('keydown', onEscKeyPress);
    refs.team.removeEventListener('click', onBackdropClick);
  }
}

function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;

  if (isEscKey) {
    document.removeEventListener('keydown', onEscKeyPress);
    toggleTeam();
    refs.closeTeamBtn.removeEventListener('click', onTeamModalClose);
    refs.team.removeEventListener('click', onBackdropClick);
  }
}
