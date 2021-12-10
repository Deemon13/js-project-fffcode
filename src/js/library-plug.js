import { refs } from './refs'

export function createLibraryPlug() {
     refs.filmsContainerRef.innerHTML =
       `<div class="library-plug">
        <div class="plug-pic"></div>
        <p class="plug-message">Add movies to the queue so you don't forget to watch them later!</p>
      </div>`
}