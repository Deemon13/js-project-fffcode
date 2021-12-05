import './sass/main.scss';
import axios from 'axios';

import { refs } from './js/refs';
import { createLibrary, createHome } from './js/create-pages';
import { getGenresArray, transformGenresList } from './js/genres';
import { modal } from './js/modal';

import Utils from './js/utils';
import SearchProps from './js/search';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';
export const LOCALSTORAGE_ARR_MOVIES = "arr-current-movies";

axios.defaults.baseURL = BASE_URL;

let searchOptions = `trending/movie/week`;
// let genresName = {};

async function getPopularFilms() {
  const response = await axios.get(`${searchOptions}?api_key=${API_KEY}&page=1`);
  return response.data;
}

console.log(getPopularFilms());

getPopularFilms().then(results => {
  console.log(results)
  saveArrMoviesToLocalStorage(results); // сохраняем в локал массив найденных фильмов
  getGenresArray(Utils.genresName);
  Utils.renderMarkup(getArrMoviesFromLocalStorage()); // рисуем
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
    Utils.renderMarkup(getArrMoviesFromLocalStorage()); // рисуем
  refs.pageLibrary.addEventListener('click', onClickPageLibrary);
  refs.pageHome.removeEventListener('click', onClickPageHome);
}

///////////////////////////////////////////////////////////
/// Реализация поиска кинофильма по ключевому слову (на главной странице)

let searchOptionsFromUser = `search/movie`; //для запроса по ключевому слову

document.querySelector('.search-form').addEventListener('submit', SearchProps.checkRequest);

export default async function getSerchFilmsFromUser(requestFromUser) {
  const response = await axios.get(
    `${searchOptionsFromUser}?api_key=${API_KEY}&language=en-US&query=${requestFromUser}&page=1&include_adult=false`,
  );
  return response.data;
}

/////////////////////////////////////////////////



export function saveArrMoviesToLocalStorage(arrMovies) {
  localStorage.setItem(LOCALSTORAGE_ARR_MOVIES, JSON.stringify(arrMovies)); // сохраняем в локал данные про фильмы
}
export function getArrMoviesFromLocalStorage() {
  const savedArrMovies = localStorage.getItem(LOCALSTORAGE_ARR_MOVIES); 
  return JSON.parse(savedArrMovies); // получаем данные про фильмы с локала
}
