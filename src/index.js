import "./sass/main.scss";

import API from "./js/api-func";

import { refs } from "./js/refs";
import { createLibrary } from "./js/create-pages";
import { createHome } from "./js/create-pages";
import { getGenresArray, transformGenresList } from "./js/genres";
import { modal } from "./js/modal";

import Utils from "./js/utils";
import SearchProps from "./js/search";
import { initPagination } from "./js/pagination";

const settings = { page: 1, type: "popular-films" };
export { settings };

let pagination = null;

API.getPopularFilms().then((results) => {
  const { page, total_results: totalResults } = results;
  getGenresArray(Utils.genresName);
  Utils.renderMarkup(results);
  pagination = initPagination({
    page,
    itemsPerPage: 20,
    totalItems: totalResults,
  });
});

// логика хедера
// при загрузке страницы добавляется динамически инпут
createHome();

refs.pageLibrary.addEventListener("click", onClickPageLibrary); //слушатель на кнопке библиотеки

function onClickPageLibrary() {
  createLibrary(); //рендер кнопок на странице библиотеки
  refs.pageLibrary.removeEventListener("click", onClickPageLibrary);
  refs.pageHome.addEventListener("click", onClickPageHome);
}
function onClickPageHome() {
  createHome(); //рендер кнопок на главной странице
  API.getPopularFilms().then((results) => {
    getGenresArray(Utils.genresName);
    Utils.renderMarkup(results);
  }); // рендер фильмов
  refs.pageLibrary.addEventListener("click", onClickPageLibrary);
  refs.pageHome.removeEventListener("click", onClickPageHome);
}

///////////////////////////////////////////////////////////
/// Реализация поиска кинофильма по ключевому слову (на главной странице)

document.querySelector(".search-form").addEventListener("submit", SearchProps.checkRequest);

/////////////////////////////////////////////////

export { pagination };
