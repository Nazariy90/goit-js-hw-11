import { Notify } from 'notiflix';
import { UnsplashApi } from './backend-foo';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const unsplashApi = new UnsplashApi();
const per_page = 40;
let simpleLightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

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
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (data.totalHits <= per_page) {
      galleryEl.innerHTML = itemListFoo(data);
      simpleLightBox.refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return;
    } else {
      galleryEl.innerHTML = itemListFoo(data);
      simpleLightBox.refresh();
      loadBtn.classList.remove('is-hidden');
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
  } catch (err) {
    console.log(err);
  }
};

function itemListFoo(arr) {
  return arr.hits
    .map(item => {
      return `<div class="photo-card">
      <a class="photo-link" href="${item.largeImageURL}">
  <img class = "photo-item"
    src="${item.webformatURL}"
    alt="${item.tags}"
    loading="lazy"/>
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${item.downloads}
    </p>
  </div>
</div>`;
    })
    .join('');
}

const scrollToNextGroup = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  const scrollDistance = cardHeight * 2;
  window.scrollBy({
    top: scrollDistance,
    behavior: 'smooth',
  });
};

const onLoadBtn = async event => {
  try {
    unsplashApi.page += 1;

    const response = await unsplashApi.fetchPhotosByQuery();
    const { data } = response;
    galleryEl.insertAdjacentHTML('beforeend', itemListFoo(data));
    simpleLightBox.refresh();
    if (unsplashApi.page * per_page >= data.totalHits) {
      loadBtn.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
    scrollToNextGroup();
  } catch (err) {
    console.log(err);
  }
};

searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadBtn.addEventListener('click', onLoadBtn);
