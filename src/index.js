// import axios from 'axios';
import Notiflix from 'notiflix';
import { UnsplashApi } from './backend-foo';

const searchFormEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const unsplashApi = new UnsplashApi();

// console.log(unsplashApi);

const onSearchFormSubmit = event => {
  event.preventDefault();
  const { target: formEl } = event;
  unsplashApi.query = formEl.elements.searchQuery.value;

  unsplashApi
    .fetchPhotosByQuery()
    .then(data => {
      if (data.hits.length === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        itemListFoo(data);
        loadBtn.classList.remove('is-hidden');
      }
    })
    .catch(err => {
      //   console.log(err);
    });
};

function itemListFoo(arr) {
  const markup = arr.hits
    .map(item => {
      return `<div class="photo-card">
  <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" wight 200px/>
  <div class="info">
    <p class="info-item">
      <b>Likes ${item.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${item.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${item.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${item.downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  galleryEl.innerHTML = markup;
}

const onLoadBtn = event => {
  unsplashApi.page += 1;

  unsplashApi
    .fetchPhotosByQuery()
    .then(data => {
      galleryEl.insertAdjacentHTML('beforeend', itemListFoo(data));
    })
    .catch(err => {
      console.log(err);
    });
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadBtn.addEventListener('click', onLoadBtn);
