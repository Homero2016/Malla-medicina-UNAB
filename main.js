// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbz-PJ9OSELTu1tTg2hSPAST8VouWqeEc",
  authDomain: "malla-medicina-unab.firebaseapp.com",
  projectId: "malla-medicina-unab",
  storageBucket: "malla-medicina-unab.firebasestorage.app",
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
      checkSemestresCompletados(); // Check felicitación al cargar
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
    if (progreso[ramo.codigo] && promedios[ramo.codigo] && promedios[ramo.codigo].promedio) {
      const promedio = parseFloat(promedios[ramo.codigo].promedio);
      if (!isNaN(promedio)) {
        sumaNotasPorCreditos += promedio * ramo.creditos;
        sumaCreditos += ramo.creditos;
      }
    }
  }
  if (sumaCreditos === 0) {
    burbujaPPA.textContent = `PPA: N/A`;
  } else {
    const ppa = (sumaNotasPorCreditos / sumaCreditos).toFixed(2);
    burbujaPPA.textContent = `PPA: ${ppa}`;
  }
}

// Función para saber si puedes tomar un ramo (tiene requisitos cumplidos)
function puedeTomar(ramo) {
  if (!ramo.requisitos || ramo.requisitos.length === 0) return true;
  return ramo.requisitos.every(reqCodigo => progreso[reqCodigo] === true);
}

// Renderizado de la malla con ramos
function renderMalla() {
  mallaDiv.innerHTML = "";
  if (datosMalla.length === 0) return;

  // Agrupar por semestre
  const semestresMap = {};
  datosMalla.forEach(ramo => {
    let semestres = Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre];
    semestres.forEach(sem => {
      if (!semestresMap[sem]) semestresMap[sem] = [];
      semestresMap[sem].push(ramo);
    });
  });

  const semestresOrdenados = Object.keys(semestresMap).sort((a, b) => a - b);

  semestresOrdenados.forEach(sem => {
    const contSemestre = document.createElement("section");
    contSemestre.className = "semestre";
    contSemestre.setAttribute("aria-label", `Semestre ${sem}`);

    const tituloSemestre = document.createElement("h2");
    tituloSemestre.textContent = `Semestre ${sem}`;
    contSemestre.appendChild(tituloSemestre);

    const ramosSemestre = semestresMap[sem];
    ramosSemestre.forEach(ramo => {
      const div = document.createElement("div");
      div.className = "ramo";
      div.setAttribute("tabindex", "0");
      div.setAttribute("role", "button");
      div.setAttribute("aria-pressed", estaAprobado(ramo, progreso));
      div.title = `${ramo.nombre}\nCréditos: ${ramo.creditos}\nRequisitos: ${
        ramo.requisitos && ramo.requisitos.length > 0 ? ramo.requisitos.join(", ") : "Ninguno"
      }`;

      // Estado visual según progreso
      if (estaAprobado(ramo, progreso)) {
        div.classList.add("aprobado");
      } else if (puedeTomar(ramo)) {
        div.classList.add("desbloqueado");
      } else {
        div.classList.add("bloqueado");
      }

      div.textContent = `${ramo.codigo}`;

      // Mostrar promedio al pasar el cursor
      if (promedios[ramo.codigo] && promedios[ramo.codigo].promedio) {
        div.setAttribute("data-promedio", promedios[ramo.codigo].promedio);
        div.title += `\nPromedio: ${promedios[ramo.codigo].promedio}`;
      }

      // Toggle aprobado / no aprobado
      div.onclick = async () => {
        try {
          if (progreso[ramo.codigo]) {
            delete progreso[ramo.codigo];
          } else {
            progreso[ramo.codigo] = true;
          }
          await db.collection("progresos").doc(usuario.uid).set({ progreso, promedios }, { merge: true });
          renderMalla();
          checkSemestresCompletados();
        } catch (e) {
          console.error("Error guardando progreso:", e);
          alert("Error guardando progreso, intenta nuevamente.");
        }
      };

      contSemestre.appendChild(div);
    });

    mallaDiv.appendChild(contSemestre);
  });

  // Actualizar burbujas de créditos y PPA
  const aprobadosCodigos = Object.keys(progreso).filter(k => progreso[k] === true);
  actualizarBurbujaCreditos(datosMalla, aprobadosCodigos);
  calcularYMostrarPPA();
}

// ----------------------
// Calculadora de promedios
// ----------------------

// Crear modal calculadora
function crearModalCalculadora() {
  let modal = document.getElementById("modalCalculadora");
  if (modal) return modal; // Ya creado

  modal = document.createElement("div");
  modal.id = "modalCalculadora";
  modal.className = "modal";
  modal.style.display = "none";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.zIndex = "30000";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  modal.innerHTML = `
    <div style="background:white; border-radius:15px; padding:20px; max-width: 420px; width: 90%; max-height: 80vh; overflow-y: auto; box-shadow: 0 4px 18px rgba(0,0,0,0.25); font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
      <button id="cerrarCalc" style="float: right; font-size: 28px; border:none; background:none; cursor:pointer;">&times;</button>
      <h3>Calculadora de Promedios por Ramo</h3>
      <label for="selectRamoCalc">Selecciona ramo:</label>
      <select id="selectRamoCalc" style="width: 100%; margin-bottom: 15px; font-size: 1rem; padding: 6px;"></select>
      <div id="pruebasContainer"></div>
      <button id="agregarPruebaBtn" style="margin-top: 10px;">➕ Agregar prueba</button>
      <div style="margin-top:15px;">
        <strong>Promedio actual: </strong><span id="promedioActual">0.00</span>
      </div>
      <button id="guardarPromedioBtn" style="margin-top: 20px; background: #3498db; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">Guardar promedio</button>
    </div>
  `;

  document.body.appendChild(modal);

  document.getElementById("cerrarCalc").onclick = () => {
    modal.style.display = "none";
  };

  return modal;
}

function abrirCalculadora() {
  const modal = crearModalCalculadora();
  modal.style.display = "flex";

  const selectRamo = document.getElementById("selectRamoCalc");
  const pruebasContainer = document.getElementById("pruebasContainer");
  const promedioActualSpan = document.getElementById("promedioActual");
  const guardarBtn = document.getElementById("guardarPromedioBtn");
  const agregarPruebaBtn = document.getElementById("agregarPruebaBtn");

  // Limpiar select
  selectRamo.innerHTML = "";
  datosMalla.forEach(ramo => {
    const opt = document.createElement("option");
    opt.value = ramo.codigo;
    opt.textContent = `${ramo.codigo} - ${ramo.nombre}`;
    selectRamo.appendChild(opt);
  });

  // Limpiar pruebas
  pruebasContainer.innerHTML = "";

  // Cargar pruebas previas si existen
  function cargarPruebas(ra) {
    pruebasContainer.innerHTML = "";
    const data = promedios[ra] || { pruebas: [] };
    if (data.pruebas.length === 0) {
      agregarPrueba();
      agregarPrueba();
    } else {
      data.pruebas.forEach(({ nombre, porcentaje, nota }) => {
        agregarPrueba(nombre, porcentaje, nota);
      });
    }
    calcularPromedio();
  }

  // Añadir una prueba de nota
  function agregarPrueba(nombre = "", porcentaje = "", nota = "") {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "6px";
    div.style.marginBottom = "8px";

    const inputNombre = document.createElement("input");
    inputNombre.type = "text";
    inputNombre.placeholder = "Nombre prueba";
    inputNombre.value = nombre;
    inputNombre.style.flex = "2";

    const inputPorcentaje = document.createElement("input");
    inputPorcentaje.type = "number";
    inputPorcentaje.placeholder = "%";
    inputPorcentaje.min = 0;
    inputPorcentaje.max = 100;
    inputPorcentaje.value = porcentaje;
    inputPorcentaje.style.flex = "1";

    const inputNota = document.createElement("input");
    inputNota.type = "number";
    inputNota.placeholder = "Nota";
    inputNota.min = 1;
    inputNota.max = 7;
    inputNota.step = 0.01;
    inputNota.value = nota;
    inputNota.style.flex = "1";

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "✖";
    btnEliminar.style.background = "transparent";
    btnEliminar.style.border = "none";
    btnEliminar.style.color = "red";
    btnEliminar.style.fontWeight = "700";
    btnEliminar.style.cursor = "pointer";

    btnEliminar.onclick = () => {
      div.remove();
      calcularPromedio();
    };

    [inputNombre, inputPorcentaje, inputNota].forEach(input => {
      input.oninput = calcularPromedio;
    });

    div.appendChild(inputNombre);
    div.appendChild(inputPorcentaje);
    div.appendChild(inputNota);
    div.appendChild(btnEliminar);

    pruebasContainer.appendChild(div);
  }

  agregarPruebaBtn.onclick = () => {
    agregarPrueba();
  };

  // Calcular promedio según pruebas
  function calcularPromedio() {
    const divs = pruebasContainer.querySelectorAll("div");
    let sumaPesos = 0;
    let sumaNotas = 0;
    let error = false;
    divs.forEach(div => {
      const inputs = div.querySelectorAll("input");
      const porcentaje = parseFloat(inputs[1].value);
      const nota = parseFloat(inputs[2].value);
      if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) error = true;
      if (isNaN(nota) || nota < 1 || nota > 7) error = true;
      if (!error) {
        sumaPesos += porcentaje;
        sumaNotas += (nota * porcentaje);
      }
    });
    if (error || sumaPesos === 0) {
      promedioActualSpan.textContent = "0.00";
    } else {
      promedioActualSpan.textContent = (sumaNotas / sumaPesos).toFixed(2);
    }
  }

  // Guardar promedio en Firestore y actualizar local promedios
  guardarBtn.onclick = async () => {
    const ramoSeleccionado = selectRamo.value;
    if (!ramoSeleccionado) {
      alert("Selecciona un ramo");
      return;
    }
    const divs = pruebasContainer.querySelectorAll("div");
    const pruebasArray = [];
    let sumaPesos = 0;
    let error = false;
    divs.forEach(div => {
      const inputs = div.querySelectorAll("input");
      const nombre = inputs[0].value.trim() || "Prueba";
      const porcentaje = parseFloat(inputs[1].value);
      const nota = parseFloat(inputs[2].value);
      if (isNaN(porcentaje) || porcentaje < 0 || porcentaje > 100) error = true;
      if (isNaN(nota) || nota < 1 || nota > 7) error = true;
      if (!error) {
        pruebasArray.push({ nombre, porcentaje, nota });
        sumaPesos += porcentaje;
      }
    });
    if (error) {
      alert("Porcentajes deben estar entre 0-100 y notas entre 1-7");
      return;
    }
    if (sumaPesos === 0) {
      alert("La suma de los porcentajes debe ser mayor a 0");
      return;
    }

    const promedioCalculado = parseFloat((pruebasArray.reduce((acc, p) => acc + p.porcentaje * p.nota, 0) / sumaPesos).toFixed(2));

    promedios[ramoSeleccionado] = {
      promedio: promedioCalculado,
      pruebas: pruebasArray
    };

    try {
      await db.collection("progresos").doc(usuario.uid).set({ progreso, promedios }, { merge: true });
      alert(`Promedio guardado para ${ramoSeleccionado}: ${promedioCalculado}`);
      modal.style.display = "none";
      renderMalla();
      calcularYMostrarPPA();
      checkSemestresCompletados();
    } catch (e) {
      console.error("Error guardando promedio:", e);
      alert("Error guardando promedio, intenta nuevamente.");
    }
  };

  // Al cambiar ramo seleccionado, cargar pruebas
  selectRamo.onchange = () => {
    cargarPruebas(selectRamo.value);
  };

  // Inicializar con el primer ramo
  if (selectRamo.options.length > 0) {
    cargarPruebas(selectRamo.value);
  }
}

// ----------------------
// Modal "¿Qué puedo tomar?"
// ----------------------

const btnTomables = document.getElementById("btn-tomables");
const modalTomables = document.getElementById("modal-tomables");
const cerrarModalTomables = document.getElementById("cerrar-modal");
const listaTomables = document.getElementById("lista-tomables");

function cargarRamosTomables() {
  listaTomables.innerHTML = "";
  const tomables = datosMalla.filter(ramo => !progreso[ramo.codigo] && puedeTomar(ramo));

  if (tomables.length === 0) {
    listaTomables.innerHTML = "<li>No hay ramos desbloqueados para el próximo semestre.</li>";
    return;
  }

  tomables.forEach(ramo => {
    const li = document.createElement("li");
    li.textContent = `${ramo.codigo} - ${ramo.nombre} (${ramo.creditos} créditos)`;
    listaTomables.appendChild(li);
  });
}

btnTomables.addEventListener("click", () => {
  cargarRamosTomables();
  modalTomables.hidden = false;
  modalTomables.setAttribute("aria-hidden", "false");
});

cerrarModalTomables.addEventListener("click", () => {
  modalTomables.hidden = true;
  modalTomables.setAttribute("aria-hidden", "true");
});

window.addEventListener("click", (e) => {
  if (e.target === modalTomables) {
    modalTomables.hidden = true;
    modalTomables.setAttribute("aria-hidden", "true");
  }
});

// ----------------------
// Felicitación al completar semestre
// ----------------------

function checkSemestresCompletados() {
  const totalSemestres = 14; // Ajusta según tu malla real

  for (let sem = 1; sem <= totalSemestres; sem++) {
    const ramosDelSemestre = datosMalla.filter(r => {
      if (Array.isArray(r.semestre)) return r.semestre.includes(sem);
      return r.semestre === sem;
    });

    if (ramosDelSemestre.length === 0) continue;

    const todosAprobados = ramosDelSemestre.every(ramo => progreso[ramo.codigo] === true);
    const claveSemestre = `semestre_${sem}_completado`;

    if (todosAprobados && !localStorage.getItem(claveSemestre)) {
      localStorage.setItem(claveSemestre, "true");
      mostrarFelicitacion();
      break; // Mostrar solo una felicitación por llamada
    }
  }
}

function mostrarFelicitacion() {
  const modalFelicitacion = document.createElement("div");
  modalFelicitacion.id = "modal-felicitacion";
  modalFelicitacion.className = "modal";
  modalFelicitacion.style.display = "flex";
  modalFelicitacion.style.justifyContent = "center";
  modalFelicitacion.style.alignItems = "center";
  modalFelicitacion.style.position = "fixed";
  modalFelicitacion.style.top = "0";
  modalFelicitacion.style.left = "0";
  modalFelicitacion.style.width = "100%";
  modalFelicitacion.style.height = "100%";
  modalFelicitacion.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  modalFelicitacion.style.zIndex = "20000";

  modalFelicitacion.innerHTML = `
    <div style="background: white; border-radius: 15px; padding: 30px; max-width: 350px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.3); position: relative;">
      <button id="cerrar-felicitacion" style="position: absolute; top: 10px; right: 15px; font-size: 28px; background: none; border: none; cursor: pointer;">&times;</button>
      <h2>🎉 ¡Felicidades! 🎉</h2>
      <p>Has completado todos los ramos de un semestre. ¡Sigue así!</p>
    </div>
  `;

  document.body.appendChild(modalFelicitacion);
  lanzarConfeti();

  document.getElementById("cerrar-felicitacion").onclick = () => {
    modalFelicitacion.remove();
  };
  modalFelicitacion.onclick = (e) => {
    if (e.target === modalFelicitacion) {
      modalFelicitacion.remove();
    }
  };
}

// Confeti - requiere incluir <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script> en index.html
function lanzarConfeti() {
  const duration = 4000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 30000 };

  (function frame() {
    confetti({
      particleCount: 5,
      ...defaults,
      origin: { x: Math.random(), y: Math.random() - 0.2 }
    });
    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  })();
}
