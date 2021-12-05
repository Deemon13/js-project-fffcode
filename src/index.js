import './sass/main.scss';

import API from './js/api-func';

import { refs } from './js/refs';
import { createLibrary } from './js/create-pages';
import { createHome } from './js/create-pages';
import { getGenresArray } from './js/genres';
// import { modal } from './js/modal';
import {listenModalClick} from './js/modal'

import Utils from './js/utils';
import SearchProps from './js/search';

// export const LOCALSTORAGE_ARR_MOVIES = "arr-current-movies";

API.getPopularFilms().then(results => {
  getGenresArray(Utils.genresName);
  saveArrMoviesToLocalStorage(results); // сохраняем в локал массив найденных фильмов
  Utils.renderMarkup(getArrMoviesFromLocalStorage()); // рисуем
  listenModalClick()
});

// логика хедера
// при загрузке страницы добавляется динамически инпут
createHome();

refs.pageLibrary.addEventListener('click', onClickPageLibrary); //слушатель на кнопке библиотеки

function onClickPageLibrary() {
  createLibrary(); //рендер кнопок на странице библиотеки
  refs.pageLibrary.removeEventListener('click', onClickPageLibrary);
  refs.pageHome.addEventListener('click', onClickPageHome);
}
function onClickPageHome() {
  createHome(); //рендер кнопок на главной странице
  getGenresArray(Utils.genresName);
    Utils.renderMarkup(getArrMoviesFromLocalStorage());
  refs.pageLibrary.addEventListener('click', onClickPageLibrary);
  refs.pageHome.removeEventListener('click', onClickPageHome);
}

///////////////////////////////////////////////////////////
/// Реализация поиска кинофильма по ключевому слову (на главной странице)

document.querySelector('.search-form').addEventListener('submit', SearchProps.checkRequest);

/////////////////////////////////////////////////

export function saveArrMoviesToLocalStorage(arrMovies) {
  localStorage.setItem("arr-current-movies", JSON.stringify(arrMovies)); // сохраняем в локал данные про фильмы
}
export function getArrMoviesFromLocalStorage() {
  const savedArrMovies = localStorage.getItem("arr-current-movies"); 
  return JSON.parse(savedArrMovies); // получаем данные про фильмы с локала
}
