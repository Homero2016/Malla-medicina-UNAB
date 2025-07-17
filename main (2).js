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
    mostrarBotonesSiUsuarioLogueado();
    try {
      await cargarMalla();
      await cargarProgreso();
      renderMalla();
      await revisarFelicitacionSemestral();  // revisar felicitaciones
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
    ocultarBotonesSiNoLogueado();
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
  if (sumaCreditos > 0) {
    const ppa = (sumaNotasPorCreditos / sumaCreditos).toFixed(2);
    burbujaPPA.textContent = `PPA: ${ppa}`;
  } else {
    burbujaPPA.textContent = "PPA: --";
  }
}

// Mostrar tooltip con promedio si existe
const tooltip = document.createElement("div");
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

function mostrarTooltip(e, texto) {
  const codigo = e.target.textContent.split(" - ")[0];
  if (promedios[codigo]) {
    texto += `\nPromedio: ${promedios[codigo].promedio || "--"}`;
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

    mallaDiv.appendChild(contenedor);
    mallaDiv.appendChild(fila);
  });

  actualizarBurbujaCreditos(Object.keys(progreso).filter(k => progreso[k]), datosMalla);
  calcularYMostrarPPA();
}

// Función para mostrar botones solo si hay usuario logueado
function mostrarBotonesSiUsuarioLogueado() {
  burbujaCreditos.style.display = "block";
  burbujaPPA.style.display = "block";
  iconoCalc.style.display = "flex";
  leyenda.style.display = "none";
  document.getElementById("toggleLeyenda").style.display = "block";
}
// Ocultar botones si no hay usuario
function ocultarBotonesSiNoLogueado() {
  burbujaCreditos.style.display = "none";
  burbujaPPA.style.display = "none";
  iconoCalc.style.display = "none";
  leyenda.style.display = "none";
  document.getElementById("toggleLeyenda").style.display = "none";
}

// Abrir modal calculadora
function abrirCalculadora() {
  const modal = document.createElement("div");
  modal.id = "modalCalculadora";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "100000";

  modal.innerHTML = `
    <div style="
      background: white;
      padding: 24px;
      border-radius: 12px;
      width: 350px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
      <h2 style="margin-top: 0; font-size: 1.5rem; color: #3498db;">Calculadora de Promedios</h2>
      <label for="selectRamo" style="display: block; margin-bottom: 8px; font-weight: 600;">Selecciona un ramo:</label>
      <select id="selectRamo" style="width: 100%; padding: 8px 6px; margin-bottom: 12px; font-size: 1rem;">
        ${datosMalla
          .map(r => `<option value="${r.codigo}">${r.codigo} - ${r.nombre}</option>`)
          .join("")}
      </select>
      <div id="pruebasContainer"></div>
      <button id="agregarPruebaBtn" style="
        margin-top: 12px;
        padding: 8px 12px;
        font-size: 1rem;
        background: #3498db;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
      ">Agregar prueba</button>
      <div style="margin-top: 16px; font-weight: 600; font-size: 1.1rem;">
        Promedio calculado: <span id="promedioCalculado">0.00</span>
      </div>
      <button id="guardarPromedioBtn" style="
        margin-top: 20px;
        padding: 10px 18px;
        font-size: 1.1rem;
        background: #2ecc71;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
      ">Guardar promedio</button>
      <button id="cerrarModalBtn" style="
        margin-top: 12px;
        padding: 10px 18px;
        font-size: 1.1rem;
        background: #e74c3c;
        color: white;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        width: 100%;
      ">Cerrar</button>
    </div>
  `;

  document.body.appendChild(modal);

  const pruebasContainer = modal.querySelector("#pruebasContainer");
  const selectRamo = modal.querySelector("#selectRamo");
  const promedioCalculadoSpan = modal.querySelector("#promedioCalculado");
  const agregarPruebaBtn = modal.querySelector("#agregarPruebaBtn");
  const guardarPromedioBtn = modal.querySelector("#guardarPromedioBtn");
  const cerrarModalBtn = modal.querySelector("#cerrarModalBtn");

  // Crear un input de prueba (nota y porcentaje)
  function crearPrueba(nota = "", porcentaje = "") {
    const div = document.createElement("div");
    div.style.display = "flex";
    div.style.gap = "12px";
    div.style.marginBottom = "8px";

    const inputNota = document.createElement("input");
    inputNota.type = "number";
    inputNota.min = "1";
    inputNota.max = "7";
    inputNota.step = "0.01";
    inputNota.placeholder = "Nota";
    inputNota.style.flex = "1";
    inputNota.value = nota;

    const inputPorc = document.createElement("input");
    inputPorc.type = "number";
    inputPorc.min = "1";
    inputPorc.max = "100";
    inputPorc.placeholder = "%";
    inputPorc.style.flex = "1";
    inputPorc.value = porcentaje;

    div.appendChild(inputNota);
    div.appendChild(inputPorc);

    function calcular() {
      const notas = [];
      const inputs = pruebasContainer.querySelectorAll("div");
      inputs.forEach(divPrueba => {
        const notaI = divPrueba.querySelector("input[type='number']:nth-child(1)");
        const porcI = divPrueba.querySelector("input[type='number']:nth-child(2)");
        if (notaI.value && porcI.value) {
          notas.push({
            nota: parseFloat(notaI.value),
            porcentaje: parseFloat(porcI.value),
          });
        }
      });
      const sumaPorc = notas.reduce((acc, cur) => acc + cur.porcentaje, 0);
      if (sumaPorc !== 100) {
        promedioCalculadoSpan.textContent = "⚠️ Suma % ≠ 100";
        return;
      }
      let promedio = 0;
      notas.forEach(({ nota, porcentaje }) => {
        promedio += (nota * porcentaje) / 100;
      });
      promedioCalculadoSpan.textContent = promedio.toFixed(2);
    }

    inputNota.oninput = calcular;
    inputPorc.oninput = calcular;

    return div;
  }

  // Cargar pruebas guardadas si existen
  function cargarPruebasGuardadas(codigo) {
    pruebasContainer.innerHTML = "";
    if (promedios[codigo] && promedios[codigo].detalles) {
      for (const detalle of promedios[codigo].detalles) {
        const p = crearPrueba(detalle.nota, detalle.porcentaje);
        pruebasContainer.appendChild(p);
      }
    } else {
      // Default una prueba vacía
      const p = crearPrueba();
      pruebasContainer.appendChild(p);
    }
    calcularPromedio();
  }

  // Calcular promedio (función que puede llamarse después de cualquier cambio)
  function calcularPromedio() {
    const notas = [];
    const divs = pruebasContainer.querySelectorAll("div");
    divs.forEach(divPrueba => {
      const notaI = divPrueba.querySelector("input[type='number']:nth-child(1)");
      const porcI = divPrueba.querySelector("input[type='number']:nth-child(2)");
      if (notaI.value && porcI.value) {
        notas.push({
          nota: parseFloat(notaI.value),
          porcentaje: parseFloat(porcI.value),
        });
      }
    });
    const sumaPorc = notas.reduce((acc, cur) => acc + cur.porcentaje, 0);
    if (sumaPorc !== 100) {
      promedioCalculadoSpan.textContent = "⚠️ Suma % ≠ 100";
      return;
    }
    let promedio = 0;
    notas.forEach(({ nota, porcentaje }) => {
      promedio += (nota * porcentaje) / 100;
    });
    promedioCalculadoSpan.textContent = promedio.toFixed(2);
  }

  agregarPruebaBtn.onclick = () => {
    const p = crearPrueba();
    pruebasContainer.appendChild(p);
  };

  selectRamo.onchange = () => {
    cargarPruebasGuardadas(selectRamo.value);
  };

  guardarPromedioBtn.onclick = async () => {
    const codigo = selectRamo.value;
    // Validar suma 100%
    const detalles = [];
    let sumaPorc = 0;
    let promedio = 0;
    const divs = pruebasContainer.querySelectorAll("div");
    for (const divPrueba of divs) {
      const notaI = divPrueba.querySelector("input[type='number']:nth-child(1)");
      const porcI = divPrueba.querySelector("input[type='number']:nth-child(2)");
      if (!notaI.value || !porcI.value) {
        alert("Complete todas las notas y porcentajes.");
        return;
      }
      const notaVal = parseFloat(notaI.value);
      const porcVal = parseFloat(porcI.value);
      if (notaVal < 1 || notaVal > 7 || porcVal < 1 || porcVal > 100) {
        alert("Notas entre 1 y 7, porcentajes entre 1 y 100.");
        return;
      }
      detalles.push({ nota: notaVal, porcentaje: porcVal });
      sumaPorc += porcVal;
      promedio += (notaVal * porcVal) / 100;
    }
    if (sumaPorc !== 100) {
      alert("La suma de porcentajes debe ser 100%");
      return;
    }
    // Guardar promedio y detalles en Firestore
    promedios[codigo] = {
      promedio: promedio.toFixed(2),
      detalles,
    };
    try {
      await db.collection("progresos").doc(usuario.uid).set({ progreso, promedios }, { merge: true });
      alert(`Promedio guardado para ${codigo}: ${promedio.toFixed(2)}`);
      calcularYMostrarPPA();
      modal.remove();
      renderMalla();
    } catch (e) {
      console.error("Error guardando promedio:", e);
      alert("Error guardando promedio, intente de nuevo.");
    }
  };

  cerrarModalBtn.onclick = () => {
    modal.remove();
  };

  cargarPruebasGuardadas(selectRamo.value);
}

// Función para revisar si se debe mostrar felicitación de semestre
async function revisarFelicitacionSemestral() {
  if (!usuario) return;

  // Contar semestres completos
  const semestresCompletos = new Set();

  const aprobadosCodigos = Object.keys(progreso).filter(k => progreso[k]);

  const semestresPorRamo = {};
  for (const ramo of datosMalla) {
    const sems = Array.isArray(ramo.semestre) ? ramo.semestre : [ramo.semestre];
    semestresPorRamo[ramo.codigo] = sems;
  }

  for (const semNum of [1,2,3,4,5,6,7,8,9,10,11,12,13,14]) {
    const ramosSem = datosMalla.filter(r => {
      const s = Array.isArray(r.semestre) ? r.semestre : [r.semestre];
      return s.includes(semNum);
    }).map(r => r.codigo);
    const todosAprobados = ramosSem.every(cod => aprobadosCodigos.includes(cod));
    if (todosAprobados && ramosSem.length > 0) semestresCompletos.add(semNum);
  }

  // Obtener felicitaciones guardadas para no repetir
  const userDoc = await db.collection("felicitaciones").doc(usuario.uid).get();
  let felicitudesGuardadas = [];
  if (userDoc.exists) {
    felicitudesGuardadas = userDoc.data().semestres || [];
  }

  for (const sem of semestresCompletos) {
    if (!felicitudesGuardadas.includes(sem)) {
      mostrarFelicitacion(sem);
      felicitudesGuardadas.push(sem);
    }
  }

  await db.collection("felicitaciones").doc(usuario.uid).set({ semestres: felicitudesGuardadas }, { merge: true });
}

// Mostrar confeti y mensaje motivacional al aprobar semestre
function mostrarFelicitacion(semestre) {
  const modal = document.createElement("div");
  modal.id = "modalFelicitacion";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.75)";
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
  modal.style.zIndex = "100001";

  modal.innerHTML = `
    <div style="
      background: white;
      border-radius: 16px;
      padding: 40px 32px;
      max-width: 400px;
      text-align: center;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      box-shadow: 0 0 20px rgba(0,0,0,0.3);
      position: relative;
    ">
      <h2 style="color: #2ecc71; font-size: 2.4rem; margin-bottom: 16px;">🎉 ¡Felicitaciones! 🎉</h2>
      <p style="font-size: 1.2rem; margin-bottom: 24px;">Has completado el semestre <strong>${semestre}°</strong>. ¡Sigue así, estás haciendo un gran trabajo! 💪</p>
      <button id="cerrarFelicitacionBtn" style="
        padding: 12px 28px;
        font-size: 1.1rem;
        background: #27ae60;
        color: white;
        border: none;
        border-radius: 12px;
        cursor: pointer;
      ">Cerrar</button>
      <canvas id="confettiCanvas" style="
        position: absolute;
        top: 0; left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 10;
        border-radius: 16px;
      "></canvas>
    </div>
  `;

  document.body.appendChild(modal);

  const cerrarBtn = document.getElementById("cerrarFelicitacionBtn");
  cerrarBtn.onclick = () => {
    modal.remove();
  };

  // Lanzar confeti
  lanzarConfeti("confettiCanvas");
}

// Confeti simple con canvas
function lanzarConfeti(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;

  const confetis = [];

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Confeti {
    constructor() {
      this.x = random(0, canvas.width);
      this.y = random(-canvas.height, 0);
      this.size = random(6, 12);
      this.speed = random(1, 4);
      this.angle = random(0, 2 * Math.PI);
      this.color = `hsl(${random(0, 360)}, 70%, 60%)`;
      this.rotationSpeed = random(-0.1, 0.1);
    }
    update() {
      this.y += this.speed;
      this.angle += this.rotationSpeed;
      if (this.y > canvas.height) {
        this.y = random(-canvas.height, 0);
        this.x = random(0, canvas.width);
      }
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.fillStyle = this.color;
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) {
    confetis.push(new Confeti());
  }

  function animar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetis.forEach(c => {
      c.update();
      c.draw();
    });
    requestAnimationFrame(animar);
  }
  animar();

  // Parar confeti después de 7 segundos
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.remove();
  }, 7000);
}
