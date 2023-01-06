export function renderImg(images, ref, data) {
  const markup = data.map(() => {
    return `<div class="photo-card">
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
  });

  ref.gallery.insertAdjacentHTML('beforeend', markup);
}
