import { saveArrMoviesToLocalStorage, getArrMoviesFromLocalStorage } from "../index";
import API from "./api-func";
import Utils from "./utils";
import { pagination } from "../index";
import { settings } from "../index";
import { initPagination } from "./pagination";
import { listenModalClick, onGalleryModalOpen } from "../js/modal";
import { hideGenresFilter } from "../js/genres-filter";
import Notiflix from "notiflix";
Notiflix.Notify.init({
  width: "280",
  position: "center-top",
  distance: "180px",
  opacity: 1,
  timeout: 3000,
  showOnlyTheLastOne: true,
  clickToClose: true,
  useIcon: false,
});
let requestFromUser = "";
// function-check of user input
function checkRequest(event) {
  event.preventDefault();
  requestFromUser = document.querySelector(".search-form_input").value.trim();
  if (!requestFromUser) {
    Notiflix.Notify.warning("Type the search request, please.");
    document.querySelector(".search-form_input").value = ""; // чистим поле ввода
    return;
  }
  /// если ОК то делаем запрос
  onSearchFromUser(requestFromUser);
}
// function-search
async function onSearchFromUser(requestFromUser) {
  settings.page = 1;
  // чистим перед отрисовкой результатов поиска
  Utils.clearFoo();
  document.querySelector(".search-form_input").value = ""; // чистим поле ввода
  Utils.spinnerOn();

  try {
    const response = await API.getSerchFilmsFromUser(requestFromUser);
    if (!response.total_results) {
      Utils.spinnerOn();
      Notiflix.Notify.warning("Sorry, no results for your search request. Please try again.");
      Utils.spinner();
      Utils.renderMarkup(getArrMoviesFromLocalStorage()); /// Рисуем
      listenModalClick(onGalleryModalOpen);
      return;
    }
    hideGenresFilter();
    Utils.spinner();
    saveArrMoviesToLocalStorage(response); // сохраняем в локал массив найденных фильмов
    Utils.renderMarkup(getArrMoviesFromLocalStorage()); /// Рисуем
    listenModalClick(onGalleryModalOpen);
    pagination.then((res) => {
      settings.requestFromUser = requestFromUser;
      settings.type = "search-films";
      res.reset(response.total_results);
    });
  } catch (error) {
    Notiflix.Notify.failure("Critical error", error);
    return;
  }
}
export default { requestFromUser, checkRequest, onSearchFromUser };
