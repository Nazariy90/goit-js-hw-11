import Notiflix from 'notiflix';
import { UnsplashApi } from './backend-foo';

const searchFormEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const unsplashApi = new UnsplashApi();
const per_page = 40;

const onSearchFormSubmit = async event => {
  event.preventDefault();

  const { target: formEl } = event;

  unsplashApi.query = formEl.elements.searchQuery.value;
  unsplashApi.page = 1;
  unsplashApi.per_page = per_page;

  try {
    const { data } = await unsplashApi.fetchPhotosByQuery();

    console.log(data);

    if (data.total === 0) {
      galleryEl.innerHTML = '';
      loadBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (data.totalHits <= per_page) {
      galleryEl.innerHTML = itemListFoo(data);
      return;
    } else {
      galleryEl.innerHTML = itemListFoo(data);
      loadBtn.classList.remove('is-hidden');
    }
  } catch (err) {
    console.log(err);
  }
};

function itemListFoo(arr) {
  return arr.hits
    .map(item => {
      return `<div class="photo-card">
  <img
    src="${item.webformatURL}"
    alt="${item.tags}"
    loading="lazy"
    width="250px"
  />
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
}

const onLoadBtn = async event => {
  try {
    unsplashApi.page += 1;

    const response = await unsplashApi.fetchPhotosByQuery();
    const { data } = response;
    galleryEl.insertAdjacentHTML('beforeend', itemListFoo(data));

    if (unsplashApi.page * per_page >= data.totalHits) {
      loadBtn.classList.add('is-hidden');
      Notiflix.Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadBtn.addEventListener('click', onLoadBtn);
