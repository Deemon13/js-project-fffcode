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
  createLibrary(); //рендер кнопок на странице библиотеки
  refs.headerFunctional.addEventListener('click', onButtonClick);
  renderQueue();
  /*  refs.pageLibrary.removeEventListener('click', onClickPageLibrary); - убрала для реализации работы ссылки My library, при клике на которую рендериться галерея фильмов Queue (очередь просмотра) */
  refs.pageHome.addEventListener('click', onClickPageHome);
}
function onClickPageHome() {
  createHome(); //рендер кнопок на главной странице
  getGenresArray(Utils.genresName);
  Utils.clearFoo();
  const data = getArrMoviesFromLocalStorage();
  Utils.renderMarkup(data);
  refs.headerFunctional.removeEventListener('click', onButtonClick);
  pagination.then(res => {
    settings.type = 'popular-films';
    res.reset(data.total_pages);
  });
  listenModalClick(onGalleryModalOpen);
  refs.pageLibrary.addEventListener('click', onClickPageLibrary);
  refs.pageHome.removeEventListener('click', onClickPageHome);
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

// const logoHome = document.querySelector(".logo");
// logoHome.addEventListener('click',onClickPageHome);
//   // function onClickLogo(e){
//   //   e.preventDefault();
//     //   Utils.clearFoo();
//   //   onClickPageHome();

//   // }
