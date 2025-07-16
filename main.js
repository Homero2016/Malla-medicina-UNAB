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
// Contar créditos aprobados
function contarCreditosAprobados(ramos, aprobados) {
  return ramos
    .filter(r => aprobados.includes(r.codigo))
    .reduce((suma, r) => suma + r.creditos, 0);
}

// Actualizar burbuja créditos
function actualizarBurbujaCreditos(aprobados, ramos) {
  const total = contarCreditosAprobados(ramos, aprobados);
  burbujaCreditos.textContent = `${total} créditos aprobados`;
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
    if (progreso[ramo.codigo] && promedios[ramo.codigo]) {
      const promedio = parseFloat(promedios[ramo.codigo]);
      if (!isNaN(promedio)) {
        sumaNotasPorCreditos += promedio * ramo.creditos;
        sumaCreditos += ramo.creditos;
      }
    }
  }
  if (sumaCreditos > 0) {
    const ppa = (sumaNotasPorCreditos / sumaCreditos).toFixed(2);
    burbujaPPA.textContent = `PPA: ${ppa}`;
  } else {
    burbujaPPA.textContent = `PPA: --`;
  }
}

// Mostrar tooltip con promedio si existe
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

// Renderizar la malla curricular
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

  let aprobadosCount = 0;

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

        // Verificar si está desbloqueado (cumple requisitos)
        const desbloqueado = !requisitosArray.length ||
          requisitosArray.every(codigoReq => {
            const ramoReq = datosMalla.find(r => r.codigo === codigoReq);
            return ramoReq && estaAprobado(ramoReq, progreso);
          });

        // Si está aprobado
        const aprobado = estaAprobado(ramo, progreso);

        if (desbloqueado) {
          div.classList.remove("bloqueado");
          div.classList.add("desbloqueado");
          div.onclick = async () => {
            try {
              if (progreso[ramo.codigo]) {
                delete progreso[ramo.codigo];
              } else {
                progreso[ramo.codigo] = true;
              }
              await db.collection("progresos").doc(usuario.uid).set({ progreso, promedios }, { merge: true });
              renderMalla();
            } catch (e) {
              console.error("Error guardando progreso:", e);
              alert("Error guardando progreso, intenta nuevamente.");
            }
          };
        }

        if (aprobado) {
          div.classList.add("aprobado");
          div.textContent += " ✅";
          aprobadosCount++;
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

  const porcentaje = datosMalla.length ? Math.round((aprobadosCount / datosMalla.length) * 100) : 0;
  resumen.textContent = `Avance: ${aprobadosCount}/${datosMalla.length} ramos (${porcentaje}%)`;
  actualizarBurbujaCreditos(Object.keys(progreso), datosMalla);
  calcularYMostrarPPA();
}
// --- Calculadora de promedios ---

function abrirCalculadora() {
  if (document.getElementById("calculadoraPromedios")) return; // Evitar abrir doble vez

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

  // Cargar promedio actual si existe
  function cargarPromedioRamo(codigo) {
    notasContainer.innerHTML = "";
    if (!promedios[codigo]) {
      agregarFilaNota();
      return;
    }
    // Mostrar promedio guardado (solo lectura)
    const div = document.createElement("div");
    div.style.marginBottom = "8px";
    div.innerHTML = `
      <input type="number" step="0.01" min="1" max="7" value="${promedios[codigo]}" disabled style="width: 100%; padding: 8px; font-size: 1rem; font-weight: 600; color: #333; border: 2px solid #bbb; border-radius: 8px;" />
      <span style="font-weight: 600; margin-left: 8px;">Promedio guardado</span>
    `;
    notasContainer.appendChild(div);
  }

  selectRamo.onchange = () => {
    cargarPromedioRamo(selectRamo.value);
  };

  agregarNotaBtn.onclick = () => {
    agregarFilaNota();
  };

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
      }, { merge: true });
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
