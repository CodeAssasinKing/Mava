;(function () {
	'use strict'

	// ---------------------------
	// Settings
	// ---------------------------
	let velocity = 0
	const ease = 0.12
	const friction = 0.92

	let targetScrollPosition = null
	const scrollEase = 0.08

	const sections = document.querySelectorAll('.scroll-section')
	const wrappers = []
	const comparatorData = []

	// ---------------------------
	// Detect CSS scroll-driven support
	// ---------------------------
	const HAS_SCROLL_DRIVEN =
		('CSS' in window) &&
		typeof CSS.supports === 'function' &&
		(
			CSS.supports('animation-timeline: scroll(root)') ||
			CSS.supports('animation-timeline: scroll()') ||
			CSS.supports('view-timeline-name: --x') ||
			CSS.supports('scroll-timeline-name: --x')
		)

	function clamp(n, a, b) {
		return Math.max(a, Math.min(b, n))
	}

	function getCSSVarNumber(name, fallback) {
		const style = getComputedStyle(document.documentElement)
		const raw = style.getPropertyValue(name).trim()
		const v = parseFloat(raw)
		return Number.isFinite(v) ? v : fallback
	}

	function getComparatorDurationPx() {
		// --comparator-duration: 400vh;
		const vh = getCSSVarNumber('--comparator-duration', 400)
		return (vh * window.innerHeight) / 100
	}

	function getComparatorOffsetPx() {
		// --comparator-offset: 35vh;
		const vh = getCSSVarNumber('--comparator-offset', 35)
		return (vh * window.innerHeight) / 100
	}

	// ---------------------------
	// Collect DOM
	// ---------------------------
	for (let i = 0; i < sections.length; i++) {
		const s = sections[i]
		const w = s.querySelector('.comparator-wrapper')
		if (w) wrappers.push({ section: s, wrapper: w })

		const c = s.querySelector('.comparator')
		if (!c) continue

		const p = c.querySelector('.comparison-percentage')
		if (!p) continue

		const layers = c.querySelectorAll('.image-layer')
		const dividers = c.querySelectorAll('.divider-line')

		comparatorData.push({
			comp: c,
			pct: p,
			section: s,
			wrapper: w,
			layers: Array.from(layers),
			dividers: Array.from(dividers),
			layerCount: layers.length,
			indicators: [],
			reverse: !!(w && w.classList.contains('flip-reverse')),
		})
	}

	// ---------------------------
	// Stage indicators
	// ---------------------------
	function createStageIndicators() {
		for (let i = 0; i < comparatorData.length; i++) {
			const d = comparatorData[i]
			const nav = document.createElement('div')
			nav.className = 'stage-nav'

			const indicators = []
			for (let j = 0; j < d.layerCount; j++) {
				const indicator = document.createElement('button')
				indicator.className = 'stage-indicator'
				indicator.setAttribute('aria-label', `Go to stage ${j + 1}`)
				indicator.dataset.stage = String(j)
				indicator.dataset.comparatorIndex = String(i)
				indicators.push(indicator)
				nav.appendChild(indicator)
			}

			d.comp.appendChild(nav)
			d.indicators = indicators
		}
	}

	function scrollToStage(comparatorIndex, stageIndex) {
		const d = comparatorData[comparatorIndex]
		if (!d) return

		const duration = getComparatorDurationPx()
		const stageCount = Math.max(2, d.layerCount)

		stageIndex = clamp(stageIndex, 0, stageCount - 1)
		const stageDuration = duration / (stageCount - 1)

		targetScrollPosition = d.section.offsetTop + stageDuration * stageIndex
	}

	function onIndicatorClick(e) {
		const btn = e.target.closest('.stage-indicator')
		if (!btn) return
		const stage = parseInt(btn.dataset.stage || '0', 10)
		const compIndex = parseInt(btn.dataset.comparatorIndex || '0', 10)
		scrollToStage(compIndex, stage)
	}

	// ---------------------------
	// Update offsets (for your CSS variables)
	// ---------------------------
	function updateOffsets() {
		for (let i = 0; i < wrappers.length; i++) {
			const w = wrappers[i]
			w.wrapper.style.setProperty('--comparator-offset', w.section.offsetTop + 'px')
		}
	}

	// ---------------------------
	// Smooth wheel scroll
	// ---------------------------
	function onWheel(e) {
		e.preventDefault()
		targetScrollPosition = null

		let delta = e.deltaY
		// Firefox может отдавать deltaMode = 1 (lines) или 2 (pages)
		if (e.deltaMode === 1) delta *= 16
		if (e.deltaMode === 2) delta *= window.innerHeight

		velocity += delta
	}

	let resizeTimeout
	function onResize() {
		targetScrollPosition = null
		clearTimeout(resizeTimeout)
		resizeTimeout = setTimeout(() => {
			updateOffsets()
		}, 150)
	}

	function onMouseDown(e) {
		if (!e.target.closest('.comparator-wrapper')) {
			targetScrollPosition = null
		}
	}

	// ---------------------------
	// Fallback progress calc (Firefox)
	// ---------------------------
	function computeProgressForSection(sectionTop) {
		// В CSS у тебя animation-range: var(--comparator-offset) -> offset+duration
		// Т.е. прогресс начинается не сразу при sectionTop, а через offset.
		const offset = getComparatorOffsetPx()
		const duration = getComparatorDurationPx()

		const start = sectionTop + offset
		const end = start + duration

		const y = window.scrollY
		const t = clamp((y - start) / (end - start), 0, 1)
		return t * 100
	}

	function updateProgressFallback() {
		// Если scroll-driven нет — выставляем --scroll-progress инлайном
		if (HAS_SCROLL_DRIVEN) return

		for (let i = 0; i < comparatorData.length; i++) {
			const d = comparatorData[i]
			const pct = computeProgressForSection(d.section.offsetTop)
			d.comp.style.setProperty('--scroll-progress', pct.toFixed(3))
		}
	}

	// ---------------------------
	// Fallback visual effects (Firefox)
	// ---------------------------
	function initFallbackStylesIfNeeded() {
		if (HAS_SCROLL_DRIVEN) return

		for (let i = 0; i < comparatorData.length; i++) {
			const d = comparatorData[i]

			// отключаем CSS-анимации, чтобы не конфликтовали
			if (d.wrapper) d.wrapper.style.animation = 'none'
			d.comp.style.animation = 'none'

			for (let j = 0; j < d.layers.length; j++) {
				d.layers[j].style.animation = 'none'
				d.layers[j].style.willChange = 'clip-path'
			}
			for (let j = 0; j < d.dividers.length; j++) {
				d.dividers[j].style.animation = 'none'
				d.dividers[j].style.willChange = 'inset-inline-start, opacity'
				// чтобы точно работало в FF
				d.dividers[j].style.position = 'absolute'
				d.dividers[j].style.top = '0'
			}

			// z-index вместо sibling-count/index
			const n = d.layers.length
			d.layers.forEach((layer, idx) => {
				layer.style.zIndex = String(n - idx + 1)
			})

			if (d.wrapper) {
				d.wrapper.style.willChange = 'transform, opacity'
			}
		}
	}

	function applyFlip(wrapper, progressPct, reverse) {
		if (!wrapper) return
		const t = clamp(progressPct / 100, 0, 1)

		let rotX = 0, rotY = 0, rotZ = 0, sc = 1, op = 1

		// как твой keyframes: 0..15% -> выравниваем, 85..100% -> снова наклон
		if (t < 0.15) {
			const k = t / 0.15
			rotX = (reverse ? -10 : 10) * (1 - k)
			rotY = (reverse ? 10 : -10) * (1 - k)
			rotZ = (reverse ? 3 : -3) * (1 - k)
			sc = 0.85 + (1 - 0.85) * k
			op = 0.75 + (1 - 0.75) * k
		} else if (t > 0.85) {
			const k = (t - 0.85) / 0.15
			rotX = (reverse ? 10 : -10) * k
			rotY = (reverse ? -10 : 10) * k
			rotZ = (reverse ? -3 : 3) * k
			sc = 1 - (1 - 0.85) * k
			op = 1 - (1 - 0.75) * k
		}

		wrapper.style.transform =
			`perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${sc})`
		wrapper.style.opacity = String(op)
	}

	function applyEffects(d, progressPct) {
		const n = d.layers.length
		if (!n) return

		// --- Layers reveal (clip-path) ---
		const globalStage = (progressPct / 100) * (n - 1) // 0..(n-1)

		for (let i = 0; i < n - 1; i++) {
			const t = clamp(globalStage - i, 0, 1) // 0..1 внутри этапа
			const clipRight = (t * 100).toFixed(2)
			d.layers[i].style.clipPath = `inset(0 ${clipRight}% 0 0)`
		}
		d.layers[n - 1].style.clipPath = `inset(0 0% 0 0)`

		// --- Divider lines movement ---
		const m = d.dividers.length
		if (m) {
			const dividerStage = (progressPct / 100) * m // 0..m
			for (let j = 0; j < m; j++) {
				const t = clamp(dividerStage - j, 0, 1) // 0..1
				const x = (100 - t * 100).toFixed(2)

				// приблизительно как в keyframes divider-move
				let op = 1
				if (t < 0.02) op = t / 0.02
				else if (t > 0.98) op = (1 - t) / 0.02
				op = clamp(op, 0, 1)

				const line = d.dividers[j]
				line.style.insetInlineStart = `${x}%`
				line.style.opacity = String(op)
			}
		}

		// --- Wrapper flip ---
		applyFlip(d.wrapper, progressPct, d.reverse)
	}

	// ---------------------------
	// Animation loop
	// ---------------------------
	function frame() {
		// scroll-to-stage by click
		if (targetScrollPosition !== null) {
			const current = window.scrollY
			const delta = targetScrollPosition - current

			if (Math.abs(delta) > 1) {
				window.scrollBy(0, delta * scrollEase)
			} else {
				targetScrollPosition = null
			}
		}

		// smooth wheel scroll
		velocity *= friction
		if (Math.abs(velocity) > 0.2) {
			window.scrollBy(0, velocity * ease)
		}

		// Firefox fallback progress
		updateProgressFallback()

		// update UI
		for (let i = 0; i < comparatorData.length; i++) {
			const d = comparatorData[i]

			let v =
				parseFloat(getComputedStyle(d.comp).getPropertyValue('--scroll-progress')) || 0

			// если scroll-driven нет — рисуем эффекты сами
			if (!HAS_SCROLL_DRIVEN) {
				applyEffects(d, v)
			}

			d.pct.textContent = String(Math.round(v)).padStart(2, '0') + '%'

			const currentStage = Math.round((v / 100) * (d.layerCount - 1))
			d.indicators.forEach((indicator, idx) => {
				indicator.classList.toggle('active', idx === currentStage)
			})
		}

		requestAnimationFrame(frame)
	}

	// ---------------------------
	// Bind events
	// ---------------------------
	window.addEventListener('wheel', onWheel, { passive: false })
	window.addEventListener('resize', onResize, { passive: true })
	window.addEventListener('mousedown', onMouseDown, { passive: true })
	document.addEventListener('click', onIndicatorClick)

	window.addEventListener('load', () => {
		createStageIndicators()
		updateOffsets()
		initFallbackStylesIfNeeded()
		updateProgressFallback()
		requestAnimationFrame(frame)
	})
})()
