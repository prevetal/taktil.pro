document.addEventListener('DOMContentLoaded', function() {
	// Main slider
	let mainSlider = document.querySelector('.main_slider .swiper')

	if (mainSlider) {
		new Swiper('.main_slider .swiper', {
			loop: true,
			speed: 750,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 0,
			slidesPerView: 1,
			loopAdditionalSlides: 1,
			pagination: {
				el: '.swiper-pagination',
				type: 'bullets',
				clickable: true,
				bulletActiveClass: 'active'
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			lazy: true,
			autoplay: {
				delay: 7000,
				disableOnInteraction: false
			}
		})
	}


	// Categories slider
	const categoriesSliders = [],
		categories = document.querySelectorAll('.categories_slider .swiper')

	categories.forEach((el, i) => {
		el.classList.add('categories_s' + i)

		let options = {
			loop: true,
			loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			lazy: true,
			spaceBetween: 20,
			slidesPerView: 'auto'
		}

		categoriesSliders.push(new Swiper('.categories_s' + i, options))
	})


	// Product info
	if ($('.product_info .images').length) {
		const productThumbs = new Swiper('.product_info .thumbs .swiper', {
			loop: false,
			loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			lazy: true,
			slidesPerView: 4,
			spaceBetween: 11
		})

		new Swiper('.product_info .big .swiper', {
			loop: false,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			spaceBetween: 24,
			slidesPerView: 1,
			lazy: true,
			thumbs: {
				swiper: productThumbs
			}
		})
	}


	/*$('.product_info .buy_btn').click(function(e) {
		$(this).hide()

		$('.product_info .amount').addClass('show')
	})*/


	// Reviews slider
	const reviewsSliders = [],
		reviews = document.querySelectorAll('.reviews .swiper')

	reviews.forEach((el, i) => {
		el.classList.add('reviews_s' + i)

		let options = {
			loop: true,
			loopAdditionalSlides: 1,
			speed: 500,
			watchSlidesProgress: true,
			slideActiveClass: 'active',
			slideVisibleClass: 'visible',
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			lazy: true,
			spaceBetween: 10,
			slidesPerView: 'auto',
			centeredSlides: true
		}

		reviewsSliders.push(new Swiper('.reviews_s' + i, options))
	})


	// Fancybox
	Fancybox.defaults.autoFocus = false
	Fancybox.defaults.trapFocus = false
	Fancybox.defaults.dragToClose = false
	Fancybox.defaults.placeFocusBack = false
	Fancybox.defaults.l10n = {
		CLOSE: 'Закрыть',
		NEXT: 'Следующий',
		PREV: 'Предыдущий',
		MODAL: 'Вы можете закрыть это модальное окно нажав клавишу ESC'
	}


	// Zoom images
	Fancybox.bind('.fancy_img', {
		Image: {
			zoom: false
		},
		Thumbs: {
			autoStart: false
		}
	})


	// Accordion
	$('body').on('click', '.accordion .accordion_item .head', function(e) {
		e.preventDefault()

		let item = $(this).closest('.accordion_item'),
			accordion = $(this).closest('.accordion')

		if (item.hasClass('active')) {
			item.removeClass('active').find('.data').hide()
		} else {
			accordion.find('.accordion_item').removeClass('active')
			accordion.find('.data').hide()

			item.addClass('active').find('.data').show()
		}
	})


	// Mob. menu
	$('.mob_header .menu_btn, .mob_menu .close_btn').click((e) => {
		e.preventDefault()

		$('.mob_header .menu_btn').toggleClass('active')
		$('body').toggleClass('lock')
		$('.mob_menu').toggleClass('show')
	})

	if(window.innerWidth<639){
		$(".js-menu-footer").click((e) => {
			e.preventDefault()

			$('.mob_header .menu_btn').toggleClass('active')
			$('body').toggleClass('lock')
			$('.mob_menu').toggleClass('show')
		})
	}
	


	// Phone input mask
	const phoneInputs = document.querySelectorAll('input[type=tel]')

	if (phoneInputs) {
		phoneInputs.forEach(el => {
			IMask(el, {
				mask: '+{7} (000) 000-00-00',
				lazy: true
			})
		})
	}


	// Change the quantity of goods
	$('body').on('click', '.amount .minus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			minimum = parseFloat($input.data('minimum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal > minimum) $input.val(inputVal - step + unit)
	})

	$('body').on('click', '.amount .plus', function (e) {
		e.preventDefault()

		const $parent = $(this).closest('.amount'),
			$input = $parent.find('.input'),
			inputVal = parseFloat($input.val()),
			maximum = parseFloat($input.data('maximum')),
			step = parseFloat($input.data('step')),
			unit = $input.data('unit')

		if (inputVal < maximum) $input.val(inputVal + step + unit)
	})

	$('.amount .input').keydown(function () {
		const _self = $(this),
			maximum = parseInt(_self.data('maximum'))

		setTimeout(() => {
			if (_self.val() == '' || _self.val() == 0) _self.val(parseInt(_self.data('minimum')))
			if (_self.val() > maximum) _self.val(maximum)
		})
	})


	// Mini popups
	$('.mini_modal_btn').click(function(e) {
		e.preventDefault()

		const modalId = $(this).data('modal-id')

		if ($(this).hasClass('active')) {
			$('.mini_modal_btn[data-modal-id="'+ modalId +'"]').removeClass('active')
			$('.mini_modal').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		} else {
			$('.mini_modal_btn').removeClass('active')
			$('.mini_modal_btn[data-modal-id="'+ modalId +'"]').addClass('active')

			$('.mini_modal').removeClass('active')
			$(modalId).addClass('active')

			if (is_touch_device()) $('body').css('cursor', 'pointer')
		}
	})


	// Close the popup when clicking outside of it
	$(document).click(e => {
		if ($(e.target).closest('.modal_cont').length === 0) {
			$('.mini_modal, .mini_modal_btn').removeClass('active')

			if (is_touch_device()) $('body').css('cursor', 'default')
		}
	})


	// Filter
	$('.filter .form .name').click(function(e) {
		e.preventDefault()

		$(this).toggleClass('active').next().slideToggle(300)
	})


	priceRange = $('.filter #price_range').ionRangeSlider({
		type: 'double',
		min: 200,
		max: 20000,
		from: 200,
		to: 20000,
		step: 10,
		onChange: data => {
			$('.filter .price_range input.from').val(`от ${data.from.toLocaleString()} ₽`)
			$('.filter .price_range input.to').val(`до ${data.to.toLocaleString()} ₽`)
		},
		onUpdate: data => {
			$('.filter .price_range input.from').val(`от ${data.from.toLocaleString()} ₽`)
			$('.filter .price_range input.to').val(`до ${data.to.toLocaleString()} ₽`)
		}
	}).data('ionRangeSlider')

	$('.filter .price_range .input').keyup(function () {
		priceRange.update({
			from: parseInt($('.filter .price_range input.from').val().replace(/[^\d]/g, ""), 10),
			to: parseInt($('.filter .price_range input.to').val().replace(/[^\d]/g, ""), 10)
		})
	})


	$('.filter .reset_btn').click(function() {
		if(priceRange) {
			priceRange.reset()
		}
	})


	$('.mob_filter_btn').click(function() {
		$('.filter').addClass('show')
		$('.overlay').fadeIn(300)
	})

	$('.overlay').click(function() {
		$('.filter').removeClass('show')
		$('.overlay').fadeOut(300)
	})


	// Animation
	const animationBoxes = document.querySelectorAll('.animate')

	function scrollTracking(entries) {
		for (const entry of entries) {
			if (entry.target.classList.contains('animate')) {
				if (entry.intersectionRatio >= 0.2 && !entry.target.classList.contains('animated')) {
					entry.target.classList.add('animated')
				}
			}
		}
	}

	const animationObserver = new IntersectionObserver(scrollTracking, {
		threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
	})

	animationBoxes.forEach(element => animationObserver.observe(element))
})