import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3/';
const API_KEY = '9eab4199b01913b6a81b6702a89a7ff0';
const LOCALSTORAGE_GENRES_KEY = "genres-key";

axios.defaults.baseURL = BASE_URL;

let genresOptions = `genre/movie/list`

async function getGenresName() {
  const {data} = await axios.get(`${genresOptions}?api_key=${API_KEY}`);
  return data.genres;
}

function saveGenres() {
  if (localStorage.getItem(LOCALSTORAGE_GENRES_KEY) === null) {
  getGenresName().then(genres =>{
    localStorage.setItem(LOCALSTORAGE_GENRES_KEY, JSON.stringify(genres))
  })
  }
}

export default function getGenresArray(names) {
  const savedGenres = localStorage.getItem(LOCALSTORAGE_GENRES_KEY);
  const genresArray = JSON.parse(savedGenres)
  genresArray.forEach(genre => {
   names[genre.id] = genre.name;
})
}

saveGenres();