import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let page = 1;
let textContent = '';

const ref = {
  form: document.querySelector('.search-form'),
  input: document.querySelector('input'),
  button: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  hideButton: document.querySelector('.load__more'),
  loader: document.getElementById('loading'),
};

// ref.hideButton.addEventListener('click', onLoadMore);
ref.form.addEventListener('submit', fetchAndRenderImg);

ref.loader.style.display = 'none';

async function fetchAndRenderImg(e) {
  e.preventDefault();
  textContent = e.currentTarget.searchQuery.value;
  clearData();
  if (textContent === '') {
    return Notify.warning(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
  try {
    const image = await fetchImg(textContent);
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
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    ref.loader.style.display = 'block';
  } catch (error) {
    console.log(error);
  }
}

async function fetchImg(content) {
  const searchParams = new URLSearchParams({
    key: '32614243-5c13f08404019c5c5c85a7837',
    q: content,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
    page: page,
  });
  const baseUrl = 'https://pixabay.com/api/?';

  return axios.get(`${baseUrl}${searchParams}`);
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
  page += 1;
  simpleLightBox.destroy();
  try {
    const image = await fetchImg(textContent);
    const data = await image.data.hits;
    const totalPages = (await image.data.totalHits) / 40;

    data.forEach(el => {
      renderImg(el);
    });
    const { height: cardHeight } =
      ref.gallery.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
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

function clearData() {
  ref.gallery.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', () => {
  let options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.25,
  };

  function handleIntersect(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        onLoadMore();
      }
    });
  }

  let observer = new IntersectionObserver(handleIntersect, options);
  observer.observe(ref.loader);
});
