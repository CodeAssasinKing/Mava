document.addEventListener('DOMContentLoaded', () => {
	const burger = document.querySelector('.nav__burger')
	const menu = document.querySelector('.nav__menu')
	const backdrop = document.querySelector('.nav__backdrop')
	const closeBtn = document.querySelector('.nav__close') // если добавишь X

	if (!burger || !menu || !backdrop) return

	const openMenu = () => {
		burger.classList.add('is-open')
		menu.classList.add('is-open')
		backdrop.hidden = false
		burger.setAttribute('aria-expanded', 'true')
		document.body.classList.add('nav--locked')
	}

	const closeMenu = () => {
		burger.classList.remove('is-open')
		menu.classList.remove('is-open')
		backdrop.hidden = true
		burger.setAttribute('aria-expanded', 'false')
		document.body.classList.remove('nav--locked')
	}

	burger.addEventListener('click', () => {
		menu.classList.contains('is-open') ? closeMenu() : openMenu()
	})

	backdrop.addEventListener('click', closeMenu)
	if (closeBtn) closeBtn.addEventListener('click', closeMenu)

	document.addEventListener('keydown', e => {
		if (e.key === 'Escape') closeMenu()
	})

	menu.addEventListener('click', e => {
		const a = e.target.closest('a')
		if (a) closeMenu()
	})

	window.addEventListener('resize', () => {
		if (window.innerWidth > 992) closeMenu()
	})
})
