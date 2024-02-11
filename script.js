const accessToken = '0a9a4fe955e6306f70e3d7b739db49d8';
const videosIds = [824804225, 824804225, 824804225, 824804225, 824804225, 824804225, 824804225, 824804225];
const pageSwiperEl = document.querySelector('.page-swiper');
const pageSwiperWrapper = document.querySelector('.page-swiper__wrapper');
const btnPrev = document.querySelector('.page-swiper__button--prev');
const btnNext = document.querySelector('.page-swiper__button--next');
const loader = document.querySelector('.loader');
const modalBody = document.querySelector('.modal__body');
const modalClose = document.querySelector('.modal__close');
const modalWrapper = document.querySelector('.modal__wrapper');
const pagination = document.querySelector('.pagination');

const pageSwiper = new Swiper(pageSwiperEl, {
  slidesPerView: 4,
  spaceBetween: 20,
  navigation: {
    nextEl: btnNext,
    prevEl: btnPrev,
  },
});

Promise.allSettled(videosIds.map(videoId => {
  return fetch(`https://api.vimeo.com/videos/${videoId}`, {
    method: 'GET',
    headers: {
      'Authorization': `bearer ${accessToken}`,
    }
  })
    .then(response => response.json());
}))
  .then(responses => responses.filter(response => response.status === "fulfilled"))
  .then(responses => responses.map(response => response.value))
  .then(responses => responses.forEach((data) => {
    console.log(data);
    const divPreview = document.createElement('div');
    const img = document.createElement('img');
    const bullet = document.createElement('div');

    divPreview.classList.add('swiper-slide');
    divPreview.append(img);

    img.src = data.pictures.sizes[3].link;
    img.alt = "Slider image";

    bullet.classList.add('pagination__bullet');

    pageSwiperWrapper.append(divPreview);
    pagination.append(bullet);

    bindModal(divPreview, modalWrapper, modalClose, data);
    bindModal(bullet, modalWrapper, modalClose, data);
  }))
  .then(() => {
    pageSwiperEl.style.display = "flex";
    btnNext.style.display = "flex";
    btnPrev.style.display = "flex";
  })
  .finally(() => {
    loader.style.display = "none";
  });

function bindModal(trigger, modal, close, data) {
  const body = document.body

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    modalBody.innerHTML = data.embed.html.replace('autopause=0', 'autoplay=1');

    const loader = document.createElement('div');
    loader.classList.add('loader');
    modalBody.append(loader);

    const iframe = modalBody.querySelector('iframe');
    iframe.allow = "autoplay; fullscreen; picture-in-picture";

    iframe.onload = () => {
      loader.style.display = 'none';
      iframe.style.display = 'block';
    };

    modal.style.display = 'flex';
    body.classList.add('locked');
  });

  close.addEventListener('click', () => {
    modal.style.display = 'none';
    modalBody.innerHTML = '';
    body.classList.remove('locked');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      body.classList.remove('locked');
    }
  })
}
