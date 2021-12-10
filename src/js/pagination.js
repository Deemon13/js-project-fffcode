import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import API from './api-func';
import Utils from './utils';
import { getGenresArray } from './genres';
import { settings } from '../index';
import { saveArrMoviesToLocalStorage, getArrMoviesFromLocalStorage } from '../index';

import { listenModalClick, onGalleryModalOpen } from '../js/modal';
import { onButtonClick, renderQueue, renderWatched } from './render-library';

async function initPagination({ page, itemsPerPage, totalItems }) {
  const options = {
    totalItems,
    itemsPerPage,
    visiblePages: 5,
    page,
    usageStatistics: false,
    centerAlign: true,
    firstItemClassName: 'tui-first-child',
    lastItemClassName: 'tui-last-child',
    template: {
      page: '<a href="#" class="tui-page-btn" style="color:#000000;  border:1px solid transparent; border-radius:5px; width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;">{{page}}</a>',
      currentPage:
        '<strong class="tui-page-btn  tui-is-selected" style="background-color: #ff6b01; border:1px solid transparent;border-radius: 5px; font-size: 12px; width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;">{{page}}</strong>',
      moveButton:
        '<a href="#" class="tui-page-btn tui-{{type}}" custom-class-{{type}} style="background-color:FF6B08; border-radius:5px; border:none;width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;">' +
        '<span class="tui-ico-{{type}}">{{type}} style="background-color:FF6B08; border:none"</span>' +
        '</a>',
      disabledMoveButton:
        '<span class="tui-page-btn tui-is-disabled tui-{{type}} custom-class-{{type}}" style="background-color:FF6B08; border:1px solid transparent; border-radius:5px; width:30px; height:30px;display:inline-flex; align-items:center; justify-content:center;">' +
        '<span class="tui-ico-{{type}}">{{type}} style="border:none;"</span>' +
        '</span>',
      moreButton:
        '<a href="#" class="tui-page-btn tui-{{type}}-is-ellip custom-class-{{type}}" style="background-color:FF6B08; border-radius:5px; border:none;width:30px; height:30px; display:inline-flex; align-items:center; justify-content:center;">' +
        '<span class="tui-ico-ellip">...</span>' +
        '</a>',
    },
  };

  const pagination = await new Pagination('pagination', options);
  pagination.on('afterMove', ({ page }) => {
    settings.page = page;
    if (settings.type === 'popular-films') {
      API.getPopularFilms().then(results => {
        getGenresArray(Utils.genresName);
        Utils.clearFoo();
        saveArrMoviesToLocalStorage(results);
        Utils.renderMarkup(getArrMoviesFromLocalStorage());
        listenModalClick(onGalleryModalOpen);
      });
    }
    if (settings.type === 'search-films') {
      API.getSerchFilmsFromUser(settings.requestFromUser).then(results => {
        getGenresArray(Utils.genresName);
        Utils.clearFoo();
        saveArrMoviesToLocalStorage(results);
        Utils.renderMarkup(getArrMoviesFromLocalStorage());
        listenModalClick(onGalleryModalOpen);
      });
    }
    if (settings.type === 'watched') {
      renderWatched();
    }

    if (settings.type === 'queue') {
      renderQueue();
    }

    if (settings.type === 'films-by-genre') {
      API.getFilmsByGenresFilter(settings.movieGenreId).then(results => {
        getGenresArray(Utils.genresName);
        Utils.clearFoo();
        saveArrMoviesToLocalStorage(results);
        Utils.renderMarkup(getArrMoviesFromLocalStorage());
        listenModalClick(onGalleryModalOpen);
      });
    }
  });

  return pagination;
}

export { initPagination };
