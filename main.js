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

// --- INICIO: Añadir burbuja de felicitación y confeti ---

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
burbujaFelicitacion.style.display = "none";
document.body.appendChild(burbujaFelicitacion);

const confetiCanvas = document.createElement("canvas");
confetiCanvas.id = "confetiCanvas";
confetiCanvas.style.position = "fixed";
confetiCanvas.style.top = "0";
confetiCanvas.style.left = "0";
confetiCanvas.style.width = "100%";
confetiCanvas.style.height = "100%";
confetiCanvas.style.pointerEvents = "none";
confetiCanvas.style.zIndex = "9999";
confetiCanvas.style.display = "none";
document.body.appendChild(confetiCanvas);

let semestresFelic = {};

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
    { titulo: "9° Semestre", incluye: [9] },
    { titulo: "10° Semestre", incluye: [10] },
    { titulo: "11° Semestre", incluye: [11] },
    { titulo: "12° Semestre", incluye: [12] },
    { titulo: "13° Semestre", incluye: [13] },
    { titulo: "14° Semestre", incluye: [14] }
  ];

  for (const grupo of agrupadores) {
    if (semestresFelic[grupo.titulo]) continue; // ya felicitado

    // Verificar si todos los ramos del semestre están aprobados
    let completado = true;
    for (const ramo of datosMalla) {
      if (grupo.incluye.includes(ramo.semestre)) {
        if (!progreso[ramo.codigo]) {
          completado = false;
          break;
        }
      }
    }

    if (completado) {
      mostrarFelicitacion(`¡Felicitaciones! Has completado el ${grupo.titulo}`);
      await guardarSemestreFelic(grupo.titulo);
      break; // sólo una felicitación a la vez
    }
  }
}

function mostrarFelicitacion(mensaje) {
  burbujaFelicitacion.textContent = mensaje;
  burbujaFelicitacion.style.display = "block";
  confetiCanvas.style.display = "block";
  iniciarConfeti();

  setTimeout(() => {
    burbujaFelicitacion.style.display = "none";
    confetiCanvas.style.display = "none";
    detenerConfeti();
  }, 7000);
}

// --- Fin felicitación y confeti ---

// Crear tooltip para créditos, requisitos y promedios
const tooltip = document.createElement("div");
tooltip.style.position = "fixed";
tooltip.style.background = "rgba(0,0,0,0.8)";
tooltip.style.color = "white";
tooltip.style.padding = "8px 14px";
tooltip.style.borderRadius = "12px";
tooltip.style.fontSize = "13px";
tooltip.style.pointerEvents = "none";
tooltip.style.transition = "opacity 0.15s ease";
tooltip.style.zIndex = "10000";
tooltip.style.maxWidth = "280px";
tooltip.style.opacity = "0";
tooltip.style.display = "none";
document.body.appendChild(tooltip);

// Variables para almacenar los datos del usuario y progreso
let totalCreditosAprobados = 0;

// Función para mostrar el tooltip
function mostrarTooltip(event, contenido) {
  if (appContainer.style.display === "none") return; // No mostrar si no logueado

  tooltip.innerHTML = contenido.replace(/\n/g, "<br>");
  tooltip.style.display = "block";
  tooltip.style.opacity = "1";

  let x = event.clientX + 15;
  let y = event.clientY + 15;

  const tooltipRect = tooltip.getBoundingClientRect();
  const width = tooltipRect.width;
  const height = tooltipRect.height;

  if (x + width > window.innerWidth) x = event.clientX - width - 15;
  if (y + height > window.innerHeight) y = event.clientY - height - 15;

  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";
}

// Función para ocultar tooltip
function ocultarTooltip() {
  tooltip.style.opacity = "0";
  setTimeout(() => {
    tooltip.style.display = "none";
  }, 150);
}

// Función para cargar la malla desde Firebase
async function cargarMalla() {
  try {
    const snapshot = await db.collection("malla_medicina").orderBy("semestre").get();
    datosMalla = snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error al cargar la malla:", error);
  }
}

// Función para cargar el progreso del usuario
async function cargarProgreso() {
  if (!usuario) return;
  try {
    const doc = await db.collection("progreso_medicina").doc(usuario.uid).get();
    if (doc.exists) {
      const data = doc.data();
      progreso = data.progreso || {};
      promedios = data.promedios || {};
    } else {
      progreso = {};
      promedios = {};
    }
  } catch (error) {
    console.error("Error al cargar progreso:", error);
  }
}

// Función para guardar progreso
async function guardarProgreso() {
  if (!usuario) return;
  try {
    await db.collection("progreso_medicina").doc(usuario.uid).set({
      progreso,
      promedios
    }, { merge: true });
  } catch (error) {
    console.error("Error al guardar progreso:", error);
  }
}

// Función para renderizar la malla en el DOM
function renderMalla() {
  mallaDiv.innerHTML = "";

  // Agrupar por semestre
  const semestres = {};
  datosMalla.forEach(ramo => {
    if (!semestres[ramo.semestre]) semestres[ramo.semestre] = [];
    semestres[ramo.semestre].push(ramo);
  });

  for (const semestre in semestres) {
    const divSem = document.createElement("div");
    divSem.className = "semestre";
    divSem.style.border = "1px solid #ccc";
    divSem.style.borderRadius = "12px";
    divSem.style.margin = "10px 0";
    divSem.style.padding = "10px";
    divSem.style.backgroundColor = "#f9f9f9";

    const titulo = document.createElement("h3");
    titulo.textContent = `Semestre ${semestre}`;
    titulo.style.marginBottom = "12px";
    titulo.style.color = "#333";
    divSem.appendChild(titulo);

    semestres[semestre].forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.className = "ramo";
      divRamo.textContent = `${ramo.codigo} - ${ramo.nombre}`;
      divRamo.style.padding = "6px 10px";
      divRamo.style.marginBottom = "6px";
      divRamo.style.borderRadius = "8px";
      divRamo.style.cursor = "pointer";
      divRamo.style.userSelect = "none";

      // Determinar estado y color
      if (progreso[ramo.codigo]) {
        divRamo.style.backgroundColor = "#2ecc71"; // Verde aprobado
        divRamo.style.color = "white";
      } else if (seCumplenRequisitos(ramo)) {
        divRamo.style.backgroundColor = "#3498db"; // Azul desbloqueado
        divRamo.style.color = "white";
      } else {
        divRamo.style.backgroundColor = "#bdc3c7"; // Gris bloqueado
        divRamo.style.color = "#444";
      }

      // Al pasar mouse mostrar tooltip
      divRamo.addEventListener("mouseenter", (event) => {
        const texto = generarTooltipTexto(ramo);
        mostrarTooltip(event, texto);
      });
      divRamo.addEventListener("mousemove", (event) => {
        mostrarTooltip(event, generarTooltipTexto(ramo));
      });
      divRamo.addEventListener("mouseleave", ocultarTooltip);

      // Click para marcar/desmarcar aprobado
      divRamo.addEventListener("click", () => {
        if (progreso[ramo.codigo]) {
          delete progreso[ramo.codigo];
          delete promedios[ramo.codigo];
        } else {
          if (seCumplenRequisitos(ramo)) {
            progreso[ramo.codigo] = true;
            if (!promedios[ramo.codigo]) {
              promedios[ramo.codigo] = 4.0; // Promedio por defecto
            }
          } else {
            alert("No puedes marcar este ramo como aprobado, faltan requisitos.");
            return;
          }
        }
        guardarProgreso();
        renderMalla();
        actualizarCreditosYPromedio();
        verificarSemestreCompletado();
      });

      divSem.appendChild(divRamo);
    });

    mallaDiv.appendChild(divSem);
  }
}

// Función para verificar si se cumplen requisitos para un ramo
function seCumplenRequisitos(ramo) {
  if (!ramo.requisitos || ramo.requisitos.length === 0) return true;

  return ramo.requisitos.every(req => progreso[req]);
}

// Función para generar el texto del tooltip
function generarTooltipTexto(ramo) {
  const creditos = ramo.creditos || 0;
  const requisitos = ramo.requisitos && ramo.requisitos.length > 0 ? ramo.requisitos.join(", ") : "Ninguno";
  const promedio = promedios[ramo.codigo] !== undefined ? promedios[ramo.codigo].toFixed(2) : "N/A";

  return `
    Créditos: ${creditos}
    Requisitos: ${requisitos}
    Promedio: ${promedio}
  `;
}

// Actualizar contador de créditos y PPA
function actualizarCreditosYPromedio() {
  let sumaCreditos = 0;
  let sumaPonderada = 0;

  for (const ramoCodigo in progreso) {
    const ramo = datosMalla.find(r => r.codigo === ramoCodigo);
    if (ramo) {
      const creditos = ramo.creditos || 0;
      const promedio = promedios[ramoCodigo] || 0;
      sumaCreditos += creditos;
      sumaPonderada += promedio * creditos;
    }
  }

  totalCreditosAprobados = sumaCreditos;
  burbujaCreditos.textContent = `Créditos aprobados: ${sumaCreditos}`;
  const ppa = sumaCreditos ? (sumaPonderada / sumaCreditos).toFixed(2) : "0.00";
  burbujaPPA.textContent = `PPA: ${ppa}`;
}

// --- Calculadora de Promedios ---

function abrirCalculadora() {
  if (document.getElementById("modalCalc")) return; // ya abierta

  const modal = document.createElement("div");
  modal.id = "modalCalc";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0,0,0,0.6)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "10001";

  modal.innerHTML = `
    <div style="background:#fff; border-radius:12px; padding:24px; max-width:400px; width:90%; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <h2 style="margin-top:0; color:#3498db;">Calculadora de Promedios</h2>
      <label for="inputRamo">Código ramo:</label>
      <input type="text" id="inputRamo" style="width:100%; padding:8px; margin-bottom:12px;" placeholder="Ej: ANAT101" />
      <div id="pruebasContainer"></div>
      <button id="agregarPruebaBtn" style="margin-bottom:12px; background:#3498db; color:white; padding:8px 12px; border:none; border-radius:8px; cursor:pointer;">Agregar prueba</button>
      <div style="display:flex; justify-content: space-between; align-items:center;">
        <button id="calcularPromedioBtn" style="background:#2ecc71; color:white; padding:8px 12px; border:none; border-radius:8px; cursor:pointer;">Calcular</button>
        <button id="cerrarModalBtn" style="background:#e74c3c; color:white; padding:8px 12px; border:none; border-radius:8px; cursor:pointer;">Cerrar</button>
      </div>
      <div id="resultadoPromedio" style="margin-top:16px; font-weight:bold; font-size:1.1rem;"></div>
    </div>
  `;

  document.body.appendChild(modal);

  const pruebasContainer = modal.querySelector("#pruebasContainer");
  const inputRamo = modal.querySelector("#inputRamo");
  const agregarPruebaBtn = modal.querySelector("#agregarPruebaBtn");
  const calcularPromedioBtn = modal.querySelector("#calcularPromedioBtn");
  const cerrarModalBtn = modal.querySelector("#cerrarModalBtn");
  const resultadoPromedio = modal.querySelector("#resultadoPromedio");

  function agregarPrueba(carga = "", peso = "") {
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <input type="number" class="nota" placeholder="Nota (0-7)" min="0" max="7" step="0.01" style="width:48%; padding:6px;" value="${carga}" />
      <input type="number" class="peso" placeholder="% Peso" min="0" max="100" step="0.01" style="width:48%; padding:6px; margin-left:4%;" value="${peso}" />
    `;
    pruebasContainer.appendChild(div);
  }

  agregarPrueba();

  agregarPruebaBtn.onclick = () => agregarPrueba();

  calcularPromedioBtn.onclick = () => {
    const notas = Array.from(pruebasContainer.querySelectorAll(".nota")).map(i => parseFloat(i.value));
    const pesos = Array.from(pruebasContainer.querySelectorAll(".peso")).map(i => parseFloat(i.value));
    const ramoCod = inputRamo.value.trim().toUpperCase();

    if (!ramoCod) {
      alert("Debes ingresar un código de ramo válido.");
      return;
    }

    if (notas.some(n => isNaN(n) || n < 0 || n > 7) || pesos.some(p => isNaN(p) || p < 0 || p > 100)) {
      alert("Las notas deben estar entre 0 y 7 y los pesos entre 0 y 100.");
      return;
    }

    const sumaPesos = pesos.reduce((a,b) => a+b, 0);
    if (sumaPesos <= 0) {
      alert("La suma de pesos debe ser mayor que 0.");
      return;
    }

    let promedio = 0;
    for (let i = 0; i < notas.length; i++) {
      promedio += (notas[i] * (pesos[i] / sumaPesos));
    }
    promedio = promedio.toFixed(2);

    resultadoPromedio.textContent = `Promedio calculado para ${ramoCod}: ${promedio}`;

    // Guardar promedio y actualizar UI
    promedios[ramoCod] = parseFloat(promedio);
    guardarProgreso();
    renderMalla();
    actualizarCreditosYPromedio();
  };

  cerrarModalBtn.onclick = () => {
    modal.remove();
  };
}

// Función para ocultar todos los elementos de la app y mostrar solo login
function ocultarElementosApp() {
  appContainer.style.display = "none";
  loginContainer.style.display = "block";
  burbujaCreditos.style.display = "none";
  burbujaPPA.style.display = "none";
  iconoCalc.style.display = "none";
  leyenda.style.display = "none";
  tooltip.style.display = "none";
  burbujaFelicitacion.style.display = "none";
  confetiCanvas.style.display = "none";
}

// Al inicio ocultamos todo excepto login
ocultarElementosApp();

// Manejo del login con Firebase
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Ingresa email y contraseña.");
    return;
  }

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    alert("Error al iniciar sesión: " + error.message);
  }
});

// Estado de autenticación
auth.onAuthStateChanged(async (user) => {
  console.log("Auth State Changed:", user);
  if (user) {
    usuario = user;
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    burbujaCreditos.style.display = "block";
    burbujaPPA.style.display = "block";
    iconoCalc.style.display = "flex";
    leyenda.style.display = "block";

    try {
      await cargarMalla();
      await cargarProgreso();
      await cargarSemestresFelic();
      renderMalla();
      actualizarCreditosYPromedio();
      await verificarSemestreCompletado();
    } catch (error) {
      console.error("Error en carga o renderizado:", error);
    }
  } else {
    usuario = null;
    ocultarElementosApp();
    datosMalla = [];
    progreso = {};
    promedios = {};
    semestresFelic = {};
    mallaDiv.innerHTML = "";
    resumen.textContent = "";
  }
});

// --- Código para confeti ---

let confetiCtx;
let confetiParticles = [];
let confetiAnimationId;

function iniciarConfeti() {
  confetiCanvas.width = window.innerWidth;
  confetiCanvas.height = window.innerHeight;
  confetiCtx = confetiCanvas.getContext("2d");

  confetiParticles = [];
  const colores = ["#FFC700", "#FF0000", "#2E3192", "#41BBC7", "#E94368", "#16A085", "#3498DB", "#9B59B6"];
  for (let i = 0; i < 150; i++) {
    confetiParticles.push({
      x: Math.random() * confetiCanvas.width,
      y: Math.random() * confetiCanvas.height - confetiCanvas.height,
      r: (Math.random() * 6) + 4,
      d: (Math.random() * 30) + 10,
      color: colores[Math.floor(Math.random() * colores.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngle: 0,
      tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
    });
  }
  animarConfeti();
}

function animarConfeti() {
  confetiCtx.clearRect(0, 0, confetiCanvas.width, confetiCanvas.height);
  confetiParticles.forEach((p) => {
    confetiCtx.beginPath();
    confetiCtx.lineWidth = p.r / 2;
    confetiCtx.strokeStyle = p.color;
    confetiCtx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
    confetiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
    confetiCtx.stroke();

    p.tiltAngle += p.tiltAngleIncremental;
    p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
    p.x += Math.sin(p.d);
    p.tilt = Math.sin(p.tiltAngle) * 15;

    if (p.y > confetiCanvas.height) {
      p.x = Math.random() * confetiCanvas.width;
      p.y = -10;
      p.tilt = Math.floor(Math.random() * 10) - 10;
    }
  });

  confetiAnimationId = requestAnimationFrame(animarConfeti);
}

function detenerConfeti() {
  cancelAnimationFrame(confetiAnimationId);
  confetiCtx.clearRect(0, 0, confetiCanvas.width, confetiCanvas.height);
}

// DEBUG móvil
if (/Mobi|Android/i.test(navigator.userAgent)) {
  console.log("Modo móvil detectado");
}
