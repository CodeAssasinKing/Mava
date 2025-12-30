gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

ScrollSmoother.create({
	wrapper: '#smooth-wrapper',
	content: '#smooth-content',
	smooth: 1.2,
	normalizeScroll: true,
})

/* TEXT – AOS FADE-UP (REPEATABLE) */
gsap.utils.toArray('.scene .text').forEach(el => {
	gsap.fromTo(
		el,
		{ y: 60, opacity: 0 },
		{
			y: 0,
			opacity: 1,
			duration: 1,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 75%',
				end: 'bottom 25%',
				toggleActions: 'play reverse play reverse',
			},
		}
	)
})

/* MAP – SLIDE (REPEATABLE) */
gsap.utils.toArray('.scene .map').forEach((el, i) => {
	gsap.fromTo(
		el,
		{ x: i % 2 === 0 ? 80 : -80, opacity: 0 },
		{
			x: 0,
			opacity: 1,
			duration: 1.1,
			ease: 'power3.out',
			scrollTrigger: {
				trigger: el,
				start: 'top 80%',
				end: 'bottom 20%',
				toggleActions: 'play reverse play reverse',
			},
		}
	)
})

/* CONTACT FORM – STAGGER REPEAT */
gsap.utils.toArray('.contact-form').forEach(form => {
	const items = form.querySelectorAll('input, textarea, button')

	gsap.fromTo(
		items,
		{ y: 30, opacity: 0 },
		{
			y: 0,
			opacity: 1,
			stagger: 0.12,
			duration: 0.8,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: form,
				start: 'top 75%',
				end: 'bottom 30%',
				toggleActions: 'play reverse play reverse',
			},
		}
	)
})

/* MICRO PARALLAX – ALWAYS ON */
gsap.utils.toArray('.map img').forEach(img => {
	gsap.to(img, {
		y: -40,
		ease: 'none',
		scrollTrigger: {
			trigger: img,
			scrub: true,
		},
	})
})
/* FINAL SECTION – AOS STYLE (REPEATABLE) */
gsap.fromTo(
	'.final h2',
	{
		y: 60,
		opacity: 0,
	},
	{
		y: 0,
		opacity: 1,
		duration: 1.2,
		ease: 'power3.out',
		scrollTrigger: {
			trigger: '.final',
			start: 'top 75%',
			end: 'bottom 40%',
			toggleActions: 'play reverse play reverse',
		},
	}
)
