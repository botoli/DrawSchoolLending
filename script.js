// Основной JavaScript для лендинга
document.addEventListener('DOMContentLoaded', function () {
  // Плавная прокрутка для якорных ссылок
  const smoothScroll = function (target) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Обработчики для основных кнопок
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    button.addEventListener('click', function () {
      // Анимация нажатия
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);

      // Обработка конкретных кнопок
      if (this.classList.contains('hero-button')) {
        smoothScroll('.contact-section');
      }

      if (this.classList.contains('hero-button-outline')) {
        smoothScroll('.contact-section');
      }

      if (this.classList.contains('about-button')) {
        smoothScroll('.gallery-section');
      }
    });
  });

  // Обработчики для кнопок в блоке контактов
  const contactButtons = document.querySelectorAll('.contact-action-button');
  contactButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      // Здесь можно добавить логику для открытия соответствующих мессенджеров
      // Пока просто предотвращаем переход по ссылке если href="#"
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
        // Можно добавить уведомление или другую логику
        console.log('Открытие мессенджера: ' + this.classList[1]);
      }
    });
  });

  // Функциональность галереи
  const galleryScrollWrapper = document.querySelector('.gallery-scroll-wrapper');
  const galleryNavButtons = document.querySelectorAll('.gallery-nav-button');
  const galleryMenuItems = document.querySelectorAll('.gallery-menu-item');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryScrollWrapper) {
    // Прокрутка галереи кнопками
    galleryNavButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const scrollAmount = 410; // Шаг прокрутки (ширина элемента + gap)

        if (this.classList.contains('gallery-prev')) {
          galleryScrollWrapper.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth',
          });
        } else {
          galleryScrollWrapper.scrollBy({
            left: scrollAmount,
            behavior: 'smooth',
          });
        }
      });
    });

    // Фильтрация галереи по категориям
    galleryMenuItems.forEach((item) => {
      item.addEventListener('click', function () {
        // Убираем активный класс у всех элементов
        galleryMenuItems.forEach((i) => i.classList.remove('active'));
        // Добавляем активный класс текущему элементу
        this.classList.add('active');

        const category = this.dataset.category;
        filterGallery(category);
      });
    });

    // Drag to scroll functionality
    let isDragging = false;
    let startX;
    let scrollLeft;

    galleryScrollWrapper.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - galleryScrollWrapper.offsetLeft;
      scrollLeft = galleryScrollWrapper.scrollLeft;
      galleryScrollWrapper.style.cursor = 'grabbing';
    });

    galleryScrollWrapper.addEventListener('mouseleave', () => {
      isDragging = false;
      galleryScrollWrapper.style.cursor = 'grab';
    });

    galleryScrollWrapper.addEventListener('mouseup', () => {
      isDragging = false;
      galleryScrollWrapper.style.cursor = 'grab';
    });

    galleryScrollWrapper.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - galleryScrollWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      galleryScrollWrapper.scrollLeft = scrollLeft - walk;
    });

    // Touch events для мобильных устройств
    galleryScrollWrapper.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].pageX - galleryScrollWrapper.offsetLeft;
      scrollLeft = galleryScrollWrapper.scrollLeft;
    });

    galleryScrollWrapper.addEventListener('touchend', () => {
      isDragging = false;
    });

    galleryScrollWrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const x = e.touches[0].pageX - galleryScrollWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      galleryScrollWrapper.scrollLeft = scrollLeft - walk;
    });

    // Автоматическая прокрутка галереи
    let autoScrollInterval;

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (!isDragging) {
          galleryScrollWrapper.scrollBy({
            left: 410,
            behavior: 'smooth',
          });

          // Если достигнут конец, прокручиваем к началу
          if (
            galleryScrollWrapper.scrollLeft + galleryScrollWrapper.clientWidth >=
            galleryScrollWrapper.scrollWidth - 10
          ) {
            setTimeout(() => {
              galleryScrollWrapper.scrollTo({
                left: 0,
                behavior: 'smooth',
              });
            }, 1000);
          }
        }
      }, 5000);
    }

    function stopAutoScroll() {
      clearInterval(autoScrollInterval);
    }

    // Запускаем автоматическую прокрутку
    startAutoScroll();

    // Останавливаем при взаимодействии
    galleryScrollWrapper.addEventListener('mouseenter', stopAutoScroll);
    galleryScrollWrapper.addEventListener('mouseleave', startAutoScroll);
    galleryScrollWrapper.addEventListener('touchstart', stopAutoScroll);
  }

  // Функция фильтрации галереи
  function filterGallery(category) {
    galleryItems.forEach((item) => {
      const itemCategory = item.dataset.category;

      if (category === 'all' || itemCategory === category) {
        item.style.display = 'block';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 50);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
          item.style.display = 'none';
        }, 300);
      }
    });

    // Прокручиваем к началу после фильтрации
    setTimeout(() => {
      if (galleryScrollWrapper) {
        galleryScrollWrapper.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
    }, 350);
  }

  // Анимация появления элементов при скролле
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Наблюдаем за секциями
  const sections = document.querySelectorAll('section');
  sections.forEach((section) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Ленивая загрузка изображений
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1,
    },
  );

  lazyImages.forEach((img) => {
    if (img.dataset.src) {
      imageObserver.observe(img);
    }
  });

  console.log('Лендинг успешно загружен! 🎨');
});

// Дополнительные функции для улучшения UX
window.addEventListener('load', function () {
  // Показываем кнопку "наверх" при скролле
  const scrollToTop = document.createElement('button');
  scrollToTop.innerHTML = '↑';
  scrollToTop.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1.2rem;
        box-shadow: var(--shadow-hover);
        transition: var(--transition);
        z-index: 100;
        opacity: 0;
        transform: translateY(20px);
    `;

  document.body.appendChild(scrollToTop);

  window.addEventListener('scroll', function () {
    if (window.pageYOffset > 300) {
      scrollToTop.style.opacity = '1';
      scrollToTop.style.transform = 'translateY(0)';
    } else {
      scrollToTop.style.opacity = '0';
      scrollToTop.style.transform = 'translateY(20px)';
    }
  });

  scrollToTop.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
});
