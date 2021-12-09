import { saveArrMoviesToLocalStorage, getArrMoviesFromLocalStorage } from "../index";
import API from "./api-func";
import Utils from "./utils";
import { pagination } from "../index";
import { settings } from "../index";
import { initPagination } from "./pagination";

import { listenModalClick, onGalleryModalOpen } from "../js/modal";

import Notiflix from 'notiflix';
Notiflix.Notify.init({
  width: '600px',
  height: '30px',
  position: 'center-top',
  distance: '190px',
  opacity: 1,
  timeout: 3000,
  //closeButton: true, //// если решим сделелать закрытие по кнопке
  useIcon: false, 
});

let requestFromUser = "";
// function-check of user input
function checkRequest(event) {
  event.preventDefault();
  requestFromUser = document.querySelector(".search-form_input").value;
  if (!requestFromUser) {
    Notiflix.Notify.warning("Введите название фильма для поиска, пожалуйста");
    return;
  }
  /// если ОК то делаем запрос
  onSearchFromUser(requestFromUser);
}
// function-search
async function onSearchFromUser(requestFromUser) {
  // чистим перед отрисовкой результатов поиска
  Utils.clearFoo();
  Utils.spinnerOn();
  try {
    const response = await API.getSerchFilmsFromUser(requestFromUser);
    if (!response.total_results) {
      Utils.spinnerOn();
      Notiflix.Notify.warning(
        "Извините, фильмов, соответствующих вашему поисковому запросу, нет. Пожалуйста, попробуйте еще раз.",
      );
      Utils.spinner();
      return;
    }
    Utils.spinner();
    const responseTotalResults = response.total_results; /// Кол-во найденных результатов
    Notiflix.Notify.success(`Мы нашли ${responseTotalResults} фильмов.`);
    saveArrMoviesToLocalStorage(response); // сохраняем в локал массив найденных фильмов
    Utils.renderMarkup(getArrMoviesFromLocalStorage()); /// Рисуем
    listenModalClick(onGalleryModalOpen);
    pagination.then((res) => {
      settings.requestFromUser = requestFromUser;
      settings.type = "search-films";
      res.reset(response.total_results);
      res.movePageTo(1);
    });
  } catch (error) {
    Notiflix.Notify.failure("что-то пошло не так", error);
    return;
  }
}
export default { requestFromUser, checkRequest, onSearchFromUser };
