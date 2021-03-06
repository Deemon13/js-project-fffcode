import { getArrMoviesFromLocalStorage, pagination, settings } from '../index';
import { renderWatched, renderQueue } from './render-library';
import { initPagination } from './pagination';
import { showGenresListModal } from '../js/genres';
import Utils from '../js/utils';
import Notiflix from 'notiflix';
import trailer from './trailer2';

Notiflix.Confirm.init({
  className: 'notiflix-confirm',
  width: '300px',
  zindex: 4003,
  position: 'center', // 'center' - 'center-top' - 'center-bottom' - 'right-top' - 'right-center' - 'right-bottom' - 'left-top' - 'left-center' - 'left-bottom'
  distance: '10px',
  backgroundColor: '#ffffff',
  borderRadius: '25px',
  backOverlay: true,
  backOverlayColor: 'rgba(0,0,0,0.5)',
  rtl: false,
  fontFamily: 'Roboto',
  cssAnimation: true,
  cssAnimationDuration: 300,
  cssAnimationStyle: 'fade', // 'zoom' - 'fade'
  plainText: true,

  titleColor: '#000000',
  titleFontSize: '16px',
  titleMaxLength: 34,

  messageColor: '#000000',
  messageFontSize: '16px',
  messageMaxLength: 110,

  buttonsFontSize: '15px',
  buttonsMaxLength: 34,
  okButtonColor: '#f8f8f8',
  okButtonBackground: '#ff6b01',
  okButtonBorder: '1px',
  cancelButtonColor: '#f8f8f8',
  cancelButtonBackground: '#a9a9a9',
});

const refs = {
  openModalBtn: document.querySelectorAll('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
  modalMarkupContainer: document.querySelector('.modal-card'),
  backdrop: document.querySelector('.backdrop'),
  bodyEl: document.querySelector('body'),
};

refs.openModalBtn.forEach(card => {
  card.addEventListener('click', toggleModal);
});

function toggleModal(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  removeIsHidden();
  document.addEventListener('keydown', onEscKeyPress);
  refs.closeModalBtn.addEventListener('click', onModalClose);
  refs.modal.addEventListener('click', onBackdropClick);
  refs.bodyEl.classList.add('modal-open');
}

function onModalClose() {
  addIsHidden();
  onCloseModal(); // обновление рендера в библиотеке
  refs.closeModalBtn.removeEventListener('click', onModalClose);
  refs.bodyEl.classList.remove('modal-open');
}

function onBackdropClick(event) {
  if (event.currentTarget === event.target) {
    addIsHidden();
    onCloseModal(); // обновление рендера в библиотеке
    document.removeEventListener('keydown', onEscKeyPress);
    refs.modal.removeEventListener('click', onBackdropClick);
    refs.bodyEl.classList.remove('modal-open');
  }
}

function onEscKeyPress(event) {
  const ESC_KEY_CODE = 'Escape';
  const isEscKey = event.code === ESC_KEY_CODE;

  if (isEscKey) {
    document.removeEventListener('keydown', onEscKeyPress);
    addIsHidden();
    onCloseModal(); // обновление рендера в библиотеке
    refs.closeModalBtn.removeEventListener('click', onModalClose);
    refs.modal.removeEventListener('click', onBackdropClick);
    refs.bodyEl.classList.remove('modal-open');
  }
}

///////////////////////////////////////////////////////////
export function onCloseModal() {
  // функция обновления рендера в библиотеке
  // при закрытии модалки
  if (document.querySelector('.page-library').classList.contains('header__link_current')) {
    if (document.querySelector("[data-action='watched']").classList.contains('activeBtnEl')) {
      //если активна кнопка watched
      renderWatched();
    } else {
      // по умолчанию рендер queue
      renderQueue();
    }
  }
}
// при нажатии на одну кнопку, на нее вешается класс activeBtnEl, при этом на другой кнопке этот класс удаляется
export function onClickBtnWatched() {
  document.querySelector("[data-action='watched']").classList.add('activeBtnEl');
  document.querySelector("[data-action='queue']").classList.remove('activeBtnEl');

  const watchedMovies = renderWatched();
  if (!watchedMovies) return;
  pagination.then(res => {
    settings.type = 'watched';
    res.reset(watchedMovies.length);
    res.movePageTo(1);
  });
}
export function onClickBtnQueue() {
  document.querySelector("[data-action='queue']").classList.add('activeBtnEl');
  document.querySelector("[data-action='watched']").classList.remove('activeBtnEl');

  const queueMovies = renderQueue();
  if (!queueMovies) return;
  pagination.then(res => {
    settings.type = 'queue';
    res.reset(queueMovies.length);
    res.movePageTo(1);
  });
}
///////////////////////////////////////////////////////////

function addIsHidden() {
  refs.modal.classList.add('is-hidden');
}

function removeIsHidden() {
  refs.modal.classList.remove('is-hidden');
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
  console.log('movieData', movieData);

  const ref = {
    elBtnAddToWatched: document.querySelector('.btn-addToWatched'),
    elBtnAddToQueue: document.querySelector('.btn-addToQueue'),
  };

  if (arrWatchedMovies.find(movie => movie.id === movieData.id)) {
    ref.elBtnAddToWatched.textContent = 'remove from watched';
    ref.elBtnAddToWatched.classList.add('button-active');
  }
  if (arrMoviesToQueue.find(movie => movie.id === movieData.id)) {
    ref.elBtnAddToQueue.textContent = 'remove from queue';
    ref.elBtnAddToQueue.classList.add('button-active');
  }

  ref.elBtnAddToWatched.addEventListener('click', onClickBtnAddToWatched);
  ref.elBtnAddToQueue.addEventListener('click', onClickBtnAddToQueue);
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
  ${
    poster_path
      ? `<img src="https://image.tmdb.org/t/p/w342${poster_path}"`
      : `<img src="https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg"`
  }
                class="modal__item-img"width="240"
                height="356"
                alt="${title}"
                loading="lazy"
            />
            <div class="js-card">
            <h2 class="card__title"> ${title}</h2>
            <table class="card__table">
            <tr>
            <td class="card__table-info">Vote/ Votes</td>
            <td class ="card__item" ><span class="movie-card__rating movie-card__m card__item-avarage"> ${vote_average}</span><span class=" movie-card__count"> /&nbsp;<span>${vote_count}</td>
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
            <td class="card__item">${showGenresListModal(genre_ids, Utils.genresName)}</td>
            </tr>
            </table>
            <p class="card__about">ABOUT</p>
            <p class="card__description">${overview}</p>
              
            <div class="modal-buttons">
            <button class=" buttons btn-addToWatched" id="${id}">ADD TO WATCHED</button>
            <button class="buttons btn-addToQueue" id="${id}">ADD TO QUEUE</button>
            </div>

        </div>
        `;

  refs.modalMarkupContainer.innerHTML = markup;

  trailer.trailer(id);
}

// логика кнопок
let arrWatchedMovies = [];
if (getWatchedMovieFromLocalStorage()) {
  // проверяет заполнен ли локальный массив,
  //  если да, то перезаписываем массив arrWatchedMovies на локальные данные про просмотренные фильмы
  arrWatchedMovies = getWatchedMovieFromLocalStorage();
}
function onClickBtnAddToWatched() {
  const buttonaddToWatched = document.querySelector('.btn-addToWatched');
  const currentMovie = arrWatchedMovies.find(movie => movie.id === movieData.id); // ищет в массиве выбраный фильм, id которого наявный в массиве
  if (currentMovie) {
    // проверяет наличие фильма в хранилище просмотреных
    // выполняется если фильм найден в локале
    arrWatchedMovies.forEach((movie, index) => {
      if (currentMovie.id === movie.id) {
        buttonaddToWatched.textContent = 'remove from watched';
        // если id текущего выбраного фильма совпадает с каким то из id, наявных в локале
        /////////// подтверждаем у User удаление фильма ////////////
        Notiflix.Confirm.show(
          '-----DELETE?-----',
          'Delete this movie from WATCHED?',
          'Cancel',
          'Yes',
          function okCb() {
            //  не будем удалять
            return;
          },
          function cancelCb() {
            // нажали кнопку ОК, удаляем из localStorage
            buttonaddToWatched.textContent = 'add to watched';
            arrWatchedMovies.splice(index, 1); // удаление элемента
            localStorage.setItem('watched-movies', JSON.stringify(arrWatchedMovies));
            buttonaddToWatched.classList.remove('button-active');
          },
        );
        ////////////////////////////////////////
      }
    });
    return; // выход из функции
  }
  buttonaddToWatched.textContent = 'remove from watched';
  buttonaddToWatched.classList.add('button-active');
  // выполняется если фильм не найден в локале
  arrWatchedMovies.push(movieData);
  localStorage.setItem('watched-movies', JSON.stringify(arrWatchedMovies));
}
function getWatchedMovieFromLocalStorage() {
  const savedArrWatchedMovies = localStorage.getItem('watched-movies');
  return JSON.parse(savedArrWatchedMovies); // получаем данные про Watched фильмы с локала
}

let arrMoviesToQueue = [];
if (getToQueueMovieFromLocalStorage()) {
  // проверяет заполнен ли локальный массив,
  //  если да, то перезаписываем массив arrMoviesToQueue на локальные данные про фильмы добавленные в очередь
  arrMoviesToQueue = getToQueueMovieFromLocalStorage();
}
function onClickBtnAddToQueue() {
  const buttonAddToQueue = document.querySelector('.btn-addToQueue');
  const currentMovie = arrMoviesToQueue.find(movie => movie.id === movieData.id); // ищет в массиве выбраный фильм, id которого наявный в массиве
  if (currentMovie) {
    // проверяет наличие фильма в хранилище фильмов в очереди
    // выполняется если фильм найден в локале
    arrMoviesToQueue.forEach((movie, index) => {
      if (currentMovie.id === movie.id) {
        buttonAddToQueue.textContent = 'remove from queue';
        // если id текущего выбраного фильма совпадает с каким то из id, наявных в локале
        /////////// подтверждаем у User удаление фильма /////////////////////////////
        Notiflix.Confirm.show(
          '-----DELETE?-----',
          'Delete this movie from QUEUE?',
          'Cancel',
          'Yes',
          function okCb() {
            //  не будем удалять
            return;
          },
          function cancelCb() {
            // нажали кнопку ОК, удаляем из localStorage
            buttonAddToQueue.textContent = 'add to queue';
            arrMoviesToQueue.splice(index, 1); // удаление элемента
            localStorage.setItem('queue-movies', JSON.stringify(arrMoviesToQueue));
            buttonAddToQueue.classList.remove('button-active');
          },
        );
        ////////////////////////////////////////
      }
    });
    return; // выход из функции
  }
  buttonAddToQueue.textContent = 'remove from queue';
  buttonAddToQueue.classList.add('button-active');
  // выполняется если фильм не найден в локале
  arrMoviesToQueue.push(movieData);
  localStorage.setItem('queue-movies', JSON.stringify(arrMoviesToQueue));
}
function getToQueueMovieFromLocalStorage() {
  const savedArrMoviesToQueue = localStorage.getItem('queue-movies');
  return JSON.parse(savedArrMoviesToQueue); // получаем данные про Queue фильмы с локала
}

export {
  getWatchedMovieFromLocalStorage,
  getToQueueMovieFromLocalStorage,
  listenModalClick,
  onGalleryModalOpen,
  onWatchedModalOpen,
  onQueueModalOpen,
};
