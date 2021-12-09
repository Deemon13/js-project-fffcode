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

// function onButtonClick(event) {
//   if (event.target.nodeName !== "BUTTON") {
//     return;
//   }
//   if (event.target.dataset.action === "watched") {
//     const watchedMovies = renderWatched();
//     if (!watchedMovies) return;
//     pagination.then((res) => {
//       settings.type = "watched";
//       res.reset(watchedMovies.length);
//       res.movePageTo(1);
//     });
//   }

//   if (event.target.dataset.action === "queue") {
//     const queueMovies = renderQueue();
//     if (!queueMovies) return;
//     pagination.then((res) => {
//       settings.type = "queue";
//       res.reset(queueMovies.length);
//       res.movePageTo(1);
//     });
//   }
// }

function renderQueue() {
  const queueMovies = getToQueueMovieFromLocalStorage();

  if (!queueMovies) return;
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

  if (!watchedMovies) return;
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
