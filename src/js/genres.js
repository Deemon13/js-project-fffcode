import axios from 'axios';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  width: '600px',
  height: '30px',
  position: 'center-top',
  distance: '190px',
  opacity: 1,
  timeout: 3000,
  //closeButton: true, //// если решим сделелать закрытие по кнопке
  useIcon: false, 
});

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';
const LOCALSTORAGE_GENRES_KEY = 'genres-key';

axios.defaults.baseURL = BASE_URL;

let genresOptions = `genre/movie/list`;

async function getGenresName() {
  try {
    const { data } = await axios.get(`${genresOptions}?api_key=${API_KEY}`);
    return data.genres;
  } catch (error) {
    Notiflix.Notify.failure('Ooops! Something went wrong');
  }
}

function saveGenres() {
  if (localStorage.getItem(LOCALSTORAGE_GENRES_KEY) === null) {
    getGenresName().then(genres =>
      localStorage.setItem(LOCALSTORAGE_GENRES_KEY, JSON.stringify(genres)),
    );
  }
}

saveGenres();

export function getGenresArray(names) {
  const savedGenres = localStorage.getItem(LOCALSTORAGE_GENRES_KEY);
  try {
    const genresArray = JSON.parse(savedGenres);
    genresArray.forEach(genre => (names[genre.id] = genre.name));
  } catch (error) {
    Notiflix.Notify.failure('Data loading error! Refresh the page.');
  }
}

export function transformGenresList(genresIdArray, genresData) {
  if (genresIdArray.length > 3) {
    return `${genresData[genresIdArray[0]]}, ${genresData[genresIdArray[1]]}, Other`;
  }
  return genresIdArray.map(genreId => genresData[genreId]).join(', ');
}
