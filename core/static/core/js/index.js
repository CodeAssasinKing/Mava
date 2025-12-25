document.addEventListener('DOMContentLoaded', () => {
	// GSAP must exist
	if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined')
		return

	gsap.registerPlugin(ScrollTrigger)
	if (typeof ScrollSmoother !== 'undefined') gsap.registerPlugin(ScrollSmoother)

	const isDesktop = window.matchMedia('(min-width: 981px)').matches
	const isNoTouch = ScrollTrigger.isTouch !== 1

	// =========================
	// SMOOTHER (only desktop no-touch)
	// =========================
	if (
		typeof ScrollSmoother !== 'undefined' &&
		isDesktop &&
		isNoTouch &&
		document.querySelector('.wrapper') &&
		document.querySelector('.content')
	) {
		ScrollSmoother.create({
			wrapper: '.wrapper',
			content: '.content',
			smooth: 1.5,
			effects: true,
		})
	}

	// =========================
	// HERO FADE
	// =========================
	if (document.querySelector('.hero-section')) {
		gsap.fromTo(
			'.hero-section',
			{ opacity: 1 },
			{
				opacity: 0,
				scrollTrigger: {
					trigger: '.hero-section',
					start: 'center',
					end: '820',
					scrub: true,
				},
			}
		)
	}

	// =========================
	// GALLERY ANIMS
	// =========================
	gsap.utils.toArray('.gallery__left .gallery__item').forEach(item => {
		gsap.fromTo(
			item,
			{ opacity: 0, x: -50 },
			{
				opacity: 1,
				x: 0,
				scrollTrigger: {
					trigger: item,
					start: '-850',
					end: '-100',
					scrub: true,
				},
			}
		)
	})

	gsap.utils.toArray('.gallery__right .gallery__item').forEach(item => {
		gsap.fromTo(
			item,
			{ opacity: 0, x: 50 },
			{
				opacity: 1,
				x: 0,
				scrollTrigger: {
					trigger: item,
					start: '-750',
					end: 'top',
					scrub: true,
				},
			}
		)
	})

	// =========================
	// FOOTER show/hide (DESKTOP ONLY)
	// =========================
	const footer = document.querySelector('.mava-footer')
	const spacer = document.querySelector('.footer-spacer')

	// на мобилке футер без анимаций (CSS сделает его обычным блоком)
	if (!isDesktop) return

	// desktop: если нет footer/spacer — просто выходим
	if (!footer || !spacer) return

	let shown = false

	const show = () => {
		if (shown) return
		shown = true
		footer.style.pointerEvents = 'auto'
		gsap.to(footer, {
			autoAlpha: 1,
			y: 0,
			duration: 0.45,
			ease: 'power2.out',
			overwrite: 'auto',
		})
	}

	const hide = () => {
		if (!shown) return
		shown = false
		footer.style.pointerEvents = 'none'
		gsap.to(footer, {
			autoAlpha: 0,
			y: 24,
			duration: 0.35,
			ease: 'power2.inOut',
			overwrite: 'auto',
		})
	}

	gsap.set(footer, { autoAlpha: 0, y: 24 })
	footer.style.pointerEvents = 'none'

	ScrollTrigger.create({
		trigger: spacer,
		start: 'top 92%',
		end: 'bottom 92%',
		onEnter: show,
		onEnterBack: show,
		onUpdate: self => {
			if (self.direction === -1) hide()
		},
	})
})
