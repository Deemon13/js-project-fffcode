import { refs } from "./refs"
export function createLibrary() {
    refs.filmsContainerRef.innerHTML = "Это библиотека!"
    refs.headerButtons.innerHTML = `
        <button type="button">Watched</button>
        <button type="button">queue</button>`
}