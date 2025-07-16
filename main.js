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

// Crear burbuja de créditos
const burbujaCreditos = document.createElement("div");
burbujaCreditos.id = "contadorCreditos";
document.body.appendChild(burbujaCreditos);

// Crear tooltip emergente para requisitos y promedios
const tooltip = document.createElement("div");
tooltip.id = "tooltip";
tooltip.style.cssText = `
  position: absolute;
  background: #fff;
  color: #333;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  font-size: 14px;
  z-index: 99999;
  display: none;
  max-width: 220px;
  pointer-events: none;
`;
document.body.appendChild(tooltip);

// Crear icono flotante para la calculadora de promedios
const iconoCalc = document.createElement("div");
iconoCalc.id = "iconoCalculadora";
iconoCalc.title = "Calculadora de promedios por ramo";
iconoCalc.textContent = "📊 Promedios";
iconoCalc.style.cssText = `
  position: fixed;
  bottom: 70px;
  right: 20px;
  background-color: #2575fc;
  color: white;
  padding: 12px 20px;
  border-radius: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  font-weight: bold;
  font-size: 16px;
  z-index: 9999;
  cursor: pointer;
  user-select: none;
  transition: transform 0.3s ease-in-out;
`;
iconoCalc.onmouseenter = () => (iconoCalc.style.transform = "scale(1.1)");
iconoCalc.onmouseleave = () => (iconoCalc.style.transform = "scale(1)");
document.body.appendChild(iconoCalc);

let usuario = null;
let datosMalla = [];
let progreso = {};
let promedios = {}; // Aquí guardamos promedios por ramo

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
      renderMalla();
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

function contarCreditosAprobados(ramos, aprobados) {
  return ramos
    .filter(r => aprobados.includes(r.codigo))
    .reduce((suma, r) => suma + r.creditos, 0);
}

function actualizarBurbujaCreditos(aprobados, ramos) {
  const total = contarCreditosAprobados(ramos, aprobados);
  burbujaCreditos.textContent = `${total} créditos aprobados`;
}

function estaAprobado(ramo, progreso, semestresAprobados) {
  if (ramo.tipo === "anual") {
    return progreso[ramo.codigo] && semestresAprobados.includes("7") && semestresAprobados.includes("8");
  } else {
    return progreso[ramo.codigo];
  }
}

function mostrarTooltip(e, texto) {
  const codigo = e.target.textContent.split(" - ")[0];
  if (promedios[codigo]) {
    texto += `\nPromedio: ${promedios[codigo]}`;
  }
  tooltip.innerText = texto;
  tooltip.style.top = `${e.pageY + 10}px`;
  tooltip.style.left = `${e.pageX + 10}px`;
  tooltip.style.display = "block";
}
function ocultarTooltip() {
  tooltip.style.display = "none";
}

function renderMalla() {
  mallaDiv.innerHTML = "";
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

  let aprobados = 0;
  const semestresAprobados = Object.entries(progreso)
    .map(([codigo]) => {
      const ramo = datosMalla.find(r => r.codigo === codigo);
      return ramo ? (Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre]) : [];
    })
    .flat()
    .map(s => s.toString());

  agrupadores.forEach(({ titulo, incluye }) => {
    const contenedor = document.createElement("div");
    contenedor.className = "semestre";
    const encabezado = document.createElement("h3");
    encabezado.textContent = `📘 ${titulo}`;
    contenedor.appendChild(encabezado);

    const fila = document.createElement("div");
    fila.className = "malla-grid";
    const yaRenderizados = new Set();

    datosMalla
      .filter(r => {
        const s = Array.isArray(r.semestre) ? r.semestre : [r.semestre];
        return s.some(sem => incluye.includes(sem));
      })
      .forEach(ramo => {
        if (yaRenderizados.has(ramo.codigo)) return;
        yaRenderizados.add(ramo.codigo);

        const div = document.createElement("div");
        div.className = "ramo bloqueado";
        div.style.background = ramo.color || "#999";
        div.textContent = `${ramo.codigo} - ${ramo.nombre}`;

        const requisitosArray = Array.isArray(ramo.requisitos) ? ramo.requisitos : [];
        const requisitos = requisitosArray.length ? requisitosArray.join(", ") : "Ninguno";
        const tooltipTexto = `Créditos: ${ramo.creditos}\nRequisitos: ${requisitos}`;

        const desbloqueado = !requisitosArray.length ||
          requisitosArray.every(codigoReq => {
            const ramoReq = datosMalla.find(r => r.codigo === codigoReq);
            return ramoReq && estaAprobado(ramoReq, progreso, semestresAprobados);
          });

        const aprobado = estaAprobado(ramo, progreso, semestresAprobados);

        if (desbloqueado) {
          div.classList.remove("bloqueado");
          div.classList.add("desbloqueado");
          div.onclick = async () => {
            if (progreso[ramo.codigo]) {
              delete progreso[ramo.codigo];
            } else {
              progreso[ramo.codigo] = true;
            }
            await db.collection("progresos").doc(usuario.uid).set({
              progreso,
              promedios
            });
            renderMalla();
          };
        }

        if (aprobado) {
          div.classList.add("aprobado");
          div.textContent += " ✅";
          aprobados++;
        } else if (ramo.tipo === "anual" && progreso[ramo.codigo]) {
          div.classList.add("pendiente-anual");
          div.textContent += " ⏳";
        }

        div.addEventListener("mouseenter", e => mostrarTooltip(e, tooltipTexto));
        div.addEventListener("mouseleave", ocultarTooltip);
        div.addEventListener("touchstart", e => mostrarTooltip(e, tooltipTexto));
        div.addEventListener("touchend", ocultarTooltip);

        fila.appendChild(div);
      });

    contenedor.appendChild(fila);
    mallaDiv.appendChild(contenedor);
  });

  const porcentaje = datosMalla.length ? Math.round((aprobados / datosMalla.length) * 100) : 0;
  resumen.textContent = `Avance: ${aprobados}/${datosMalla.length} ramos (${porcentaje}%)`;
  actualizarBurbujaCreditos(Object.keys(progreso), datosMalla);
}

// --- Calculadora de promedios ---

iconoCalc.onclick = () => {
  abrirCalculadora();
};

function abrirCalculadora() {
  if (document.getElementById("calculadoraPromedios")) return; // No abrir doble vez

  // Crear modal
  const modal = document.createElement("div");
  modal.id = "calculadoraPromedios";
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    color: #333;
    padding: 25px 30px;
    border-radius: 15px;
    box-shadow: 0 6px 18px rgba(0,0,0,0.25);
    z-index: 100000;
    max-width: 400px;
    width: 90vw;
  `;

  modal.innerHTML = `
    <h3>Calculadora de Promedios</h3>
    <label for="selectRamo">Seleccione ramo:</label>
    <select id="selectRamo" style="width: 100%; margin-bottom: 15px; padding: 8px; font-size: 1rem;">
      ${datosMalla.map(r => `<option value="${r.codigo}">${r.codigo} - ${r.nombre}</option>`).join('')}
    </select>
    <div id="notasContainer" style="max-height: 200px; overflow-y: auto; margin-bottom: 15px;"></div>
    <button id="agregarNotaBtn" style="margin-bottom: 15px; padding: 8px 12px; background-color: #2575fc; color: white; border: none; border-radius: 8px; cursor: pointer;">Agregar Nota</button>
    <div>
      <button id="guardarPromedioBtn" style="padding: 10px 20px; background-color: #2ecc71; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Guardar Promedio</button>
      <button id="cerrarCalcBtn" style="margin-left: 10px; padding: 10px 20px; background-color: #e74c3c; color: white; border: none; border-radius: 10px; font-weight: bold; cursor: pointer;">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);

  const notasContainer = modal.querySelector("#notasContainer");
  const selectRamo = modal.querySelector("#selectRamo");
  const guardarBtn = modal.querySelector("#guardarPromedioBtn");
  const cerrarBtn = modal.querySelector("#cerrarCalcBtn");
  const agregarNotaBtn = modal.querySelector("#agregarNotaBtn");

  // Cargar promedio actual si existe
  function cargarPromedioRamo(codigo) {
    notasContainer.innerHTML = "";
    if (!promedios[codigo]) {
      // Si no hay promedio, iniciamos con una nota y peso vacío para editar
      agregarFilaNota();
      return;
    }
    // Si hay promedio, mostramos solo el promedio guardado y peso 100%
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <input type="number" step="0.01" min="0" max="7" value="${promedios[codigo]}" disabled style="width: 60%; padding: 6px; font-size: 1rem; margin-right: 8px;" />
      <span>Promedio guardado</span>
    `;
    notasContainer.appendChild(div);
  }

  // Añade una fila para ingresar nota y peso
  function agregarFilaNota() {
    const fila = document.createElement("div");
    fila.style.marginBottom = "8px";
    fila.innerHTML = `
      <input type="number" step="0.01" min="1" max="7" placeholder="Nota (1-7)" style="width: 55%; padding: 6px; font-size: 1rem; margin-right: 8px;" />
      <input type="number" step="0.01" min="0" max="100" placeholder="Peso (%)" style="width: 35%; padding: 6px; font-size: 1rem;" />
    `;
    notasContainer.appendChild(fila);
  }

  // Cuando cambia el ramo seleccionado
  selectRamo.onchange = () => {
    cargarPromedioRamo(selectRamo.value);
  };

  agregarNotaBtn.onclick = () => {
    agregarFilaNota();
  };

  // Guardar promedio
  guardarBtn.onclick = async () => {
    const inputs = notasContainer.querySelectorAll("input");
    let suma = 0, totalPeso = 0;
    for (let i = 0; i < inputs.length; i += 2) {
      const nota = parseFloat(inputs[i].value);
      const peso = parseFloat(inputs[i + 1].value);
      if (!isNaN(nota) && !isNaN(peso) && peso > 0) {
        suma += nota * peso;
        totalPeso += peso;
      }
    }
    if (totalPeso === 0) {
      alert("Ingresa notas y pesos válidos.");
      return;
    }
    let promedioFinal = (suma / totalPeso).toFixed(2);
    const ramoSeleccionado = selectRamo.value;
    promedios[ramoSeleccionado] = promedioFinal;

    try {
      await db.collection("progresos").doc(usuario.uid).set({
        progreso,
        promedios
      });
      alert(`Promedio guardado: ${promedioFinal}`);
      cerrarCalculadora();
      renderMalla();
    } catch (e) {
      alert("Error guardando promedio. Intenta nuevamente.");
      console.error(e);
    }
  };

  cerrarBtn.onclick = () => {
    cerrarCalculadora();
  };

  // Carga inicial promedio
  cargarPromedioRamo(selectRamo.value);
}

function cerrarCalculadora() {
  const modal = document.getElementById("calculadoraPromedios");
  if (modal) modal.remove();
}
