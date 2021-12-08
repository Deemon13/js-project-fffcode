import { refs } from './refs'

export function createLibraryPlug() {
     refs.filmsContainerRef.innerHTML =
       `<div class="library-plug">
        <div class="plug-pic"></div>
        <p class="plug-message"></p>
      </div>`
}