import {
  getWatchedMovieFromLocalStorage,
  getToQueueMovieFromLocalStorage,
  listenModalClick,
  onWatchedModalOpen,
  onQueueModalOpen,
} from "./modal";
import Utils from "./utils";
import { pagination, settings } from "../index";
import { createLibraryPlug } from "./library-plug";
import { refs } from "./refs";

function renderQueue() {
  const queueMovies = getToQueueMovieFromLocalStorage();

  if (!queueMovies) {
    document.querySelector(".plug-message").textContent =
      "Add movies to the queue so you don't forget to watch them later!";
    return;
  }
  const queueMoviesFiltered = queueMovies.filter(
    (item, index) => index < 20 * settings.page && index >= 20 * (settings.page - 1),
  );
  const objectForRenderQueueMovies = { results: queueMoviesFiltered };
  if (queueMovies.length === 0) {
    createLibraryPlug();
    document.querySelector(".plug-message").textContent =
      "Add movies to the queue so you don't forget to watch them later!";
    return;
  }

  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderQueueMovies);

  listenModalClick(onQueueModalOpen);
  return queueMovies;
}

function renderWatched() {
  const watchedMovies = getWatchedMovieFromLocalStorage();

  if (!watchedMovies) {
    document.querySelector(".plug-message").textContent = "Add movies you have already watched.";
    return;
  }
  const watchedMoviesFiltered = watchedMovies.filter(
    (item, index) => index < 20 * settings.page && index >= 20 * (settings.page - 1),
  );

  const objectForRenderWatchedMovies = { results: watchedMoviesFiltered };
  if (watchedMovies.length === 0) {
    createLibraryPlug();
    document.querySelector(".plug-message").textContent = "Add movies you have already watched.";
    return;
  }

  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderWatchedMovies);

  listenModalClick(onWatchedModalOpen);
  return watchedMovies;
}

export { renderQueue, renderWatched };
