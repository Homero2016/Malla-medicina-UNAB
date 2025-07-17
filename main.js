// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbz-PJ9OSELTu1tG2hSPAST8VouWqeEc",
  authDomain: "malla-medicina-unab.firebaseapp.com",
  projectId: "malla-medicina-unab",
  storageBucket: "malla-medicina-unab.appspot.com",
  messagingSenderId: "624124095109",
  appId: "1:624124095109:web:83649db993b8f570afd7ec",
  measurementId: "G-QR06PHWGZX"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

const loginBtn = document.getElementById("loginBtn");
const mallaDiv = document.getElementById("malla");
const appContainer = document.getElementById("app");
const loginContainer = document.getElementById("login-container");
const resumen = document.getElementById("resumen");
const leyenda = document.getElementById("leyenda");

// Leyenda flotante con botón colapsable en móviles
function configurarLeyendaResponsive() {
  const leyendaBtn = document.createElement("button");
  leyendaBtn.textContent = "ℹ️ Ver leyenda";
  leyendaBtn.id = "toggleLeyenda";
  leyendaBtn.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 10000;
    background: #fff;
    color: #333;
    font-weight: bold;
    border-radius: 8px;
    padding: 8px 12px;
    border: 2px solid #3498db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 14px;
  `;
  document.body.appendChild(leyendaBtn);

  leyenda.style.position = "fixed";
  leyenda.style.top = "70px";
  leyenda.style.left = "20px";
  leyenda.style.backgroundColor = "#fff";
  leyenda.style.borderRadius = "12px";
  leyenda.style.padding = "16px";
  leyenda.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
  leyenda.style.zIndex = "9999";
  leyenda.style.width = "240px";
  leyenda.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  leyenda.style.display = "none";

  leyenda.innerHTML = `
    <h4 style="margin-bottom: 10px; font-size: 1rem;">🎨 Significado de colores</h4>
    <div class="leyenda-item"><div class="leyenda-cuadro c-aprobado" style="background-color: #2ecc71;"></div> ✅ Aprobado (ya cursado)</div>
    <div class="leyenda-item"><div class="leyenda-cuadro c-desbloqueado" style="background-color: #3498db;"></div> 📘 Desbloqueado (puedes tomarlo)</div>
    <div class="leyenda-item"><div class="leyenda-cuadro c-bloqueado" style="background-color: #bdc3c7;"></div> 🔒 Bloqueado (faltan requisitos)</div>
    <div class="leyenda-item"><div class="leyenda-cuadro c-anual" style="border: 2px dashed orange;"></div> 🔁 Anual / pendiente</div>
  `;

  leyendaBtn.onclick = () => {
    leyenda.style.display = leyenda.style.display === "none" ? "block" : "none";
  };
}

configurarLeyendaResponsive();

// Crear burbuja de créditos aprobados
const burbujaCreditos = document.createElement("div");
burbujaCreditos.id = "contadorCreditos";
burbujaCreditos.style.position = "fixed";
burbujaCreditos.style.bottom = "20px";
burbujaCreditos.style.right = "20px";
burbujaCreditos.style.background = "linear-gradient(135deg, #2575fc, #6a11cb)";
burbujaCreditos.style.color = "white";
burbujaCreditos.style.padding = "10px 18px";
burbujaCreditos.style.borderRadius = "30px";
burbujaCreditos.style.boxShadow = "0 6px 18px rgba(101, 60, 190, 0.7)";
burbujaCreditos.style.fontWeight = "700";
burbujaCreditos.style.fontSize = "15px";
burbujaCreditos.style.zIndex = "9998";
burbujaCreditos.style.userSelect = "none";
document.body.appendChild(burbujaCreditos);

// Crear burbuja flotante para PPA
const burbujaPPA = document.createElement("div");
burbujaPPA.id = "contadorPPA";
burbujaPPA.style.position = "fixed";
burbujaPPA.style.bottom = "80px";
burbujaPPA.style.right = "20px";
burbujaPPA.style.background = "linear-gradient(135deg, #f857a6, #ff5858)";
burbujaPPA.style.color = "white";
burbujaPPA.style.padding = "10px 18px";
burbujaPPA.style.borderRadius = "30px";
burbujaPPA.style.boxShadow = "0 6px 18px rgba(248, 87, 166, 0.7)";
burbujaPPA.style.fontWeight = "700";
burbujaPPA.style.fontSize = "15px";
burbujaPPA.style.zIndex = "9998";
burbujaPPA.style.userSelect = "none";
document.body.appendChild(burbujaPPA);

// Crear icono flotante para la calculadora
const iconoCalc = document.createElement("div");
iconoCalc.id = "iconoCalculadora";
iconoCalc.title = "Calculadora de promedios por ramo";
iconoCalc.textContent = "📊 Promedios";
iconoCalc.style.cssText = `
  position: fixed;
  bottom: 140px;
  right: 20px;
  background: linear-gradient(135deg, #8e44ad, #2980b9);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  box-shadow: 0 6px 18px rgba(52, 152, 219, 0.7);
  font-weight: 700;
  font-size: 16px;
  z-index: 9998;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;
iconoCalc.onmouseenter = () => {
  iconoCalc.style.transform = "scale(1.1)";
  iconoCalc.style.boxShadow = "0 8px 24px rgba(52, 152, 219, 0.9)";
};
iconoCalc.onmouseleave = () => {
  iconoCalc.style.transform = "scale(1)";
  iconoCalc.style.boxShadow = "0 6px 18px rgba(52, 152, 219, 0.7)";
};
iconoCalc.onclick = () => abrirCalculadora();
document.body.appendChild(iconoCalc);

let usuario = null;
let datosMalla = [];
let progreso = {};
let promedios = {};

// --- INICIO: Añadir burbuja de felicitación y confeti --- //

// Crear contenedor para burbuja de felicitación
const burbujaFelicitacion = document.createElement("div");
burbujaFelicitacion.id = "burbujaFelicitacion";
burbujaFelicitacion.style.position = "fixed";
burbujaFelicitacion.style.top = "30px";
burbujaFelicitacion.style.left = "50%";
burbujaFelicitacion.style.transform = "translateX(-50%)";
burbujaFelicitacion.style.background = "linear-gradient(135deg, #6a11cb, #2575fc)";
burbujaFelicitacion.style.color = "white";
burbujaFelicitacion.style.padding = "14px 28px";
burbujaFelicitacion.style.borderRadius = "30px";
burbujaFelicitacion.style.fontWeight = "700";
burbujaFelicitacion.style.fontSize = "1.25rem";
burbujaFelicitacion.style.boxShadow = "0 6px 18px rgba(101, 60, 190, 0.8)";
burbujaFelicitacion.style.zIndex = "10000";
burbujaFelicitacion.style.userSelect = "none";
burbujaFelicitacion.style.display = "none"; // Oculto al inicio
document.body.appendChild(burbujaFelicitacion);

// Crear canvas para confeti
const confetiCanvas = document.createElement("canvas");
confetiCanvas.id = "confetiCanvas";
confetiCanvas.style.position = "fixed";
confetiCanvas.style.top = "0";
confetiCanvas.style.left = "0";
confetiCanvas.style.width = "100%";
confetiCanvas.style.height = "100%";
confetiCanvas.style.pointerEvents = "none";
confetiCanvas.style.zIndex = "9999";
confetiCanvas.style.display = "none"; // Oculto al inicio
document.body.appendChild(confetiCanvas);

// Guardar qué semestres ya felicité para no repetir
let semestresFelic = {}; // se cargará de Firestore

async function cargarSemestresFelic() {
  if (!usuario) return;
  try {
    const doc = await db.collection("felicitaciones").doc(usuario.uid).get();
    if (doc.exists) {
      semestresFelic = doc.data() || {};
    } else {
      semestresFelic = {};
    }
  } catch (e) {
    console.error("Error cargando felicitaciones:", e);
  }
}

async function guardarSemestreFelic(semestre) {
  if (!usuario) return;
  semestresFelic[semestre] = true;
  try {
    await db.collection("felicitaciones").doc(usuario.uid).set(semestresFelic, { merge: true });
  } catch (e) {
    console.error("Error guardando felicitaciones:", e);
  }
}

// Detectar semestres completados y mostrar felicitación si no se ha mostrado antes
async function verificarSemestreCompletado() {
  if (!usuario) return;

  const agrupadores = [
    { titulo: "1° Semestre", incluye: [1] },
    { titulo: "2° Semestre", incluye: [2] },
    { titulo: "3° Semestre", incluye: [3] },
    { titulo: "4° Semestre", incluye: [4] },
    { titulo: "5° Semestre", incluye: [5] },
    { titulo: "6° Semestre", incluye: [6] },
    { titulo: "7° Semestre", incluye: [7] },
    { titulo: "8° Semestre", incluye: [8] },
    { titulo: "5° Año", incluye: [9, 10] },
    { titulo: "6° Año", incluye: [11, 12] },
    { titulo: "7° Año", incluye: [13, 14] },
  ];

  for (const sem of agrupadores) {
    const ramosSemestre = datosMalla.filter(ramo => {
      const s = Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre];
      return s.some(n => sem.incluye.includes(n));
    });

    const todosAprobados = ramosSemestre.every(ramo => progreso[ramo.codigo] === true);

    if (todosAprobados && !semestresFelic[sem.titulo]) {
      mostrarFelicitacion(sem.titulo);
      await guardarSemestreFelic(sem.titulo);
    }
  }
}

function mostrarFelicitacion(semestre) {
  burbujaFelicitacion.textContent = `🎉 ¡Felicidades! Completaste el ${semestre}. Sigue así 👏`;
  burbujaFelicitacion.style.display = "block";
  lanzarConfeti();

  setTimeout(() => {
    burbujaFelicitacion.style.display = "none";
  }, 6000);
}

// Confeti simple basado en canvas - código adaptado y simplificado
function lanzarConfeti() {
  const confetiCtx = confetiCanvas.getContext("2d");
  confetiCanvas.width = window.innerWidth;
  confetiCanvas.height = window.innerHeight;
  confetiCanvas.style.display = "block";

  const colors = ["#ff0a54", "#ff477e", "#ff85a1", "#fbb1b1", "#f9bec7"];
  const confetis = [];

  for (let i = 0; i < 150; i++) {
    confetis.push({
      x: Math.random() * confetiCanvas.width,
      y: Math.random() * confetiCanvas.height - confetiCanvas.height,
      r: (Math.random() * 6) + 4,
      d: Math.random() * 150 + 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleIncrement: (Math.random() * 0.07) + 0.05,
    });
  }

  let animationFrame;

  function draw() {
    confetiCtx.clearRect(0, 0, confetiCanvas.width, confetiCanvas.height);
    confetis.forEach((c) => {
      confetiCtx.beginPath();
      confetiCtx.lineWidth = c.r / 2;
      confetiCtx.strokeStyle = c.color;
      confetiCtx.moveTo(c.x + c.tilt + (c.r / 4), c.y);
      confetiCtx.lineTo(c.x + c.tilt, c.y + c.tilt + (c.r / 4));
      confetiCtx.stroke();
    });
    update();
  }

  function update() {
    confetis.forEach(c => {
      c.tiltAngle += c.tiltAngleIncrement;
      c.y += (Math.cos(c.d) + 3 + c.r / 2) / 2;
      c.x += Math.sin(c.d);
      c.tilt = Math.sin(c.tiltAngle) * 15;

      if (c.y > confetiCanvas.height) {
        c.x = Math.random() * confetiCanvas.width;
        c.y = -20;
      }
    });
  }

  function run() {
    draw();
    animationFrame = requestAnimationFrame(run);
  }
  run();

  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    confetiCanvas.style.display = "none";
  }, 6000);
}
// --- FIN: burbuja y confeti --- //


// Login Google
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
};

// Cambios en autenticación
auth.onAuthStateChanged(async (user) => {
  if (user) {
    usuario = user;
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    try {
      await cargarMalla();
      await cargarProgreso();
      await cargarSemestresFelic(); // cargar los semestres felicitados previos
      renderMalla();
      await verificarSemestreCompletado(); // verificar si hay semestre completado ahora
    } catch (e) {
      console.error("Error cargando o renderizando:", e);
    }
  } else {
    usuario = null;
    loginContainer.style.display = "block";
    appContainer.style.display = "none";
    datosMalla = [];
    progreso = {};
    promedios = {};
    semestresFelic = {};
    mallaDiv.innerHTML = "";
    resumen.textContent = "";
  }
});

// Funciones para cargar datos desde Firestore
async function cargarMalla() {
  const snapshot = await db.collection("malla").get();
  datosMalla = snapshot.docs.map(doc => doc.data());
}

async function cargarProgreso() {
  if (!usuario) return;
  const doc = await db.collection("progreso").doc(usuario.uid).get();
  progreso = doc.exists ? doc.data() : {};
  const docProm = await db.collection("promedios").doc(usuario.uid).get();
  promedios = docProm.exists ? docProm.data() : {};
}

// Guardar progreso al marcar o desmarcar ramo
async function guardarProgreso() {
  if (!usuario) return;
  try {
    await db.collection("progreso").doc(usuario.uid).set(progreso);
  } catch (e) {
    console.error("Error guardando progreso:", e);
  }
}

// Guardar promedio de ramo
async function guardarPromedio(codigo, promedio) {
  if (!usuario) return;
  promedios[codigo] = promedio;
  try {
    await db.collection("promedios").doc(usuario.uid).set(promedios);
  } catch (e) {
    console.error("Error guardando promedio:", e);
  }
}

// Renderizar malla
function renderMalla() {
  mallaDiv.innerHTML = "";
  const semestresMap = new Map();

  datosMalla.forEach(ramo => {
    const sems = Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre];
    sems.forEach(s => {
      if (!semestresMap.has(s)) semestresMap.set(s, []);
      semestresMap.get(s).push(ramo);
    });
  });

  // Ordenar semestres
  const semestresOrdenados = Array.from(semestresMap.keys()).sort((a, b) => a - b);

  semestresOrdenados.forEach(semestre => {
    const divSemestre = document.createElement("div");
    divSemestre.className = "semestre";
    divSemestre.style.marginBottom = "20px";

    const tituloSemestre = document.createElement("h3");
    tituloSemestre.textContent = `Semestre ${semestre}`;
    tituloSemestre.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tituloSemestre.style.color = "#2575fc";
    divSemestre.appendChild(tituloSemestre);

    const contenedorRamos = document.createElement("div");
    contenedorRamos.style.display = "flex";
    contenedorRamos.style.flexWrap = "wrap";
    contenedorRamos.style.gap = "8px";

    semestresMap.get(semestre).forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      divRamo.textContent = `${ramo.codigo} - ${ramo.nombre}`;
      divRamo.style.padding = "8px 14px";
      divRamo.style.borderRadius = "12px";
      divRamo.style.cursor = "pointer";
      divRamo.style.userSelect = "none";
      divRamo.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      divRamo.style.fontSize = "14px";
      divRamo.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";

      // Colores según estado
      if (progreso[ramo.codigo] === true) {
        divRamo.style.backgroundColor = "#2ecc71"; // verde aprobado
        divRamo.style.color = "white";
      } else if (ramoRequisitosCumplidos(ramo)) {
        divRamo.style.backgroundColor = "#3498db"; // azul desbloqueado
        divRamo.style.color = "white";
      } else {
        divRamo.style.backgroundColor = "#bdc3c7"; // gris bloqueado
        divRamo.style.color = "#555";
        divRamo.style.cursor = "not-allowed";
      }

      // Tooltip info (créditos, requisitos, promedio)
      divRamo.title = generarTooltip(ramo);

      // Click para marcar/desmarcar aprobado (solo si desbloqueado)
      divRamo.onclick = async () => {
        if (!ramoRequisitosCumplidos(ramo)) return; // no hace nada si bloqueado
        progreso[ramo.codigo] = !progreso[ramo.codigo];
        await guardarProgreso();
        renderMalla();
        await verificarSemestreCompletado(); // verificar si completó semestre
        actualizarBurbujaCreditos();
        actualizarBurbujaPPA();
      };

      contenedorRamos.appendChild(divRamo);
    });

    divSemestre.appendChild(contenedorRamos);
    mallaDiv.appendChild(divSemestre);
  });

  actualizarBurbujaCreditos();
  actualizarBurbujaPPA();
}

// Verifica si se cumplen requisitos para desbloquear ramo
function ramoRequisitosCumplidos(ramo) {
  if (!ramo.requisitos || ramo.requisitos.length === 0) return true;
  return ramo.requisitos.every(req => progreso[req] === true);
}

// Genera texto para tooltip
function generarTooltip(ramo) {
  const requisitos = (ramo.requisitos && ramo.requisitos.length > 0) ? ramo.requisitos.join(", ") : "Ninguno";
  const promedio = promedios[ramo.codigo] !== undefined ? promedios[ramo.codigo].toFixed(2) : "Sin promedio";
  return `Créditos: ${ramo.creditos}\nRequisitos: ${requisitos}\nPromedio: ${promedio}`;
}

// Actualizar burbuja créditos aprobados
function actualizarBurbujaCreditos() {
  let totalCreditos = 0;
  datosMalla.forEach(ramo => {
    if (progreso[ramo.codigo] === true) totalCreditos += ramo.creditos;
  });
  burbujaCreditos.textContent = `Créditos Aprobados: ${totalCreditos}`;
}

// Calcular PPA (promedio ponderado acumulado)
function calcularPPA() {
  let sumaPesos = 0;
  let sumaProductos = 0;
  datosMalla.forEach(ramo => {
    if (progreso[ramo.codigo] === true && promedios[ramo.codigo] !== undefined) {
      sumaPesos += ramo.creditos;
      sumaProductos += promedios[ramo.codigo] * ramo.creditos;
    }
  });
  return sumaPesos > 0 ? sumaProductos / sumaPesos : 0;
}

// Actualizar burbuja PPA
function actualizarBurbujaPPA() {
  const ppa = calcularPPA();
  if (ppa > 0) {
    burbujaPPA.textContent = `PPA: ${ppa.toFixed(2)}`;
    burbujaPPA.style.display = "block";
  } else {
    burbujaPPA.style.display = "none";
  }
}

// --- Calculadora de promedios (modal simple) ---
function abrirCalculadora() {
  if (document.getElementById("modalCalculadora")) return;

  const modal = document.createElement("div");
  modal.id = "modalCalculadora";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "10001";

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 24px;
      border-radius: 16px;
      width: 320px;
      max-width: 90vw;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 4px 20px rgba(0,0,0,0.2);
      ">
      <h2 style="margin-top:0; font-size: 1.5rem;">Calculadora de Promedios</h2>
      <label>Ramo (código): <input type="text" id="calcCodigo" style="width: 100%; padding: 6px; margin-bottom: 12px;" placeholder="Ej: BIO101"></label>
      <div id="pruebasContainer" style="max-height: 150px; overflow-y: auto; margin-bottom: 12px;"></div>
      <button id="agregarPruebaBtn" style="
        background: #2980b9;
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        margin-bottom: 12px;
      ">Agregar prueba</button>
      <div style="margin-bottom: 12px;">
        <strong>Promedio actual: </strong><span id="promedioCalculado">0.00</span>
      </div>
      <button id="guardarPromedioBtn" style="
        background: #27ae60;
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        font-weight: 700;
      ">Guardar Promedio</button>
      <button id="cerrarModalBtn" style="
        background: #e74c3c;
        color: white;
        border: none;
        padding: 10px 14px;
        border-radius: 8px;
        cursor: pointer;
        width: 100%;
        margin-top: 8px;
        font-weight: 700;
      ">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);

  const pruebasContainer = modal.querySelector("#pruebasContainer");
  const promedioCalculado = modal.querySelector("#promedioCalculado");
  const calcCodigoInput = modal.querySelector("#calcCodigo");

  // Agrega prueba
  modal.querySelector("#agregarPruebaBtn").onclick = () => {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "8px";
    div.style.marginBottom = "6px";
    div.style.alignItems = "center";

    div.innerHTML = `
      <input type="text" placeholder="Nombre prueba" style="flex:2; padding: 6px;" />
      <input type="number" placeholder="Nota (0-100)" min="0" max="100" style="flex:1; padding: 6px;" />
      <input type="number" placeholder="Peso (%)" min="0" max="100" style="flex:1; padding: 6px;" />
      <button style="background:#e74c3c; color:white; border:none; border-radius:6px; cursor:pointer; flex:0 0 30px;">X</button>
    `;

    const btnEliminar = div.querySelector("button");
    btnEliminar.onclick = () => {
      div.remove();
      calcularYPintarPromedio();
    };

    const inputs = div.querySelectorAll("input");
    inputs.forEach(input => input.oninput = calcularYPintarPromedio);

    pruebasContainer.appendChild(div);
  };

  // Carga datos previos si existen
  function cargarDatosPrevios() {
    const codigo = calcCodigoInput.value.trim();
    if (codigo && promedios[codigo] !== undefined) {
      // No guardamos pruebas previas, solo promedio total.
      promedioCalculado.textContent = promedios[codigo].toFixed(2);
    } else {
      promedioCalculado.textContent = "0.00";
    }
  }

  calcCodigoInput.oninput = () => {
    pruebasContainer.innerHTML = "";
    cargarDatosPrevios();
  };

  // Calcula promedio basado en pruebas
  function calcularYPintarPromedio() {
    const pruebas = Array.from(pruebasContainer.children).map(div => {
      const inputs = div.querySelectorAll("input");
      const nombre = inputs[0].value.trim();
      const nota = parseFloat(inputs[1].value);
      const peso = parseFloat(inputs[2].value);
      if (!nombre || isNaN(nota) || isNaN(peso) || nota < 0 || nota > 100 || peso <= 0) return null;
      return { nombre, nota, peso };
    }).filter(p => p !== null);

    const totalPeso = pruebas.reduce((acc, cur) => acc + cur.peso, 0);
    if (totalPeso <= 0) {
      promedioCalculado.textContent = "0.00";
      return;
    }
    const promedio = pruebas.reduce((acc, cur) => acc + (cur.nota * (cur.peso / 100)), 0);
    promedioCalculado.textContent = promedio.toFixed(2);
  }

  modal.querySelector("#guardarPromedioBtn").onclick = async () => {
    const codigo = calcCodigoInput.value.trim();
    if (!codigo) {
      alert("Ingrese el código del ramo");
      return;
    }
    const promedio = parseFloat(promedioCalculado.textContent);
    if (isNaN(promedio) || promedio <= 0) {
      alert("Ingrese pruebas válidas para calcular el promedio");
      return;
    }
    await guardarPromedio(codigo, promedio);
    alert(`Promedio para ${codigo} guardado: ${promedio.toFixed(2)}`);
    actualizarBurbujaPPA();
    renderMalla();
    modal.remove();
  };

  modal.querySelector("#cerrarModalBtn").onclick = () => {
    modal.remove();
  };
}
// Crear div para tooltip custom
const tooltip = document.createElement("div");
tooltip.id = "tooltipInfo";
tooltip.style.position = "fixed";
tooltip.style.background = "rgba(0,0,0,0.8)";
tooltip.style.color = "white";
tooltip.style.padding = "8px 12px";
tooltip.style.borderRadius = "8px";
tooltip.style.fontSize = "13px";
tooltip.style.pointerEvents = "none";
tooltip.style.zIndex = "10000";
tooltip.style.maxWidth = "260px";
tooltip.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
tooltip.style.display = "none";
tooltip.style.transition = "opacity 0.2s ease";
tooltip.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
document.body.appendChild(tooltip);

// Función para mostrar tooltip con contenido y posición
function mostrarTooltip(event, contenido) {
  tooltip.innerHTML = contenido.replace(/\n/g, "<br>");
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";

  // Posicionar tooltip cerca del mouse, ajustando para no salirse de pantalla
  const padding = 12;
  let x = event.clientX + padding;
  let y = event.clientY + padding;

  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  if (x + tooltipRect.width + padding > viewportWidth) {
    x = event.clientX - tooltipRect.width - padding;
  }
  if (y + tooltipRect.height + padding > viewportHeight) {
    y = event.clientY - tooltipRect.height - padding;
  }

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

// Función para ocultar tooltip
function ocultarTooltip() {
  tooltip.style.opacity = "0";
  setTimeout(() => {
    tooltip.style.display = "none";
  }, 200);
}

// Modificar renderMalla para manejar tooltip custom
function renderMalla() {
  mallaDiv.innerHTML = "";
  const semestresMap = new Map();

  datosMalla.forEach(ramo => {
    const sems = Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre];
    sems.forEach(s => {
      if (!semestresMap.has(s)) semestresMap.set(s, []);
      semestresMap.get(s).push(ramo);
    });
  });

  const semestresOrdenados = Array.from(semestresMap.keys()).sort((a, b) => a - b);

  semestresOrdenados.forEach(semestre => {
    const divSemestre = document.createElement("div");
    divSemestre.className = "semestre";
    divSemestre.style.marginBottom = "20px";

    const tituloSemestre = document.createElement("h3");
    tituloSemestre.textContent = `Semestre ${semestre}`;
    tituloSemestre.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    tituloSemestre.style.color = "#2575fc";
    divSemestre.appendChild(tituloSemestre);

    const contenedorRamos = document.createElement("div");
    contenedorRamos.style.display = "flex";
    contenedorRamos.style.flexWrap = "wrap";
    contenedorRamos.style.gap = "8px";

    semestresMap.get(semestre).forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      divRamo.textContent = `${ramo.codigo} - ${ramo.nombre}`;
      divRamo.style.padding = "8px 14px";
      divRamo.style.borderRadius = "12px";
      divRamo.style.cursor = "pointer";
      divRamo.style.userSelect = "none";
      divRamo.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
      divRamo.style.fontSize = "14px";
      divRamo.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";

      if (progreso[ramo.codigo] === true) {
        divRamo.style.backgroundColor = "#2ecc71";
        divRamo.style.color = "white";
      } else if (ramoRequisitosCumplidos(ramo)) {
        divRamo.style.backgroundColor = "#3498db";
        divRamo.style.color = "white";
      } else {
        divRamo.style.backgroundColor = "#bdc3c7";
        divRamo.style.color = "#555";
        divRamo.style.cursor = "not-allowed";
      }

      // Removemos el tooltip nativo
      divRamo.removeAttribute("title");

      // Mostrar tooltip custom al pasar mouse
      divRamo.addEventListener("mousemove", (e) => {
        mostrarTooltip(e, generarTooltip(ramo));
      });
      divRamo.addEventListener("mouseleave", ocultarTooltip);

      // En móviles, mostrar tooltip al tocar (y ocultar después)
      divRamo.addEventListener("touchstart", (e) => {
        e.preventDefault();
        mostrarTooltip(e.touches[0], generarTooltip(ramo));
      });
      divRamo.addEventListener("touchend", () => {
        setTimeout(ocultarTooltip, 3000);
      });

      divRamo.onclick = async () => {
        if (!ramoRequisitosCumplidos(ramo)) return;
        progreso[ramo.codigo] = !progreso[ramo.codigo];
        await guardarProgreso();
        renderMalla();
        await verificarSemestreCompletado();
        actualizarBurbujaCreditos();
        actualizarBurbujaPPA();
      };

      contenedorRamos.appendChild(divRamo);
    });

    divSemestre.appendChild(contenedorRamos);
    mallaDiv.appendChild(divSemestre);
  });

  actualizarBurbujaCreditos();
  actualizarBurbujaPPA();
}
