export function createMarkup(photos) {
  return photos
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card gallery__item"><a class="gallery__link" href='${largeImageURL}'>
    <img class="gallery__image" src="${webformatURL}" alt="${tags}" height="250" width="100%" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
      ${downloads}
        </p>
    </div>
    </div>
  `;
      }
    )
    .join('');
}
