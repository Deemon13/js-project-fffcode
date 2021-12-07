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
function listenModalClick(callback) {
  const film = document.querySelectorAll('.gallery__link');
  film.forEach(card => {
    card.addEventListener('click', callback);
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

function getMovieDataLibrary(savedData) {
  const parsedSaveData = savedData;
  const movieById = parsedSaveData.forEach(movie => {
    moviesObj[movie.id] = movie;
  });
}

// По ключам из moviesObj находим выбранный фильм по id
function onModalOpen(event) {
  const currentId = event.currentTarget.id;
  movieData = moviesObj[currentId];
  renderModalMarkup(movieData);

  document.querySelector('.btn-addToWatched').addEventListener('click', onClickBtnAddToWatched);
  document.querySelector('.btn-addToQueue').addEventListener('click', onClickBtnAddToQueue);
}

function onGalleryModalOpen(event) {
  event.preventDefault();
  getMovieDataObjectById();
  onModalOpen(event);
}

function onWatchedModalOpen(event) {
  event.preventDefault();
  getMovieDataLibrary(getWatchedMovieFromLocalStorage());
  onModalOpen(event);
}

function onQueueModalOpen(event) {
  event.preventDefault();
  getMovieDataLibrary(getToQueueMovieFromLocalStorage());
  onModalOpen(event);
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


let arrWatchedMovies = [];
if (getWatchedMovieFromLocalStorage()) { // проверяет заполнен ли локальный массив,
  //  если да, то перезаписываем массив arrWatchedMovies на локальные данные про просмотренные фильмы
  arrWatchedMovies = getWatchedMovieFromLocalStorage();
}

function onClickBtnAddToWatched() {
  if (arrWatchedMovies.some(movie => movie.id === movieData.id)) {
    // проверяет наличие фильма в хранилище просмотреных
    return; // далее тут будет замена кнопки add to Watched на кнопку удаление из локала, и реализация удаления
  }
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
  if (arrMoviesToQueue.some(movie => movie.id === movieData.id)) {
    // проверяет наличие фильма в хранилище просмотреных
    return; // далее тут будет замена кнопки add to Watched на кнопку удаление из локала, и реализация удаления
  }
  arrMoviesToQueue.push(movieData);
  localStorage.setItem('queue-movies', JSON.stringify(arrMoviesToQueue));
}

function getToQueueMovieFromLocalStorage() {
  const savedArrMoviesToQueue = localStorage.getItem('queue-movies');
  return JSON.parse(savedArrMoviesToQueue); // получаем данные про Queue фильмы с локала
}
export {getWatchedMovieFromLocalStorage, getToQueueMovieFromLocalStorage, listenModalClick, onGalleryModalOpen, onWatchedModalOpen, onQueueModalOpen};