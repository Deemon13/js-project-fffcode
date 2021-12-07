import { getWatchedMovieFromLocalStorage, getToQueueMovieFromLocalStorage, listenModalClick, onWatchedModalOpen, onQueueModalOpen } from "./modal";
/* import { refs } from "./refs"; */
import Utils from "./utils";
import {pagination, settings} from "../index";

function onButtonClick(event) {
  if (event.target.nodeName !== "BUTTON") {
    return;
  }
  if (event.target.dataset.action === "watched") {
    renderWatched();

  }

  if (event.target.dataset.action === "queue") {
    renderQueue();
    
  }
}

function renderQueue() {
  const queueMovies = getToQueueMovieFromLocalStorage();
  const objectForRenderQueueMovies = { results: queueMovies };
  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderQueueMovies);
  listenModalClick(onQueueModalOpen);
  pagination.then(res => {
    settings.type = 'queue';
    res.reset(queueMovies.length);
    /* res.movePageTo(1); */
  });
}

function renderWatched() {
  const watchedMovies = getWatchedMovieFromLocalStorage();
  const objectForRenderWatchedMovies = { results: watchedMovies };
  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderWatchedMovies);
  listenModalClick(onWatchedModalOpen);
  pagination.then(res => {
    settings.type = 'watched';
    res.reset(watchedMovies.length);
    /* res.movePageTo(1); */
  });



}

export { onButtonClick,  renderQueue, renderWatched};

