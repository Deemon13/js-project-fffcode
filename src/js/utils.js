import { refs } from './refs';
import { transformGenresList } from './genres';

// function for render mark-up gallery

let genresName = {};

function renderMarkup({ results }) {
  const markup = results
    .map(({ poster_path, original_title, genre_ids, vote_average, title, release_date }) => {
      return `
    <a class="gallery__link" href="">
        <div class="movie-card">
            <img src="https://image.tmdb.org/t/p/w342${poster_path}"
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
                )}|&nbsp;</p>
                <p class="movie-card__year"> ${release_date.slice(0, 4)}</p>
                <span class="movie-card__rating"> ${vote_average}</span>
            </div>
        </div>
    </a>
        `;
    })
    .join('');

  refs.filmsContainerRef.insertAdjacentHTML('beforeend', markup);
}

// Функция для очистки экрана перед отрисовкой

function clearFoo() {
  refs.filmsContainerRef.innerHTML = '';
}

export default { genresName, renderMarkup, clearFoo };
