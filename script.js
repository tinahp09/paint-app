const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const colorPicker = document.getElementById('color-picker')
const brushSize = document.getElementById('brush-size')
const eraserBtn = document.getElementById('eraser')
const clearBtn = document.getElementById('clear')
const downloadBtn = document.getElementById('download')
const undoBtn = document.getElementById('undo')
const redoBtn = document.getElementById('redo')

let painting = false
let isEraser = false
let history = []
let redoHistory = []

function resizeCanvas() {
  canvas.width = window.innerWidth
  canvas.height =
    window.innerHeight - document.querySelector('.toolbar').offsetHeight
}
window.addEventListener('resize', resizeCanvas)
resizeCanvas()

ctx.lineCap = 'round'
ctx.lineJoin = 'round'

function startPosition(e) {
  painting = true
  draw(e)
}

function finishedPosition() {
  painting = false
  ctx.beginPath()
  saveState()
}

function draw(e) {
  if (!painting) return
  ctx.lineWidth = brushSize.value
  ctx.strokeStyle = isEraser ? '#ffffff' : colorPicker.value

  ctx.lineTo(
    e.clientX,
    e.clientY - document.querySelector('.toolbar').offsetHeight
  )
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(
    e.clientX,
    e.clientY - document.querySelector('.toolbar').offsetHeight
  )
}

canvas.addEventListener('mousedown', startPosition)
canvas.addEventListener('mouseup', finishedPosition)
canvas.addEventListener('mousemove', draw)

eraserBtn.addEventListener('click', () => {
  isEraser = !isEraser
  eraserBtn.innerHTML = `<i class="${
    isEraser ? 'fas fa-pencil-alt' : 'fas fa-eraser'
  }"></i>`
})

clearBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  saveState()
})

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a')
  link.download = 'drawing.png'
  link.href = canvas.toDataURL()
  link.click()
})

function saveState() {
  history.push(canvas.toDataURL())
  redoHistory = []
}

undoBtn.addEventListener('click', () => {
  if (history.length > 0) {
    redoHistory.push(history.pop())
    let imgData = history[history.length - 1]
    if (imgData) {
      let img = new Image()
      img.src = imgData
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }
})

redoBtn.addEventListener('click', () => {
  if (redoHistory.length > 0) {
    let imgData = redoHistory.pop()
    history.push(imgData)
    let img = new Image()
    img.src = imgData
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
  }
})

// Save the initial empty canvas
saveState()
