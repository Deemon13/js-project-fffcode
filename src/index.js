import './sass/main.scss';
import 'animate.css';

import API from './js/api-func';

import { refs } from './js/refs';
import { createLibrary } from './js/create-pages';
import { createHome } from './js/create-pages';
import { getGenresArray, transformGenresList } from './js/genres';
import { modal } from './js/modal';
// import { modal } from './js/modal';
import { listenModalClick, onGalleryModalOpen } from './js/modal';

import Utils from './js/utils';
import SearchProps from './js/search';
import { initPagination } from './js/pagination';
import { onButtonClick, renderQueue } from './js/render-library';
import { logo } from './js/ligo';


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

refs.pageLibrary.addEventListener('click', onClickPageLibrary); //слушатель на кнопке библиотеки

function onClickPageLibrary() {
  refs.pageHome.classList.remove('header__link_current');
  refs.pageLibrary.classList.add('header__link_current');
  // imgHero.srs = ''
  
  createLibrary(); //рендер кнопок на странице библиотеки
  refs.headerFunctional.addEventListener("click", onButtonClick);
  refs.pageHome.addEventListener("click", onClickPageHome);
  const queueMovies = renderQueue();
  if (!queueMovies) {
    pagination.then((res) => {
      settings.type = "queue";
      res.reset(0);
      res.movePageTo(1);
    });
    return;
  }
  pagination.then((res) => {
    settings.type = "queue";
    res.reset(queueMovies.length);
    res.movePageTo(1);
  });
}
function onClickPageHome() {
  refs.pageLibrary.classList.remove('header__link_current');
  refs.pageHome.classList.add('header__link_current');
  createHome(); //рендер кнопок на главной странице
  getGenresArray(Utils.genresName);
  Utils.clearFoo();
  const data = getArrMoviesFromLocalStorage();
  Utils.renderMarkup(data);

  listenModalClick(onGalleryModalOpen);
  refs.pageLibrary.addEventListener("click", onClickPageLibrary);
  refs.pageHome.removeEventListener("click", onClickPageHome);
  refs.headerFunctional.removeEventListener("click", onButtonClick);
  pagination.then((res) => {
    settings.type = "popular-films";
    res.reset(data.total_pages);
    res.movePageTo(1);
  });

}
const logoHome = document.querySelector(".header__logo");
logoHome.addEventListener('click',onClickLogo);
  function onClickLogo(e){
   onClickPageHome();
  }

///////////////////////////////////////////////////////////
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