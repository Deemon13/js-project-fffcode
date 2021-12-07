import { getWatchedMovieFromLocalStorage, getToQueueMovieFromLocalStorage, listenModalClick, onWatchedModalOpen, onQueueModalOpen } from "./modal";
/* import { refs } from "./refs"; */
import Utils from './utils';
import {pagination, settings} from '../index';
import { createLibraryPlug } from './library-plug';
import { refs } from './refs';

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
  if(queueMovies.length === 0) {
    createLibraryPlug();
    document.querySelector(".plug-message").textContent = "Add movies to the queue so you don't forget to watch them later!"
    return;
  }
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
   if(watchedMovies.length === 0) {
    createLibraryPlug();
    document.querySelector(".plug-message").textContent = "Add movies you have already watched."
    return;
  }
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

