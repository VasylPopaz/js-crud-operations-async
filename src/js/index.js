import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getPhotos } from './api';
import { createMarkup } from './create-markup';

const searchForm = document.querySelector('.js-search-form');
const gallery = document.querySelector('.gallery');

let lightbox = new SimpleLightbox('.gallery a');
let page = 1;
let query = '';
let observer = new IntersectionObserver(loadMore, {
  root: null,
  rootMargin: '470px',
  threshold: 1.0,
});

searchForm.addEventListener('submit', handleSubmit);

function loadMore(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      observer.unobserve(entry.target);
      page += 1;

      try {
        const photos = await getPhotos(query, page);
        const markup = createMarkup(photos.hits);
        gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();
        checkMorePhotos(photos.totalHits);

        const viewportHeight = window.innerHeight;
        setTimeout(() => {
          window.scrollBy({
            top: viewportHeight,
            behavior: 'smooth',
          });
        }, 500);
      } catch (error) {
        Notify.failure('Sorry, something went wrong. Please try again.');
        console.log(error.name);
        console.log(error.message);
      }
    }
  });
}

async function handleSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  query = event.target.searchQuery.value;

  try {
    const photos = await getPhotos(query, page);
    if (!photos.hits.length)
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );

    Notify.success(`Hurray! We found ${photos.totalHits} images.`);
    const markup = createMarkup(photos.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    checkMorePhotos(photos.totalHits);
  } catch (error) {
    Notify.failure('Sorry, something went wrong. Please try again.');
    console.log(error.name);
    console.log(error.message);
  }
}

function checkMorePhotos(total) {
  if (page < Math.ceil(total / 40)) {
    const item = document.querySelector('.gallery__item:last-child');
    observer.observe(item);
  } else {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
}
