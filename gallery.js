'use strict';

(() => {
  const photos = window.travelPhotos || [];
  const gallery = document.querySelector('#photo-grid');
  const dateFilter = document.querySelector('#photo-date');
  const cityFilter = document.querySelector('#photo-city');
  const resultLabel = document.querySelector('#photo-results');
  const moreButton = document.querySelector('#photo-more');
  const dialog = document.querySelector('#photo-dialog');
  const viewer = document.querySelector('#photo-viewer');
  const caption = document.querySelector('#photo-caption');
  const previousButton = document.querySelector('#photo-previous');
  const nextButton = document.querySelector('#photo-next');
  let visibleCount = 18;
  let filtered = photos;
  let viewerPhotos = photos;
  let activeIndex = 0;
  let opener;

  function dateLabel(date) {
    const parts = date.split('-');
    return `${Number(parts[1])}/${Number(parts[2])}`;
  }

  function addOptions(select, values) {
    values.forEach(value => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = select === dateFilter ? dateLabel(value) : value;
      select.append(option);
    });
  }

  function photoButton(photo) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'photo-card';
    button.setAttribute('aria-label', `${dateLabel(photo.date)} ${photo.caption} 크게 보기`);
    const picture = document.createElement('img');
    picture.src = photo.thumb || photo.src;
    picture.alt = photo.caption;
    picture.loading = 'lazy';
    picture.decoding = 'async';
    picture.width = photo.width;
    picture.height = photo.height;
    const title = document.createElement('span');
    title.className = 'photo-card-title';
    title.textContent = photo.caption;
    const context = document.createElement('span');
    context.className = 'photo-card-meta';
    context.textContent = `${dateLabel(photo.date)} · ${photo.city}${photo.kind === 'video' ? ' · 동영상' : ''}`;
    button.append(picture, title, context);
    button.addEventListener('click', () => openPhoto(photo, button));
    return button;
  }

  function renderGallery() {
    filtered = photos.filter(photo => (!dateFilter.value || photo.date === dateFilter.value) && (!cityFilter.value || photo.city === cityFilter.value));
    gallery.replaceChildren(...filtered.slice(0, visibleCount).map(photoButton));
    resultLabel.textContent = filtered.length ? `${filtered.length}개의 추억 중 ${Math.min(visibleCount, filtered.length)}개 표시` : '선택한 날짜와 도시의 사진은 없어요. 다른 조건을 선택해 주세요.';
    moreButton.hidden = filtered.length <= visibleCount;
  }

  function renderViewer() {
    const photo = viewerPhotos[activeIndex];
    viewer.replaceChildren();
    const media = document.createElement(photo.kind === 'video' ? 'video' : 'img');
    media.src = photo.src;
    if (photo.kind === 'video') {
      media.controls = true;
      media.playsInline = true;
      media.preload = 'metadata';
      media.poster = photo.thumb;
    } else {
      media.alt = photo.caption;
    }
    viewer.append(media);
    caption.textContent = `${dateLabel(photo.date)} · ${photo.city} — ${photo.caption} (${activeIndex + 1}/${viewerPhotos.length})`;
    previousButton.disabled = activeIndex === 0;
    nextButton.disabled = activeIndex === viewerPhotos.length - 1;
  }

  function openPhoto(photo, button) {
    opener = button;
    viewerPhotos = button.closest('.record-photo-strip') ? photos : filtered;
    activeIndex = viewerPhotos.indexOf(photo);
    renderViewer();
    dialog.showModal();
  }

  function movePhoto(direction) {
    const nextIndex = activeIndex + direction;
    if (nextIndex < 0 || nextIndex >= viewerPhotos.length) return;
    activeIndex = nextIndex;
    renderViewer();
  }

  addOptions(dateFilter, [...new Set(photos.map(photo => photo.date))].sort());
  document.querySelector('#record-photo-count').textContent = ` · 함께 보는 ${photos.length}개의 장면`;
  addOptions(cityFilter, [...new Set(photos.map(photo => photo.city))]);
  [dateFilter, cityFilter].forEach(select => select.addEventListener('change', () => {
    visibleCount = 18;
    renderGallery();
  }));
  moreButton.addEventListener('click', () => {
    const firstNewIndex = Math.min(visibleCount, filtered.length);
    visibleCount += 18;
    renderGallery();
    gallery.children[firstNewIndex]?.focus();
  });
  document.querySelector('#photo-close').addEventListener('click', () => dialog.close());
  previousButton.addEventListener('click', () => movePhoto(-1));
  nextButton.addEventListener('click', () => movePhoto(1));
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    viewer.replaceChildren();
    opener?.focus();
  });
  dialog.addEventListener('keydown', event => {
    if (event.target.tagName === 'VIDEO') return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); movePhoto(-1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); movePhoto(1); }
  });
  document.querySelectorAll('.record-timeline > li').forEach(day => {
    const date = day.querySelector('time').dateTime;
    const selected = photos.filter(photo => photo.date === date).slice(0, 3);
    if (!selected.length) return;
    const strip = document.createElement('div');
    strip.className = 'record-photo-strip';
    strip.append(...selected.map(photoButton));
    day.querySelector('article').append(strip);
  });
  renderGallery();
})();
