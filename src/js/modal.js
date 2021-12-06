import { getArrMoviesFromLocalStorage } from '../index';
import { transformGenresList } from '../js/genres';
import Utils from '../js/utils'

const refs = {
  openModalBtn: document.querySelectorAll('[data-modal-open]'),
  closeModalBtn: document.querySelector('[data-modal-close]'),
  modal: document.querySelector('[data-modal]'),
  modalMarkupContainer: document.querySelector(".modal-card")
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
let moviesObj = {}

// Добавления слушателя на ссылку карточки
export function listenModalClick() {
  const film = document.querySelectorAll(".gallery__link")
  film.forEach(card => {
    card.addEventListener("click", onModalOpen)
  })
}

// Функция возвращает объект из localStorage, который заполняется в цикле в переменную moviesObj.
//  Объект получается в ввиде ключ(id фильма) - объект полной информации о фильме.
function getMovieDataObjectById() {
  const parsedSaveData = getArrMoviesFromLocalStorage();
  const movieById = parsedSaveData.results.forEach(movie => {
    moviesObj[movie.id] = movie;
  })
}

// По ключам из moviesObj находим выбранный фильм по id
function onModalOpen(event) {
  event.preventDefault()
  getMovieDataObjectById()
  const currentId = event.currentTarget.id;
 const movieData = moviesObj[currentId];
 renderModalMarkup(movieData)
}

function renderModalMarkup( { id, poster_path, original_title, genre_ids, vote_average, vote_count, popularity, title, overview }) {
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
            <td class="movie-card__rating card__item">${vote_average}</td>
            <td><span class="card__table-info">/&nbsp;<span>${vote_count}</td>
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
            <td class="card__item">${transformGenresList(
              genre_ids,
              Utils.genresName,
            )}</td>
            </tr>
            </table>
            <p class="card__about">ABOUT</p>
            <p class="card__description">${overview}</p>
              
            <div class="modal-buttons">
            <button class="" id="${id}">ADD TO WATCHED</button>
            <button class="" id="${id}">ADD TO QUEUE</button>
            </div>
            </div>
        </div>
        `;
    

  refs.modalMarkupContainer.innerHTML = markup;
}
