import icons from "/images/icons.svg";
export { icons };

import "./sass/main.scss";
import "animate.css";

import API from "./js/api-func";

import { refs } from "./js/refs";
import { createLibrary, createHome } from "./js/create-pages";
import { getGenresArray, transformGenresList } from "./js/genres";
import { listenModalClick, onGalleryModalOpen, modal } from "./js/modal";

import Utils from "./js/utils";
import SearchProps from "./js/search";
import { initPagination } from "./js/pagination";
import { renderQueue, renderWatched } from "./js/render-library";
import { logo } from "./js/ligo";
import scrollUp from "./js/scrollUp";
import { sortByGenres, showGenresFilter, hideGenresFilter } from "./js/genres-filter";

const settings = { page: 1, type: "popular-films", requestFromUser: "" };
export { settings };

let pagination = null;

// export const LOCALSTORAGE_ARR_MOVIES = "arr-current-movies";

API.getPopularFilms().then((results) => {
  Utils.spinner();
  const { page, total_results: totalResults } = results;
  getGenresArray(Utils.genresName);
  saveArrMoviesToLocalStorage(results); // сохраняем в локал массив найденных фильмов
  Utils.renderMarkup(getArrMoviesFromLocalStorage()); // рисуем
  listenModalClick(onGalleryModalOpen);
  pagination = initPagination({
    page,
    itemsPerPage: 20,
    totalItems: totalResults,
  });
});

// логика хедера
// при загрузке страницы добавляется динамически инпут
createHome();
sortByGenres();

refs.pageLibrary.addEventListener("click", onClickPageLibrary); //слушатель на кнопке библиотеки

function onClickPageLibrary() {
  // refs.pageHome.classList.add('page-home__color-ack');
  refs.pageHome.classList.remove("header__link_current");
  refs.pageLibrary.classList.add("header__link_current");
  // imgHero.srs = ''
  hideGenresFilter();
  createLibrary(); //рендер кнопок на странице библиотеки

  document.querySelector("[data-action='watched']").addEventListener("click", onClickBtnWatched);
  document.querySelector("[data-action='queue']").addEventListener("click", onClickBtnQueue);
  document.querySelector("[data-modal-close]").addEventListener("click", onCloseModal); // выполняется при закрытии модалки на странице библиотеки
  document.querySelector("[data-action='queue']").classList.toggle("activeBtnEl");

  refs.pageHome.addEventListener("click", onClickPageHome);
  const queueMovies = renderQueue();

  if (!queueMovies) {
    document.querySelector(".tui-pagination").classList.add("is-hidden");
    pagination.then((res) => {
      settings.type = "queue";
      res.reset(0);
      res.movePageTo(1);
    });
    return;
  }
  document.querySelector(".tui-pagination").classList.remove("is-hidden");
  pagination.then((res) => {
    settings.type = "queue";
    res.reset(queueMovies.length);
    res.movePageTo(1);
  });
}
// refs.pageHome.classList.add('page-home__color-ack');
export async function onClickPageHome() {
  refs.pageLibrary.classList.remove("header__link_current");
  refs.pageHome.classList.add("header__link_current");

  createHome(); //рендер кнопок на главной странице
  showGenresFilter();
  getGenresArray(Utils.genresName);
  const response = await API.getPopularFilms();
  getGenresArray(Utils.genresName);
  Utils.clearFoo();
  saveArrMoviesToLocalStorage(response);
  Utils.renderMarkup(getArrMoviesFromLocalStorage());
  listenModalClick(onGalleryModalOpen);
  document.querySelector(".tui-pagination").classList.remove("is-hidden");

  refs.pageLibrary.addEventListener("click", onClickPageLibrary);
  refs.pageHome.removeEventListener("click", onClickPageHome);
  pagination.then((res) => {
    settings.type = "popular-films";
    res.reset(response.total_results);
    /* res.movePageTo(1); */
  });

  document.querySelector("[data-modal-close]").removeEventListener("click", onCloseModal);
}
const logoHome = document.querySelector(".header__logo");
logoHome.addEventListener("click", onClickPageHome);

///////////////////////////////////////////////////////////
function onCloseModal() {
  // при закрытии модалки
  if (document.querySelector("[data-action='watched']").classList.contains("activeBtnEl")) {
    //если активна кнопка watched
    renderWatched();
  } else {
    // по умолчанию рендер queue
    renderQueue();
  }
}
// при нажатии на одну кнопку, на нее вешается класс activeBtnEl, при этом на другой кнопке этот класс удаляется
function onClickBtnWatched() {
  document.querySelector("[data-action='watched']").classList.add("activeBtnEl");
  document.querySelector("[data-action='queue']").classList.remove("activeBtnEl");

  const watchedMovies = renderWatched();

  if (!watchedMovies) {
    document.querySelector(".tui-pagination").classList.add("is-hidden");
    return;
  }
  document.querySelector(".tui-pagination").classList.remove("is-hidden");
  pagination.then((res) => {
    settings.type = "watched";
    res.reset(watchedMovies.length);
    res.movePageTo(1);
  });
}
function onClickBtnQueue() {
  document.querySelector("[data-action='queue']").classList.add("activeBtnEl");
  document.querySelector("[data-action='watched']").classList.remove("activeBtnEl");

  const queueMovies = renderQueue();

  if (!queueMovies) {
    document.querySelector(".tui-pagination").classList.add("is-hidden");
    return;
  }
  document.querySelector(".tui-pagination").classList.remove("is-hidden");
  pagination.then((res) => {
    settings.type = "queue";
    res.reset(queueMovies.length);
    res.movePageTo(1);
  });
}
/// Реализация поиска кинофильма по ключевому слову (на главной странице)

document.querySelector(".search-form").addEventListener("submit", SearchProps.checkRequest);

/////////////////////////////////////////////////

export { pagination };
export function saveArrMoviesToLocalStorage(arrMovies) {
  localStorage.setItem("arr-current-movies", JSON.stringify(arrMovies)); // сохраняем в локал данные про фильмы
}
export function getArrMoviesFromLocalStorage() {
  const savedArrMovies = localStorage.getItem("arr-current-movies");
  return JSON.parse(savedArrMovies); // получаем данные про фильмы с локала
}
