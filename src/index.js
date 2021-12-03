import './sass/main.scss';
import axios from 'axios';

import { refs } from './js/refs';
import { createLibrary } from './js/library';
import getGenresArray from './js/genres'

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
  console.log(results);
  const markup = results
    .map(({ poster_path, original_title, genre_ids, popularity, title, release_date }) => {
      return `
      <a class="gallery__link" href="">
        <div class="photo-card">
        <p>Title: ${original_title}</p>
            <img src="https://image.tmdb.org/t/p/w342${poster_path}" width="305" height="205" alt="${title}" loading="lazy" />
        <p>Genres: ${genre_ids.map((genreId) => genresName[genreId])}</p>
        <p>Popularity: ${popularity}</p>
        <p>Release_date: ${release_date}</p>
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

refs.pageLibrary.addEventListener("click", createLibrary)