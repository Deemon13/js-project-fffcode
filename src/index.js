import './sass/main.scss';
import axios from 'axios';

import { refs } from './js/refs';
import { createLibrary } from './js/create-pages';
import { createHome } from './js/create-pages';
import { getGenresArray, transformGenresList } from './js/genres';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';

axios.defaults.baseURL = BASE_URL;

let searchOptions = `trending/movie/week`;
let genresName = {};

async function getPopularFilms() {
  const response = await axios.get(`${searchOptions}?api_key=${API_KEY}&page=1`);
  return response.data;
}

console.log(getPopularFilms());

function renderMarkup({ results }) {
  // console.log(results);
  const markup = results
    .map(({ poster_path, original_title, genre_ids, vote_average, title, release_date }) => {
      return `
      <a class="gallery__link" href="", >
        <div class="photo-card" >

            <img src="https://image.tmdb.org/t/p/w342${poster_path}" width="305" height="205" alt="${title}" loading="lazy"  />
            <p> ${original_title}</p>
        <p> ${transformGenresList(genre_ids, genresName)} | </p>
        <p> ${release_date.slice(0, 4)}</p>
        <p> ${vote_average}</p>

        </div>
        </a>
        `;
    })
    .join('');

  refs.filmsContainerRef.insertAdjacentHTML('beforeend', markup);
}

getPopularFilms().then(results => {
  getGenresArray(genresName);
  renderMarkup(results);
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
  getPopularFilms().then(results => {
    getGenresArray(genresName);
    renderMarkup(results);
  }); // рендер фильмов
  refs.pageLibrary.addEventListener('click', onClickPageLibrary);
  refs.pageHome.removeEventListener('click', onClickPageHome);
}

///////////////////////////////////////////////////////////
/// Реализация поиска кинофильма по ключевому слову (на главной странице)

let searchOptionsFromUser = `search/movie`; //для запроса по ключевому слову
let requestFromUser = '';

document.querySelector('.search-form').addEventListener('submit', checkRequest);

async function getSerchFilmsFromUser(requestFromUser) {
  const response = await axios.get(
    `${searchOptionsFromUser}?api_key=${API_KEY}&language=en-US&query=${requestFromUser}&page=1&include_adult=false`,
  );
  return response.data;
}

// прверяем  то что ввел User
function checkRequest(event) {
  event.preventDefault();
  requestFromUser = document.querySelector('.search-form_input').value;
  if (!requestFromUser) {
    console.log('Введите название фильма для поиска, пожалуйста');
    return;
  }
  /// если ОК то делаем запрос
  onSearchFromUser(requestFromUser);
}

async function onSearchFromUser(requestFromUser) {
  // чистим перед отрисовкой результатов поиска
  clearFoo();

  try {
    const response = await getSerchFilmsFromUser(requestFromUser);
    if (!response.total_results) {
      console.log(
        'Извините, фильмов, соответствующих вашему поисковому запросу, нет. Пожалуйста, попробуйте еще раз.',
      );
      return;
    }

    const responseTotalResults = response.total_results; /// Кол-во найденных результатов

    console.log(`We found ${responseTotalResults} movies.`);
    renderMarkup(response); /// Рисуем
  } catch (error) {
    console.log('что-то пошло не так');
    return;
  }
}

/// Функция для очистки экрана перед отрисовкой
function clearFoo() {
  refs.filmsContainerRef.innerHTML = '';
}

/////////////////////////////////////////////////
