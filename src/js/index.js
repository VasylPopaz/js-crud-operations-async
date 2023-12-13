import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getBreeds, getPhotos, getPhotosAxios } from './api';
import { createMarkup } from './create-markup';

const searchForm = document.querySelector('.js-search-form');
const gallery = document.querySelector('.gallery');
const targetElem = document.querySelector('.js-target');
let lightbox = {};
let page = 1;
let totalPages = 0;
let query = '';

let observer = new IntersectionObserver(loadMore, {
  // rootMargin: '800px',
  rootMargin: '470px',
  threshold: 1.0,
});

searchForm.addEventListener('submit', handleSubmit);

async function handleSubmit(event) {
  event.preventDefault();
  observer.unobserve(targetElem);
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
    totalPages = Math.ceil(photos.totalHits / 40);
    const markup = createMarkup(photos.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox = new SimpleLightbox('.gallery a');
    observer.observe(targetElem);
    changeStatusObserver();
  } catch (error) {
    Notify.failure('Sorry, something wrong. Please try again.');
    console.log(error.name);
    console.log(error.message);
  }
}

async function loadMore(entries) {
  changeStatusObserver();

  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        page += 1;
        const photos = await getPhotos(query, page);
        const markup = createMarkup(photos.hits);
        gallery.insertAdjacentHTML('beforeend', markup);
        lightbox.refresh();

        const viewportHeight = window.innerHeight;
        setTimeout(() => {
          window.scrollBy({
            top: viewportHeight,
            behavior: 'smooth',
          });
        }, 500);
      } catch (error) {
        Notify.failure('Sorry, something wrong. Please try again.');
        console.log(error.name);
        console.log(error.message);
      }
    }
  });
}

function changeStatusObserver() {
  if (page === totalPages) {
    observer.unobserve(targetElem);
    Notify.info(`We're sorry, but you've reached the end of search results.`);
  }
}

function hideElement(elem) {
  elem.classList.add('is-hidden');
}
function showElement(elem) {
  elem.classList.remove('is-hidden');
}
