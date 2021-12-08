import { refs } from './refs';
import { transformGenresList } from './genres';

// function for render mark-up gallery

let genresName = {};
let preloaderEl = document.getElementById('preloader');

function renderMarkup({ results }) {
  const markup = results
    .map(({ id, poster_path, original_title, genre_ids, vote_average, title, release_date }) => {
      return `
      <li class="gallery__item">
          <a class="gallery__link" href="" id="${id}">
                <div class="movie-card">
                ${
                  poster_path
                    ? `<img src="https://image.tmdb.org/t/p/w342${poster_path}"`
                    : `<img src="https://avatarko.ru/img/kartinka/33/multfilm_lyagushka_32117.jpg"`
                }

                        class="movie-card__poster"width="305"
                        height="205"
                        alt="${title}"
                        loading="lazy"
                    />
                    <h2 class="movie-card__title"> ${original_title}</h2>
                    <div class="movie-card__info">
                        <p class="movie-card__genres"> ${transformGenresList(
                          genre_ids,
                          genresName,
                        )}</p>
                        <p class="movie-card__year"> &nbsp;|&nbsp; ${release_date?.slice(0, 4)}</p>

                        <span class="movie-card__rating"> ${vote_average}</span>
                    </div>
                </div>
          </a>
    </li> `;
    })
    .join('');

  refs.filmsContainerRef.insertAdjacentHTML('beforeend', markup);
}

// Функция для очистки экрана перед отрисовкой

function clearFoo() {
  refs.filmsContainerRef.innerHTML = '';
}

function spinner() {
  preloaderEl.classList.add('hidden');
  preloaderEl.classList.remove('visible');
}

function spinnerOn() {
  preloaderEl.classList.add('visible');
  preloaderEl.classList.remove('hidden');
}

export default { genresName, renderMarkup, clearFoo, spinner, spinnerOn };
