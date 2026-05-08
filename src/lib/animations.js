import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function fadeUp(el, opts = {}) {
  if (reduced) return
  return gsap.fromTo(el,
    { y: opts.y ?? 40, opacity: 0 },
    { y: 0, opacity: 1, duration: opts.duration ?? 0.7, ease: 'power3.out', delay: opts.delay ?? 0, ...opts.to }
  )
}

export function staggerFadeUp(els, opts = {}) {
  if (reduced) return
  return gsap.fromTo(els,
    { y: opts.y ?? 40, opacity: 0 },
    {
      y: 0, opacity: 1,
      duration: opts.duration ?? 0.6,
      ease: 'power3.out',
      stagger: opts.stagger ?? 0.1,
      delay: opts.delay ?? 0,
    }
  )
}

export function scrollReveal(el, opts = {}) {
  if (reduced || !el) return
  return gsap.fromTo(el,
    { y: opts.y ?? 30 },
    {
      y: 0,
      duration: opts.duration ?? 0.7,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: opts.start ?? 'top 90%',
        once: true,
        ...opts.scrollTrigger,
      },
    }
  )
}

export function scrollRevealStagger(els, opts = {}) {
  if (reduced) return
  return gsap.fromTo(els,
    { y: opts.y ?? 30 },
    {
      y: 0,
      duration: opts.duration ?? 0.6,
      ease: 'power3.out',
      stagger: opts.stagger ?? 0.1,
      scrollTrigger: {
        trigger: els[0] ?? els,
        start: opts.start ?? 'top 90%',
        once: true,
      },
    }
  )
}

export function heroEntrance(els, opts = {}) {
  if (reduced) return
  const tl = gsap.timeline({ delay: opts.delay ?? 0.1 })
  tl.fromTo(els[0], { y: -20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
  if (els[1]) tl.fromTo(els[1], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.2')
  if (els[2]) tl.fromTo(els[2], { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.3')
  if (els[3]) tl.fromTo(els[3], { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2')
  return tl
}

export function cardTilt(el) {
  if (reduced) return
  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rotX = ((y - cy) / cy) * -8
    const rotY = ((x - cx) / cx) * 8
    gsap.to(el, { rotationX: rotX, rotationY: rotY, duration: 0.3, ease: 'power2.out', transformPerspective: 800 })
  }
  const handleLeave = () => {
    gsap.to(el, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)', transformPerspective: 800 })
  }
  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)
  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
  }
}

export function magneticHover(el, strength = 0.3) {
  if (reduced) return
  const handleMove = (e) => {
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left - rect.width / 2) * strength
    const y = (e.clientY - rect.top - rect.height / 2) * strength
    gsap.to(el, { x, y, duration: 0.3, ease: 'power2.out' })
  }
  const handleLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' })
  }
  el.addEventListener('mousemove', handleMove)
  el.addEventListener('mouseleave', handleLeave)
  return () => {
    el.removeEventListener('mousemove', handleMove)
    el.removeEventListener('mouseleave', handleLeave)
  }
}

export function counterUp(el, end, opts = {}) {
  if (reduced) { el.textContent = end; return }
  const obj = { val: 0 }
  return gsap.to(obj, {
    val: end,
    duration: opts.duration ?? 2,
    ease: 'power2.out',
    delay: opts.delay ?? 0,
    scrollTrigger: opts.scrollTrigger,
    onUpdate() {
      el.textContent = Math.round(obj.val).toLocaleString() + (opts.suffix ?? '')
    },
  })
}

export function pageTransitionIn() {
  if (reduced) return
  const overlay = document.getElementById('page-transition')
  if (!overlay) return
  gsap.fromTo(overlay,
    { scaleY: 1, transformOrigin: 'top' },
    { scaleY: 0, duration: 0.6, ease: 'power3.inOut' }
  )
}

export function pageTransitionOut(cb) {
  if (reduced) { cb?.(); return }
  const overlay = document.getElementById('page-transition')
  if (!overlay) { cb?.(); return }
  gsap.fromTo(overlay,
    { scaleY: 0, transformOrigin: 'bottom' },
    { scaleY: 1, duration: 0.5, ease: 'power3.inOut', onComplete: cb }
  )
}

export function parallax(el, speed = 0.3) {
  if (reduced) return
  return gsap.to(el, {
    y: () => window.innerHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: el,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export { gsap, ScrollTrigger }
