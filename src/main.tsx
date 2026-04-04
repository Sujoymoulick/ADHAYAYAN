import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

function initGalaxy() {
  const canvas = document.getElementById('galaxy-canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  
  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const stars = Array.from({ length: 250 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.3 + 0.05,
    opacity: Math.random() * 0.7 + 0.3,
    twinkle: Math.random() * Math.PI * 2,
    twinkleSpeed: Math.random() * 0.02 + 0.005,
    color: Math.random() > 0.85 ? '#00f0ff' : Math.random() > 0.7 ? '#ff4e00' : '#ffffff',
  }))

  const shootingStars: any[] = []
  let frame = 0

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (frame % 120 === 0) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: 80 + Math.random() * 100,
        speed: 6 + Math.random() * 8,
        angle: Math.PI / 5,
        life: 0,
        maxLife: 40 + Math.random() * 30,
      })
    }
    for (const s of stars) {
      s.y += s.speed
      if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width }
      const twinkle = 0.5 + 0.5 * Math.sin(frame * s.twinkleSpeed + s.twinkle)
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = s.color
      ctx.globalAlpha = s.opacity * twinkle
      ctx.fill()
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const ss = shootingStars[i]
      ss.life++
      ss.x += Math.cos(ss.angle) * ss.speed
      ss.y += Math.sin(ss.angle) * ss.speed
      const op = 1 - ss.life / ss.maxLife
      if (ss.life >= ss.maxLife) { shootingStars.splice(i, 1); continue }
      const grad = ctx.createLinearGradient(ss.x, ss.y,
        ss.x - Math.cos(ss.angle) * ss.len,
        ss.y - Math.sin(ss.angle) * ss.len)
      grad.addColorStop(0, `rgba(0,240,255,${op})`)
      grad.addColorStop(1, 'rgba(0,240,255,0)')
      ctx.beginPath()
      ctx.moveTo(ss.x, ss.y)
      ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.len, ss.y - Math.sin(ss.angle) * ss.len)
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.5
      ctx.globalAlpha = op
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    frame++
    requestAnimationFrame(animate)
  }
  animate()
}

window.addEventListener('load', () => {
  initGalaxy()
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);