/* =========================
   REVEAL (AOS-style, repeat)
========================= */
const reveals = document.querySelectorAll('.proc-reveal')

const revealObserver = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible')
			} else {
				entry.target.classList.remove('is-visible')
			}
		})
	},
	{ threshold: 0.15 }
)

reveals.forEach(el => revealObserver.observe(el))

/* =========================
   FAQ ACCORDION
========================= */
document.querySelectorAll('.proc-qa .proc-q').forEach(btn => {
	btn.addEventListener('click', () => {
		const item = btn.closest('.proc-qa')
		const open = item.classList.contains('is-open')

		document
			.querySelectorAll('.proc-qa.is-open')
			.forEach(x => x.classList.remove('is-open'))

		if (!open) item.classList.add('is-open')
	})
})

/* =========================
   3D CAROUSEL
========================= */
/* =========================
   3D CAROUSEL — CLICK ONLY
========================= */
const carousel = document.querySelector('.carousel')
const items = document.querySelectorAll('.carousel-item')
const cursors = document.querySelectorAll('.cursor')

if (carousel && items.length) {
  let progress = 50
  let active = 0

  const getZindex = (arr, idx) =>
    arr.map((_, i) =>
      idx === i ? arr.length : arr.length - Math.abs(idx - i)
    )

  const animate = () => {
    progress = Math.max(0, Math.min(progress, 100))
    active = Math.floor((progress / 100) * (items.length - 1))

    items.forEach((item, i) => {
      item.style.setProperty('--zIndex', getZindex([...items], active)[i])
      item.style.setProperty('--active', (i - active) / items.length)
    })
  }

  animate()

  /* CLICK ONLY */
  items.forEach((item, i) => {
    item.addEventListener('click', () => {
      progress = (i / (items.length - 1)) * 100
      animate()
    })
  })

  /* CURSOR FOLLOW (VISUAL ONLY) */
  document.addEventListener('mousemove', e => {
    cursors.forEach(c =>
      c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    )
  })
}
