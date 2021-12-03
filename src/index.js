import './sass/main.scss';

import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';

axios.defaults.baseURL = BASE_URL;

let searchOptions = `trending/movie/week`;

const filmsContainerRef = document.querySelector('.films-container');

async function getPopularFilms() {
  const response = await axios.get(`${searchOptions}?api_key=${API_KEY}&page=1`);
  return response.data;
}

console.log(getPopularFilms());

function renderMarkup({ results }) {
  console.log(results);
  const markup = results
    .map(({ poster_path, original_title, popularity, title, release_date }) => {
      return `
      <a class="gallery__link" href="">
        <div class="photo-card">
        <p>Title: ${original_title}</p>
            <img src="https://image.tmdb.org/t/p/w342${poster_path}" width="305" height="205" alt="${title}" loading="lazy" />
        <p>Popularity: ${popularity}</p>
        <p>Release_date: ${release_date}</p>
        </div>
        </a>
        `;
    })
    .join('');
  filmsContainerRef.insertAdjacentHTML('beforeend', markup);
}

getPopularFilms().then(results => {
  renderMarkup(results);
});
