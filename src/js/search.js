import getSerchFilmsFromUser from '../index';
import Utils from './utils';

let requestFromUser = '';

// function-check of user input

function checkRequest(event) {
  event.preventDefault();
  requestFromUser = document.querySelector('.search-form_input').value;
  if (!requestFromUser) {
    console.log('Введите название фильма для поиска, пожалуйста');
    return;
  }
  /// если ОК то делаем запрос
  onSearchFromUser(requestFromUser);
}

// function-search

async function onSearchFromUser(requestFromUser) {
  // чистим перед отрисовкой результатов поиска
  Utils.clearFoo();

  try {
    const response = await getSerchFilmsFromUser(requestFromUser);
    if (!response.total_results) {
      console.log(
        'Извините, фильмов, соответствующих вашему поисковому запросу, нет. Пожалуйста, попробуйте еще раз.',
      );
      return;
    }

    const responseTotalResults = response.total_results; /// Кол-во найденных результатов

    console.log(`We found ${responseTotalResults} movies.`);
    Utils.renderMarkup(response); /// Рисуем
  } catch (error) {
    console.log('что-то пошло не так');
    return;
  }
}

export default { requestFromUser, checkRequest, onSearchFromUser };
