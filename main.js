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
  background: linear-gradient(135deg, #2575fc, #6a11cb);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  box-shadow: 0 6px 18px rgba(101, 60, 190, 0.7);
  font-weight: 700;
  font-size: 16px;
  z-index: 9999;
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
  iconoCalc.style.boxShadow = "0 8px 24px rgba(101, 60, 190, 0.9)";
};
iconoCalc.onmouseleave = () => {
  iconoCalc.style.transform = "scale(1)";
  iconoCalc.style.boxShadow = "0 6px 18px rgba(101, 60, 190, 0.7)";
};
iconoCalc.onclick = () => abrirCalculadora();
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
    // Para ramos anuales, revisar si el progreso está marcado (pendiente) o aprobado en semestres 7 y 8
    // Aquí tú defines la lógica, te dejo básica:
    return progreso[ramo.codigo] === true; // Solo si el usuario marcó aprobado
  } else {
    return progreso[ramo.codigo] === true;
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
        let tooltipTexto = `Créditos: ${ramo.creditos}\nRequisitos: ${requisitos}`;

        const desbloqueado = !requisitosArray.length ||
          requisitosArray.every(codigoReq => {
            const ramoReq = datosMalla.find(r => r.codigo === codigoReq);
            return ramoReq && estaAprobado(ramoReq, progreso, []);
          });

        const aprobado = estaAprobado(ramo, progreso, []);

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
    padding: 30px 35px;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(101, 60, 190, 0.35);
    max-width: 400px;
    width: 90vw;
    z-index: 100000;
    user-select: none;
    animation: modalAppear 0.3s ease forwards;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  `;

  modal.innerHTML = `
    <h3>Calculadora de Promedios</h3>
    <label for="selectRamo">Seleccione ramo:</label>
    <select id="selectRamo" style="width: 100%; margin-bottom: 20px; padding: 10px 12px; font-size: 1rem; font-weight: 600; border: 2px solid #2575fc; border-radius: 10px; color: #2575fc; outline: none; transition: border-color 0.3s ease;">
      ${datosMalla.map(r => `<option value="${r.codigo}">${r.codigo} - ${r.nombre}</option>`).join('')}
    </select>
    <div id="notasContainer" style="max-height: 220px; overflow-y: auto; margin-bottom: 20px; padding-right: 6px;"></div>
    <button id="agregarNotaBtn" style="background-color: #2575fc; color: white; font-weight: 700; font-size: 1.1rem; padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer; width: 100%; margin-bottom: 20px; box-shadow: 0 4px 12px rgba(37, 117, 252, 0.4);">Agregar Nota</button>
    <div style="display: flex; gap: 10px;">
      <button id="guardarPromedioBtn" style="background-color: #2ecc71; color: white; font-weight: 700; font-size: 1.1rem; padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer; flex: 1; box-shadow: 0 4px 12px rgba(46, 204, 113, 0.4);">Guardar Promedio</button>
      <button id="cerrarCalcBtn" style="background-color: #e74c3c; color: white; font-weight: 700; font-size: 1.1rem; padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer; flex: 1; box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);">Cerrar</button>
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
    // Si hay promedio guardado, mostrarlo en un campo disabled
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <input type="number" step="0.01" min="1" max="7" value="${promedios[codigo]}" disabled style="width: 100%; padding: 8px; font-size: 1rem; font-weight: 600; color: #333; border: 2px solid #bbb; border-radius: 8px;" />
      <span style="font-weight: 600; margin-left: 8px;">Promedio guardado</span>
    `;
    notasContainer.appendChild(div);
  }

  // Añade una fila para ingresar nota y peso
  function agregarFilaNota() {
    const fila = document.createElement("div");
    fila.style.marginBottom = "8px";
    fila.style.display = "flex";
    fila.style.gap = "10px";
    fila.innerHTML = `
      <input type="number" step="0.01" min="1" max="7" placeholder="Nota (1-7)" style="flex: 1; padding: 8px; font-size: 1rem; font-weight: 600; color: #333; border: 2px solid #bbb; border-radius: 8px;" />
      <input type="number" step="0.01" min="0" max="100" placeholder="Peso (%)" style="width: 100px; padding: 8px; font-size: 1rem; font-weight: 600; color: #333; border: 2px solid #bbb; border-radius: 8px;" />
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
