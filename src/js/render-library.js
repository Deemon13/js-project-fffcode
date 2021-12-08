import { getWatchedMovieFromLocalStorage, getToQueueMovieFromLocalStorage } from "./modal";
import Utils from "./utils";
import { pagination, settings } from "../index";

function onButtonClick(event) {
  if (event.target.nodeName !== "BUTTON") {
    return;
  }
  if (event.target.dataset.action === "watched") {
    const watchedMovies = renderWatched();
    if (!watchedMovies) return;
    pagination.then((res) => {
      settings.type = "watched";
      res.reset(watchedMovies.length);
      res.movePageTo(1);
    });
  }

  if (event.target.dataset.action === "queue") {
    const queueMovies = renderQueue();
    if (!queueMovies) return;
    pagination.then((res) => {
      settings.type = "queue";
      res.reset(queueMovies.length);
      res.movePageTo(1);
    });
  }
}

function renderQueue() {
  const queueMovies = getToQueueMovieFromLocalStorage();
  if (!queueMovies) return;
  const queueMoviesFiltered = queueMovies.filter(
    (item, index) => index < 20 * settings.page && index >= 20 * (settings.page - 1),
  );
  const objectForRenderQueueMovies = { results: queueMoviesFiltered };
  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderQueueMovies);
  return queueMovies;
}

function renderWatched() {
  const watchedMovies = getWatchedMovieFromLocalStorage();
  if (!watchedMovies) return;
  const watchedMoviesFiltered = watchedMovies.filter(
    (item, index) => index < 20 * settings.page && index >= 20 * (settings.page - 1),
  );

  const objectForRenderWatchedMovies = { results: watchedMoviesFiltered };
  Utils.clearFoo();
  Utils.renderMarkup(objectForRenderWatchedMovies);
  return watchedMovies;
}

export { onButtonClick, renderQueue, renderWatched };
