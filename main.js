// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbz-PJ9OSELTu1tTg2hSPAST8VouWqeEc",
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

let usuario = null;
let datosMalla = [];
let progreso = {};
let promedios = {};

let burbujaCreditos = null;
let burbujaPPA = null;
let iconoCalc = null;
let tooltip = null;
let leyendaBtn = null;

// Login Google
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithRedirect(provider);
};

// Confeti para felicitación
function lanzarConfeti() {
  // Usa la librería confetti.js o una implementación sencilla
  // Aquí un ejemplo simple usando canvas con confetti.js (debes agregar la librería en tu HTML)
  if (window.confetti) {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } else {
    console.warn("Confetti no está cargado. Incluye la librería confetti.js para la animación.");
  }
}

// Detecta si completó un semestre y lanza confeti
let semestresCompletadosPrev = new Set();
function checkSemestresCompletados() {
  // Agrupadores igual que en renderMalla
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

  agrupadores.forEach(({ titulo, incluye }) => {
    const ramosSemestre = datosMalla.filter(r => {
      const s = Array.isArray(r.semestre) ? r.semestre : [r.semestre];
      return s.some(sem => incluye.includes(sem));
    });

    const completado = ramosSemestre.every(r => progreso[r.codigo]);
    if (completado && !semestresCompletadosPrev.has(titulo)) {
      semestresCompletadosPrev.add(titulo);
      alert(`🎉 ¡Felicitaciones! Has completado el ${titulo}.`);
      lanzarConfeti();
    }
  });
}

// Función para crear los elementos UI que deben aparecer SOLO con login
function crearElementosUI() {
  if (!leyendaBtn) {
    leyendaBtn = document.createElement("button");
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
      cursor: pointer;
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

  if (!burbujaCreditos) {
    burbujaCreditos = document.createElement("div");
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
  }

  if (!burbujaPPA) {
    burbujaPPA = document.createElement("div");
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
  }

  if (!iconoCalc) {
    iconoCalc = document.createElement("div");
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
  }

  if (!tooltip) {
    tooltip = document.createElement("div");
    tooltip.id = "tooltipPromedios";
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0,0,0,0.75)";
    tooltip.style.color = "white";
    tooltip.style.padding = "6px 10px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "13px";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    tooltip.style.zIndex = "9999";
    document.body.appendChild(tooltip);
  }
}

// Función para eliminar elementos UI al cerrar sesión
function eliminarElementosUI() {
  if (leyendaBtn) {
    leyendaBtn.remove();
    leyendaBtn = null;
  }
  leyenda.style.display = "none";

  if (burbujaCreditos) {
    burbujaCreditos.remove();
    burbujaCreditos = null;
  }
  if (burbujaPPA) {
    burbujaPPA.remove();
    burbujaPPA = null;
  }
  if (iconoCalc) {
    iconoCalc.remove();
    iconoCalc = null;
  }
  if (tooltip) {
    tooltip.remove();
    tooltip = null;
  }
}

// Cambios en autenticación
auth.onAuthStateChanged(async (user) => {
  if (user) {
    usuario = user;
    loginContainer.style.display = "none";
    appContainer.style.display = "block";

    crearElementosUI();

    try {
      await cargarMalla();
      await cargarProgreso();
      renderMalla();
      checkSemestresCompletados();
    } catch (e) {
      console.error("Error cargando o renderizando:", e);
    }
  } else {
    usuario = null;
    loginContainer.style.display = "block";
    appContainer.style.display = "none";

    eliminarElementosUI();

    datosMalla = [];
    progreso = {};
    promedios = {};
    semestresCompletadosPrev.clear();
  }
});

// Cargar JSON malla
async function cargarMalla() {
  try {
    const res = await fetch("data/malla.json");
    datosMalla = await res.json();
  } catch (error) {
    console.error("Error cargando malla:", error);
    datosMalla = [];
  }
}

// Cargar progreso y promedios del usuario
async function cargarProgreso() {
  if (!usuario) return (progreso = {}, promedios = {});
  try {
    const ref = db.collection("progresos").doc(usuario.uid);
    const snap = await ref.get();
    if (snap.exists) {
      const data = snap.data();
      progreso = data.progreso || {};
      promedios = data.promedios || {};
    } else {
      progreso = {};
      promedios = {};
    }
  } catch (error) {
    console.error("Error cargando progreso:", error);
    progreso = {};
    promedios = {};
  }
}

// Contar créditos aprobados
function contarCreditosAprobados(ramos, aprobados) {
  return ramos
    .filter(r => aprobados.includes(r.codigo))
    .reduce((suma, r) => suma + r.creditos, 0);
}

// Actualizar burbuja créditos
function actualizarBurbujaCreditos(aprobados, ramos) {
  const total = contarCreditosAprobados(ramos, aprobados);
  if (burbujaCreditos) {
    burbujaCreditos.textContent = `${total} créditos aprobados`;
  }
}

// Ver si ramo está aprobado
function estaAprobado(ramo, progreso) {
  return progreso[ramo.codigo] === true;
}

// Calcular y mostrar PPA (Promedio Ponderado Acumulado)
function calcularYMostrarPPA() {
  let sumaNotasPorCreditos = 0;
  let sumaCreditos = 0;
  for (const ramo of datosMalla) {
    if (progreso[ramo.codigo] && promedios[ramo.codigo] && promedios[ramo.codigo].promedio) {
      const promedio = parseFloat(promedios[ramo.codigo].promedio);
      if (!isNaN(promedio)) {
        sumaNotasPorCreditos += promedio * ramo.creditos;
        sumaCreditos += ramo.creditos;
      }
    }
  }
  if (sumaCreditos > 0 && burbujaPPA) {
    const ppa = (sumaNotasPorCreditos / sumaCreditos).toFixed(2);
    burbujaPPA.textContent = `PPA: ${ppa}`;
  } else if (burbujaPPA) {
    burbujaPPA.textContent = `PPA: --`;
  }
}

// Mostrar tooltip con promedio si existe
function mostrarTooltip(e, texto) {
  if (!tooltip) return;
  const codigo = e.target.textContent.split(" - ")[0];
  if (promedios[codigo]) {
    texto += `\nPromedio: ${promedios[codigo].promedio || "--"}`;
  }
  tooltip.innerText = texto;
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.display = "block";
}

// Ocultar tooltip
function ocultarTooltip() {
  if (tooltip) tooltip.style.display = "none";
}

// Renderizar la malla por semestre
function renderMalla() {
  mallaDiv.innerHTML = "";
  if (!datosMalla.length) return;

  // Agrupar ramos por semestre (o años)
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

  agrupadores.forEach(({ titulo, incluye }) => {
    const contenedorSemestre = document.createElement("div");
    contenedorSemestre.className = "semestre-contenedor";
    const tituloSemestre = document.createElement("h2");
    tituloSemestre.textContent = titulo;
    contenedorSemestre.appendChild(tituloSemestre);

    const ramosSemestre = datosMalla.filter(r => {
      const s = Array.isArray(r.semestre) ? r.semestre : [r.semestre];
      return s.some(sem => incluye.includes(sem));
    });

    if (ramosSemestre.length === 0) {
      const noRamos = document.createElement("p");
      noRamos.textContent = "No hay ramos para este semestre";
      contenedorSemestre.appendChild(noRamos);
    }

    ramosSemestre.forEach(ramo => {
      const ramoDiv = document.createElement("div");
      ramoDiv.className = "ramo";

      // Color según estado
      if (estaAprobado(ramo, progreso)) {
        ramoDiv.classList.add("c-aprobado");
      } else if (sePuedeTomar(ramo)) {
        ramoDiv.classList.add("c-desbloqueado");
      } else {
        ramoDiv.classList.add("c-bloqueado");
      }

      ramoDiv.textContent = `${ramo.codigo} - ${ramo.nombre}`;

      // Tooltip con créditos y requisitos
      ramoDiv.onmouseenter = (e) => {
        let texto = `Créditos: ${ramo.creditos}\nRequisitos: `;
        if (ramo.requisitos && ramo.requisitos.length > 0) {
          texto += ramo.requisitos.join(", ");
        } else {
          texto += "Ninguno";
        }
        mostrarTooltip(e, texto);
      };
      ramoDiv.onmousemove = (e) => {
        if (tooltip) {
          tooltip.style.top = `${e.pageY + 10}px`;
          tooltip.style.left = `${e.pageX + 10}px`;
        }
      };
      ramoDiv.onmouseleave = () => {
        ocultarTooltip();
      };

      // Click para marcar/desmarcar aprobado
      ramoDiv.onclick = () => {
        if (!usuario) return alert("Debes iniciar sesión para marcar ramos.");
        const codigo = ramo.codigo;
        if (progreso[codigo]) {
          delete progreso[codigo];
          delete promedios[codigo];
        } else {
          progreso[codigo] = true;
        }
        guardarProgreso();
        renderMalla();
        actualizarBurbujaCreditos(Object.keys(progreso), datosMalla);
        calcularYMostrarPPA();
        checkSemestresCompletados();
      };

      contenedorSemestre.appendChild(ramoDiv);
    });

    mallaDiv.appendChild(contenedorSemestre);
  });

  // Actualizar burbuja créditos y PPA
  actualizarBurbujaCreditos(Object.keys(progreso), datosMalla);
  calcularYMostrarPPA();
}

// Verificar si puede tomar el ramo (cumple requisitos)
function sePuedeTomar(ramo) {
  if (!ramo.requisitos || ramo.requisitos.length === 0) return true;
  return ramo.requisitos.every(req => progreso[req]);
}

// Guardar progreso y promedios en Firestore
async function guardarProgreso() {
  if (!usuario) return;
  try {
    await db.collection("progresos").doc(usuario.uid).set({
      progreso,
      promedios,
    });
  } catch (error) {
    console.error("Error guardando progreso:", error);
  }
}

// Abrir la calculadora (puedes ajustar la UI a tu gusto)
function abrirCalculadora() {
  // Ejemplo simple prompt para editar promedio por ramo
  const codigo = prompt("Ingrese código del ramo para asignar/modificar promedio:");
  if (!codigo) return;
  const ramoExiste = datosMalla.some(r => r.codigo === codigo);
  if (!ramoExiste) {
    alert("Código de ramo no encontrado.");
    return;
  }
  const valor = prompt("Ingrese promedio (0 a 7, con decimales):");
  const numValor = parseFloat(valor);
  if (isNaN(numValor) || numValor < 0 || numValor > 7) {
    alert("Promedio inválido.");
    return;
  }
  promedios[codigo] = { promedio: numValor.toFixed(2) };
  guardarProgreso();
  calcularYMostrarPPA();
  renderMalla();
}

// Inicializar: no mostrar nada sin login
loginContainer.style.display = "block";
appContainer.style.display = "none";
