const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
  {
    f: 262,
    d: 0.5,
    t: 'Hap',
    p: p1,
  },
  {
    f: 262,
    d: 0.5,
    t: 'py&nbsp;',
    p: p1,
  },
  {
    f: 294,
    d: 1,
    t: 'Birth',
    p: p1,
  },
  {
    f: 262,
    d: 1,
    t: 'day&nbsp;',
    p: p1,
  },
  {
    f: 349,
    d: 1,
    t: 'To&nbsp;',
    p: p1,
  },
  {
    f: 330,
    d: 2,
    t: 'You',
    p: p1,
  },

  {
    f: 262,
    d: 0.5,
    t: 'Hap',
    p: p2,
  },
  {
    f: 262,
    d: 0.5,
    t: 'py&nbsp;',
    p: p2,
  },
  {
    f: 294,
    d: 1,
    t: 'Birth',
    p: p2,
  },
  {
    f: 262,
    d: 1,
    t: 'day&nbsp;',
    p: p2,
  },
  {
    f: 392,
    d: 1,
    t: 'To&nbsp;',
    p: p2,
  },
  {
    f: 349,
    d: 2,
    t: 'You',
    p: p2,
  },

  {
    f: 262,
    d: 0.5,
    t: 'Hap',
    p: p3,
  },
  {
    f: 262,
    d: 0.5,
    t: 'py&nbsp;',
    p: p3,
  },
  {
    f: 523,
    d: 1,
    t: 'Birth',
    p: p3,
  },
  {
    f: 440,
    d: 1,
    t: 'day&nbsp;',
    p: p3,
  },
  {
    f: 349,
    d: 1,
    t: 'Dear&nbsp;',
    p: p3,
  },
  {
    f: 330,
    d: 1,
    t: 'Sanan',
    p: p3,
  },
  {
    f: 294,
    d: 3,
    t: 'da',
    p: p3,
  },

  {
    f: 466,
    d: 0.5,
    t: 'Hap',
    p: p4,
  },
  {
    f: 466,
    d: 0.5,
    t: 'py&nbsp;',
    p: p4,
  },
  {
    f: 440,
    d: 1,
    t: 'Birth',
    p: p4,
  },
  {
    f: 349,
    d: 1,
    t: 'day&nbsp;',
    p: p4,
  },
  {
    f: 392,
    d: 1,
    t: 'To&nbsp;',
    p: p4,
  },
  {
    f: 349,
    d: 2,
    t: 'You',
    p: p4,
  },

  {
    f: 0,
    d: 3,
    t: '- Sounak',
    p: p5,
  },
];

//DOM
notes.map((n) => createSpan(n));

function createSpan(n) {
  n.sp = document.createElement('span');
  n.sp.innerHTML = n.t;
  n.p.appendChild(n.sp);
}

// SOUND
let speed = inputSpeed.value;
let flag = false;
let sounds = [];

class Sound {
  constructor(freq, dur, i) {
    this.stop = true;
    this.frequency = freq; // la frecuencia
    this.waveform = 'triangle'; // la forma de onda
    this.dur = dur; // la duración en segundos
    this.speed = this.dur * speed;
    this.initialGain = 0.15;
    this.index = i;
    this.sp = notes[i].sp;
  }

  cease() {
    this.stop = true;
    this.sp.classList.remove('jump');
    //this.sp.style.animationDuration = `${this.speed}s`;
    if (this.index < sounds.length - 1) {
      sounds[this.index + 1].play();
    }
    if (this.index == sounds.length - 1) {
      flag = false;
    }
  }

  play() {
    // crea un nuevo oscillator
    this.oscillator = audioCtx.createOscillator();
    // crea un nuevo nodo de ganancia
    this.gain = audioCtx.createGain();
    // establece el valor inicial del volumen del sonido
    this.gain.gain.value = this.initialGain;
    // establece el tipo de oscillator
    this.oscillator.type = this.waveform;
    // y el valor de la frecuencia
    this.oscillator.frequency.value = this.frequency;
    // el volumen del sonido baja exponencialmente
    this.gain.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + this.speed
    );
    // conecta el oscillator con el nodo de ganancia
    this.oscillator.connect(this.gain);
    // y la ganancia con el dispositivo de destino
    this.gain.connect(audioCtx.destination);
    // inicia el oscillator
    this.oscillator.start(audioCtx.currentTime);
    this.sp.setAttribute('class', 'jump');
    this.stop = false;
    // para el oscillator después de un tiempo (this.speed)
    this.oscillator.stop(audioCtx.currentTime + this.speed);
    this.oscillator.onended = () => {
      this.cease();
    };
  }
}

for (let i = 0; i < notes.length; i++) {
  let sound = new Sound(notes[i].f, notes[i].d, i);
  sounds.push(sound);
}

// EVENTS
wishes.addEventListener(
  'click',
  function (e) {
    if (e.target.id != 'inputSpeed' && !flag) {
      sounds[0].play();
      flag = true;
    }
  },
  false
);

inputSpeed.addEventListener(
  'input',
  function (e) {
    speed = this.value;
    sounds.map((s) => {
      s.speed = s.dur * speed;
    });
  },
  false
);

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let cw = (canvas.width = window.innerWidth),
  cx = cw / 2;
let ch = (canvas.height = window.innerHeight),
  cy = ch / 2;

let requestId = null;

const colors = ['#93DFB8', '#FFC8BA', '#E3AAD6', '#B5D8EB', '#FFBDD8'];

class Particle {
  constructor() {
    this.x = Math.random() * cw;
    this.y = Math.random() * ch;
    this.r = 15 + ~~(Math.random() * 20); //radius of the circumcircle
    this.l = 3 + ~~(Math.random() * 2); //polygon sides
    this.a = (2 * Math.PI) / this.l; // angle between polygon vertices
    this.rot = Math.random() * Math.PI; // polygon rotation
    this.speed = 0.05 + Math.random() / 2;
    this.rotSpeed = 0.005 + Math.random() * 0.005;
    this.color = colors[~~(Math.random() * colors.length)];
  }
  update() {
    if (this.y < -this.r) {
      this.y = ch + this.r;
      this.x = Math.random() * cw;
    }
    this.y -= this.speed;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.beginPath();
    for (let i = 0; i < this.l; i++) {
      let x = this.r * Math.cos(this.a * i);
      let y = this.r * Math.sin(this.a * i);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = this.color;
    ctx.stroke();

    ctx.restore();
  }
}

let particles = [];
for (let i = 0; i < 20; i++) {
  let p = new Particle();
  particles.push(p);
}

function Draw() {
  requestId = window.requestAnimationFrame(Draw);
  //ctx.globalAlpha=0.65;
  ctx.clearRect(0, 0, cw, ch);
  particles.map((p) => {
    p.rot += p.rotSpeed;
    p.update();
    p.draw();
  });
}

function Init() {
  if (requestId) {
    window.cancelAnimationFrame(requestId);
    requestId = null;
  }

  (cw = canvas.width = window.innerWidth), (cx = cw / 2);
  (ch = canvas.height = window.innerHeight), (cy = ch / 2);

  //particles.map((p) => p.update());
  Draw();
}

setTimeout(function () {
  Init();
  window.addEventListener('resize', Init, false);
}, 15);
