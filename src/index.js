import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchImg } from './js/fetch';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let textContent = '';

const galleryBox = new SimpleLightbox('.gallery a');
const ref = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  hideButton: document.querySelector('.load__more'),
  loader: document.getElementById('loading'),
};

ref.form.addEventListener('submit', fetchAndRenderImg);
ref.loader.style.display = 'none';

async function fetchAndRenderImg(e) {
  console.log('🚀 ~ fetchAndRenderImg');
  e.preventDefault();
  textContent = e.currentTarget.searchQuery.value;
  clearData();
  if (textContent === '') {
    clearData();
    return Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  try {
    const image = await fetchImg(textContent, page);
    const data = await image.data.hits;

    if (data.length === 0) {
      return Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notify.success(`Hooray! We found ${image.data.totalHits} images.`);
    }
    data.forEach(el => {
      renderImg(el);
    });
    galleryBox.refresh();
    ref.loader.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

function renderImg(images) {
  const markup = `<div class="photo-card">
      <a href="${images.largeImageURL}">
        <img src="${images.webformatURL}" alt="${images.tags}" loading="lazy" />
      </a>
    <div class="info">
      <p class="info-item">
        <b>Likes:</b>
        ${images.likes}
      </p>
      <p class="info-item">
        <b>Views: </b>
        ${images.views}
      </p>
      <p class="info-item">
        <b>Comments: </b>
        ${images.comments}
      </p>
      <p class="info-item">
        <b>Downloads: </b>
        ${images.downloads}
      </p>
    </div>
  </div>`;

  ref.gallery.insertAdjacentHTML('beforeend', markup);
}

async function onLoadMore() {
  console.log('🚀 ~ onLoadMore');
  page += 1;

  if (textContent === '') {
    ref.loader.style.display = 'none';
    return clearData();
  }
  try {
    const image = await fetchImg(textContent);
    const data = await image.data.hits;
    const totalPages = (await image.data.totalHits) / 40;

    data.forEach(el => {
      renderImg(el);
    });
    smoothScroll();
    galleryBox.refresh();

    if (page > totalPages) {
      ref.loader.style.display = 'none';
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.log(error);
  }
}

function smoothScroll() {
  const { height: cardHeight } =
    ref.gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function clearData() {
  ref.gallery.innerHTML = '';
}

const observer = new IntersectionObserver(
  callbackObserver,
  getOptionObserver()
);
function getOptionObserver() {
  return {
    root: null,
    rootMargin: '0px',
    threshold: 0.25,
  };
}
function callbackObserver(entries, observer) {
  console.log('🚀 ~ callbackObserver');
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      onLoadMore();
    }
  });
}
observer.observe(ref.loader);
