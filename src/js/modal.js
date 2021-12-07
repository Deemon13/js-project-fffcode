import { getArrMoviesFromLocalStorage } from '../index';
import { transformGenresList } from '../js/genres';
import Utils from '../js/utils';

const refs = {
  openModalBtn: document.querySelectorAll('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
  modalMarkupContainer: document.querySelector('.modal-card'),
};

refs.openModalBtn.forEach(card => {
  card.addEventListener('click', toggleModal);
});
refs.closeModalBtn.addEventListener('click', toggleModal);

function toggleModal(event) {
  event.preventDefault();
  refs.modal.classList.toggle('is-hidden');
}


// Логика заполнения модалки
let moviesObj = {};
let movieData;

// Добавления слушателя на ссылку карточки
export function listenModalClick() {
  const film = document.querySelectorAll('.gallery__link');
  film.forEach(card => {
    card.addEventListener('click', onModalOpen);
  });
}

// Функция возвращает объект из localStorage, который заполняется в цикле в переменную moviesObj.
//  Объект получается в ввиде ключ(id фильма) - объект полной информации о фильме.
function getMovieDataObjectById() {
  const parsedSaveData = getArrMoviesFromLocalStorage();
  const movieById = parsedSaveData.results.forEach(movie => {
    moviesObj[movie.id] = movie;
  });
}

// По ключам из moviesObj находим выбранный фильм по id
function onModalOpen(event) {
  event.preventDefault();
  getMovieDataObjectById();
  const currentId = event.currentTarget.id;
  movieData = moviesObj[currentId];
  renderModalMarkup(movieData);

  const ref = {
    elBtnAddToWatched: document.querySelector('.btn-addToWatched'),
    elBtnAddToQueue: document.querySelector('.btn-addToQueue'),
  }

  if (arrWatchedMovies.find(movie => movie.id === movieData.id)) {
    ref.elBtnAddToWatched.textContent = "remove from watched";
  }
  if (arrMoviesToQueue.find(movie => movie.id === movieData.id)) {
    ref.elBtnAddToQueue.textContent = "remove from queue";
  }
    
  ref.elBtnAddToWatched.addEventListener('click', onClickBtnAddToWatched);
  ref.elBtnAddToQueue.addEventListener('click', onClickBtnAddToQueue);
}

function renderModalMarkup({
  id,
  poster_path,
  original_title,
  genre_ids,
  vote_average,
  vote_count,
  popularity,
  title,
  overview,
}) {
  const markup = `
            <img src="https://image.tmdb.org/t/p/w342${poster_path}"
                class="modal__item-img"width="305"
                height="205"
                alt="${title}"
                loading="lazy"
            />
            <div>
            <h2 class="card__title"> ${title}</h2>
            <table class="card__table">
            <tr>
            <td class="card__table-info">Vote/ Votes</td>
            <td class ="card__item" ><span class="movie-card__rating movie-card__m card__item-avarage"> ${vote_average}</span><span class=" movie-card__count">/&nbsp;<span>${vote_count}</td>
            </tr>
            <tr>
            <td class="card__table-info">Popularity</td>
            <td class="card__item">${popularity}</td>
            </tr>
            <tr>
            <td class="card__table-info">Original Title</td>
            <td class="card__item">${original_title}</td>
            </tr>
            <tr>
            <td class="card__table-info">Genre</td>
            <td class="card__item">${transformGenresList(genre_ids, Utils.genresName)}</td>
            </tr>
            </table>
            <p class="card__about">ABOUT</p>
            <p class="card__description">${overview}</p>
              
            <div class="modal-buttons">
            <button class=" buttons button-active btn-addToWatched" id="${id}">ADD TO WATCHED</button>
            <button class="buttons btn-addToQueue" id="${id}">ADD TO QUEUE</button>
            </div>
            </div>
        </div>
        `;

  refs.modalMarkupContainer.innerHTML = markup;
}


// логика кнопок
let arrWatchedMovies = [];
if (getWatchedMovieFromLocalStorage()) { // проверяет заполнен ли локальный массив,
  //  если да, то перезаписываем массив arrWatchedMovies на локальные данные про просмотренные фильмы
  arrWatchedMovies = getWatchedMovieFromLocalStorage();
}
function onClickBtnAddToWatched() {
  const currentMovie = arrWatchedMovies.find(movie => movie.id === movieData.id); // ищет в массиве выбраный фильм, id которого наявный в массиве
  if (currentMovie) { // проверяет наличие фильма в хранилище просмотреных
      // выполняется если фильм найден в локале
    document.querySelector('.btn-addToWatched').textContent = "add to Watched"; 
    arrWatchedMovies.forEach((movie, index) => { 
      if (currentMovie.id === movie.id) { // если id текущего выбраного фильма совпадает с каким то из id, наявных в локале
        arrWatchedMovies.splice(index, 1); // удаление элемента
        localStorage.setItem('watched-movies', JSON.stringify(arrWatchedMovies));
      }
    })
    return; // выход из функции
  }
  document.querySelector('.btn-addToWatched').textContent = "remove To Watched";
  // выполняется если фильм не найден в локале
  arrWatchedMovies.push(movieData); 
  localStorage.setItem('watched-movies', JSON.stringify(arrWatchedMovies));
}
function getWatchedMovieFromLocalStorage() {
  const savedArrWatchedMovies = localStorage.getItem('watched-movies');
  return JSON.parse(savedArrWatchedMovies); // получаем данные про Watched фильмы с локала
}

let arrMoviesToQueue = [];
if (getToQueueMovieFromLocalStorage()) { // проверяет заполнен ли локальный массив,
  //  если да, то перезаписываем массив arrMoviesToQueue на локальные данные про фильмы добавленные в очередь
  arrMoviesToQueue = getToQueueMovieFromLocalStorage();
}
function onClickBtnAddToQueue() {
  const currentMovie = arrMoviesToQueue.find(movie => movie.id === movieData.id); // ищет в массиве выбраный фильм, id которого наявный в массиве
  if (currentMovie) { // проверяет наличие фильма в хранилище фильмов в очереди
      // выполняется если фильм найден в локале
    document.querySelector('.btn-addToQueue').textContent = "add to queue"; 
    arrMoviesToQueue.forEach((movie, index) => { 
      if (currentMovie.id === movie.id) { // если id текущего выбраного фильма совпадает с каким то из id, наявных в локале
        arrMoviesToQueue.splice(index, 1); // удаление элемента
        localStorage.setItem('queue-movies', JSON.stringify(arrMoviesToQueue));
      }
    })
    return; // выход из функции
  }
  document.querySelector('.btn-addToQueue').textContent = "remove from queue";
  // выполняется если фильм не найден в локале
  arrMoviesToQueue.push(movieData);
  localStorage.setItem('queue-movies', JSON.stringify(arrMoviesToQueue));
}
function getToQueueMovieFromLocalStorage() {
  const savedArrMoviesToQueue = localStorage.getItem('queue-movies');
  return JSON.parse(savedArrMoviesToQueue); // получаем данные про Queue фильмы с локала
}
export { getWatchedMovieFromLocalStorage, getToQueueMovieFromLocalStorage };
