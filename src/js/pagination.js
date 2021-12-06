import Pagination from "tui-pagination";
import "tui-pagination/dist/tui-pagination.css";
import API from "./api-func";
import Utils from "./utils";
import { getGenresArray } from "./genres";
import { settings } from "../index";
import { saveArrMoviesToLocalStorage, getArrMoviesFromLocalStorage } from "../index";
import { listenModalClick } from "../js/modal";

async function initPagination({ page, itemsPerPage, totalItems }) {
  const options = {
    totalItems,
    itemsPerPage,
    visiblePages: 5,
    page,
    usageStatistics: false,
    centerAlign: true,
    firstItemClassName: "tui-first-child",
    lastItemClassName: "tui-last-child",
    template: {
      page: '<a href="#" class="tui-page-btn">{{page}}</a>',
      currentPage: '<strong class="tui-page-btn tui-is-selected">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        "</a>",
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}}">' +
        '<span class="tui-ico-{{type}}">{{type}}</span>' +
        "</span>",
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip">' +
        '<span class="tui-ico-ellip">...</span>' +
        "</a>",
    },
  };

  const pagination = await new Pagination("pagination", options);
  pagination.on("afterMove", ({ page }) => {
    settings.page = page;
    if (settings.type === "popular-films") {
      API.getPopularFilms().then((results) => {
        getGenresArray(Utils.genresName);
        Utils.clearFoo();
        saveArrMoviesToLocalStorage(results); 
        Utils.renderMarkup(getArrMoviesFromLocalStorage()); 
        listenModalClick();
      });
    }
    if (settings.type === "search-films") {
      API.getSerchFilmsFromUser(settings.requestFromUser).then((results) => {
        getGenresArray(Utils.genresName);
        Utils.clearFoo();
        saveArrMoviesToLocalStorage(results); 
        Utils.renderMarkup(getArrMoviesFromLocalStorage()); 
        listenModalClick();
          });
    }
  });

  return pagination;
}

export { initPagination };
