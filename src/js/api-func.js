import axios from 'axios';
import { settings } from '../index';
import Utils from './utils';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';

axios.defaults.baseURL = BASE_URL;

let searchOptions = `trending/movie/day`;
let searchOptionsFromUser = `search/movie`; //для запроса по ключевому слову
let searchOptionsForFilter = `discover/movie`;

// get popular films

async function getPopularFilms() {
  const { page } = settings;
  const response = await axios.get(`${searchOptions}?api_key=${API_KEY}&page=${page}`);
  return response.data;
}

// get films by query

async function getSerchFilmsFromUser(requestFromUser) {
  const { page } = settings;
  const response = await axios.get(
    `${searchOptionsFromUser}?api_key=${API_KEY}&language=en-US&query=${requestFromUser}&page=${page}&include_adult=false`,
  );
  return response.data;
}

async function getFilmsByGenresFilter(genreId) {
  const { page } = settings;
  const response = await axios.get(
    `${searchOptionsForFilter}?api_key=${API_KEY}&language=en-US&page=${page}&include_adult=false&with_genres=${genreId}&sort_by=popularity.desc`,
  );
  return response.data;
}

// get trailer

async function getTrailer(id) {
  const response = await axios.get(`movie/${id}?api_key=${API_KEY}&language=us&append_to_response=videos `,
  );
  return response.data;
}

export default { getPopularFilms, getSerchFilmsFromUser, getFilmsByGenresFilter, getTrailer  };
