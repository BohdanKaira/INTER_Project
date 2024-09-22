document.querySelectorAll('.menu_list li').forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        const imageDiv = document.querySelector('.menu_image .image_div');
        // Меняем фон в зависимости от элемента списка
        switch(index) {
            case 0:
                imageDiv.style.backgroundImage = "url('../assets/images/image_one.png')";
                break;
            case 1:
                imageDiv.style.backgroundImage = "url('../assets/images/image_two.png')";
                break;
            case 2:
                imageDiv.style.backgroundImage = "url('../assets/images/image_three.png')";
                break;
            case 3:
                imageDiv.style.backgroundImage = "url('../assets/images/image_four.png')";
                break;
        }
        imageDiv.style.display = 'block'; // Показываем изображение
    });

    item.addEventListener('mouseleave', () => {
        const imageDiv = document.querySelector('.menu_image .image_div');
        imageDiv.style.display = 'none'; // Скрываем изображение при уходе курсора
    });
});
function initArrowAnimation() {
    // Выбираем все кнопки с классом .white_button
    const buttons = document.querySelectorAll('.white_button');

    // Проходим по каждой кнопке
    buttons.forEach((button) => {
        const arrowWrap = button.querySelector('.arrow_wrap svg');
        let hasHovered = false; // Флаг для отслеживания, был ли ховер на этой кнопке

        // Функция для запуска анимации moveLeft при уходе курсора
        function handleMouseLeave() {
            if (hasHovered) {
                arrowWrap.style.animation = 'moveLeft 0.5s forwards';
            }
        }

        // Функция для запуска анимации moveRight при наведении курсора
        function handleMouseEnter() {
            arrowWrap.style.animation = 'moveRight 0.5s forwards';
            hasHovered = true; // Ховер был, можем запускать moveLeft после
        }

        // Привязываем события к каждой кнопке
        button.addEventListener('mouseenter', handleMouseEnter);
        button.addEventListener('mouseleave', handleMouseLeave);
    });
}

// Запуск функции
initArrowAnimation();

// Вызов функции для инициализации анимации
initArrowAnimation();

function initSliderMenu() {
  const menuItems = document.querySelectorAll('.menu-item');
  const slides = document.querySelectorAll('.slider-slide');
  const sliderContent = document.querySelector('.slider-content');
  const prevButton = document.querySelector('.prev-slide');
  const nextButton = document.querySelector('.next-slide');
  let activeIndex = 0;

  // Функция для обновления активного меню и перемещения слайдов
  function updateMenuAndSlides() {
    menuItems.forEach((item, index) => {
      if (index === activeIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Перемещаем контейнер слайдов по горизонтали
    sliderContent.style.transform = `translateX(-${activeIndex * 100}%)`;
  }

  // Обработка кнопки "Предыдущий слайд"
  prevButton.addEventListener('click', () => {
    if (activeIndex > 0) {
      activeIndex--;
    } else {
      activeIndex = slides.length - 1; // Зацикливаем слайды
    }
    updateMenuAndSlides();
  });

  // Обработка кнопки "Следующий слайд"
  nextButton.addEventListener('click', () => {
    if (activeIndex < slides.length - 1) {
      activeIndex++;
    } else {
      activeIndex = 0; // Зацикливаем слайды
    }
    updateMenuAndSlides();
  });

  // Инициализация меню и слайда с первым активным элементом
  updateMenuAndSlides();
}

// Вызов функции для инициализации слайдера
initSliderMenu();

// var swiper = new Swiper(".mySwiper", {
//   direction: 'vertical', // Вертикальная ориентация
//   slidesPerView: 'auto', // Автоматический расчет количества видимых слайдов
//   centeredSlides: true, // Центрирование активного слайда
//   loop: true, // Зацикленный слайдер
  
//   slideToClickedSlide: true, // Переключение на слайд при клике
//   on: {
//     slideChangeTransitionStart: function () {
//       let slides = document.querySelectorAll('.swiper-slide');
//       slides.forEach((slide) => {
//         // Удаляем классы перед добавлением новых
//         slide.classList.remove('swiper-slide-next-next', 'swiper-slide-prev-prev', 'swiper-slide-next-next-next', 'swiper-slide-prev-prev-prev');
//       });

//       // Добавляем классы для следующего и предыдущего слайдов
//       let nextSlide = swiper.slides[swiper.activeIndex + 1];
//       let prevSlide = swiper.slides[swiper.activeIndex - 1];
//       let nextNextSlide = swiper.slides[swiper.activeIndex + 2];
//       let prevPrevSlide = swiper.slides[swiper.activeIndex - 2];
//       let nextNextNextSlide = swiper.slides[swiper.activeIndex + 3];
//       let prevPrevPrevSlide = swiper.slides[swiper.activeIndex - 3];

//       if (nextSlide) nextSlide.classList.add('swiper-slide-next');
//       if (prevSlide) prevSlide.classList.add('swiper-slide-prev');
//       if (nextNextSlide) nextNextSlide.classList.add('swiper-slide-next-next');
//       if (prevPrevSlide) prevPrevSlide.classList.add('swiper-slide-prev-prev');
//       if (nextNextNextSlide) nextNextNextSlide.classList.add('swiper-slide-next-next-next');
//       if (prevPrevPrevSlide) prevPrevPrevSlide.classList.add('swiper-slide-prev-prev-prev');
//     }
//   }
// });
