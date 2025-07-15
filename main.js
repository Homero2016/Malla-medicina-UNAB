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

// Crear tooltip emergente para requisitos
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

let usuario = null;
let progreso = {};

// Copia completa del JSON embebido
const datosMalla = [
  {
    "codigo": "BIO130",
    "nombre": "Biología Celular",
    "creditos": 4,
    "semestre": 1,
    "requisitos": [],
    "color": "#3498db"
  },
  {
    "codigo": "BIO131",
    "nombre": "Laboratorio Biología Celular",
    "creditos": 3,
    "semestre": 1,
    "requisitos": [],
    "color": "#1abc9c"
  },
  {
    "codigo": "CEG001",
    "nombre": "Electivo Formación General I",
    "creditos": 2,
    "semestre": 1,
    "requisitos": [],
    "color": "#e67e22"
  },
  {
    "codigo": "FMM007",
    "nombre": "Matemáticas Avanzada",
    "creditos": 8,
    "semestre": 1,
    "requisitos": [],
    "color": "#9b59b6"
  },
  {
    "codigo": "MED016",
    "nombre": "Introducción a la Medicina I",
    "creditos": 4,
    "semestre": 1,
    "requisitos": [],
    "color": "#e74c3c"
  },
  {
    "codigo": "QUI109",
    "nombre": "Química General",
    "creditos": 6,
    "semestre": 1,
    "requisitos": [],
    "color": "#2ecc71"
  },
  {
    "codigo": "FMF019",
    "nombre": "Física",
    "creditos": 6,
    "semestre": 2,
    "requisitos": ["FMM007"],
    "color": "#2c3e50"
  },
  {
    "codigo": "MED017",
    "nombre": "Introducción a la Medicina II",
    "creditos": 6,
    "semestre": 2,
    "requisitos": ["MED016"],
    "color": "#c0392b"
  },
  {
    "codigo": "MOR330",
    "nombre": "Anatomía Humana I",
    "creditos": 6,
    "semestre": 2,
    "requisitos": [],
    "color": "#16a085"
  },
  {
    "codigo": "MOR331",
    "nombre": "Laboratorio Anatomía Humana I",
    "creditos": 6,
    "semestre": 2,
    "requisitos": [],
    "color": "#f39c12"
  },
  {
    "codigo": "QUI024",
    "nombre": "Química Orgánica",
    "creditos": 6,
    "semestre": 2,
    "requisitos": ["QUI109"],
    "color": "#2980b9"
  },
  {
    "codigo": "MOR332",
    "nombre": "Anatomía Humana II",
    "creditos": 6,
    "semestre": 3,
    "requisitos": ["MOR330", "MOR331"],
    "color": "#16a085"
  },
  {
    "codigo": "MOR333",
    "nombre": "Laboratorio Anatomía Humana II",
    "creditos": 6,
    "semestre": 3,
    "requisitos": ["MOR330", "MOR331"],
    "color": "#f39c12"
  },
   {
    "codigo": "BIO266",
    "nombre": "Bioquimica",
    "creditos": 6,
    "semestre": 3,
    "requisitos": ["QUI024"],
    "color": "#6dc36d"
   },
     {
    "codigo": "BIO376",
    "nombre": "Fisiologia humana I",
    "creditos": 7,
    "semestre": 3,
    "requisitos": ["BIO130", "BIO131", "FMF019", "MOR330", "MOR331"],
    "color": "#00ffff"
 },
     {
    "codigo": "HUF124",
    "nombre": "Antropologia filosofica",
    "creditos": 3,
    "semestre": 3,
    "requisitos": [],
    "color": "#d0bdf6"
 },
     {
    "codigo": "MED121",
    "nombre": "Medico paciente I",
    "creditos": 4,
    "semestre": 3,
    "requisitos": ["MED017"],
    "color": "#f98cd2"
},
  {
    "codigo": "BIO148",
    "nombre": "Genetica y Bio. Molecular humana",
    "creditos": 4,
    "semestre": 4,
    "requisitos": ["BIO130","BIO131"],
    "color": "#008f39"
},
  {
    "codigo": "BIO242",
    "nombre": "Laborarotio de Genetica y Bio. Molecular humana",
    "creditos": 4,
    "semestre": 4,
    "requisitos": ["BIO130","BIO131"],
    "color": "#77dd77"
},
  {
    "codigo": "BIO320",
    "nombre": "Histologia",
    "creditos": 4,
    "semestre": 4,
    "requisitos": ["BIO130","BIO131", "MOR332", "MOR333"],
    "color": "#a349a4"
},
  {
    "codigo": "BIO321",
    "nombre": "Laboratorio de Histologia",
    "creditos": 4,
    "semestre": 4,
    "requisitos": ["BIO130","BIO131", "MOR332", "MOR333"],
    "color": "#e6ccef"
},
     {
    "codigo": "BIO377",
    "nombre": "Fisiologia humana II",
    "creditos": 7,
    "semestre": 4,
    "requisitos": ["BIO376", "MOR333", "MOR332"],
    "color": "#00ffff"
 },
     {
    "codigo": "CEG003",
    "nombre": "Electivo de formacion general III",
    "creditos": 2,
    "semestre": 4,
    "requisitos": [],
    "color": "#e67e22"
},
     {
    "codigo": "MED122",
    "nombre": "Medico paciente II",
    "creditos": 4,
    "semestre": 4,
    "requisitos": ["MED121"],
    "color": "#f98cd2"
},
     {
    "codigo": "MED131",
    "nombre": "Psicologia",
    "creditos": 3,
    "semestre": 4,
    "requisitos": [],
    "color": "#ffff00"
},
     {
    "codigo": "BIO250",
    "nombre": "Microbiologia",
    "creditos": 4,
    "semestre": 5,
    "requisitos": ["BIO148", "BIO242"],
    "color": "#64c27b"
},
     {
    "codigo": "BIO251",
    "nombre": "Laboratorio de Microbiologia",
    "creditos": 2,
    "semestre": 5,
    "requisitos": ["BIO148", "BIO242"],
    "color": "#9bfab0"
},
     {
    "codigo": "MED250",
    "nombre": "Semiologia Medica",
    "creditos": 14,
    "semestre": 5,
    "requisitos": ["MOR332", "MOR333", "MED122", "BIO377"],
    "color": "#109dfa"
},
     {
    "codigo": "MED257",
    "nombre": "Inmunologia y Nutricion",
    "creditos": 4,
    "semestre": 5,
    "requisitos": ["BIO266", "BIO320", "BIO321", "BIO377"],
    "color": "#23bac4"
},
     {
    "codigo": "MED258",
    "nombre": "Etica Medica I",
    "creditos": 3,
    "semestre": 5,
    "requisitos": ["MED122", "MED131"],
    "color": "#cd5c5c"
},
     {
    "codigo": "MED278",
    "nombre": "Topicos de Investigacion en Salud I",
    "creditos": 4,
    "semestre": 5,
    "requisitos": ["FMM007"],
    "color": "#f08080"
},
     {
    "codigo": "BIO288",
    "nombre": "Farmacologia",
    "creditos": 5,
    "semestre": 6,
    "requisitos": ["BIO266", "BIO377"],
    "color": "#ab49cc"
},
     {
    "codigo": "MED249",
    "nombre": "Medicina Orientada al Problema",
    "creditos": 14,
    "semestre": 6,
    "requisitos": ["MED250", "BIO377"],
    "color": "#109dfa"
},
     {
    "codigo": "MED259",
    "nombre": "Etica Medica II",
    "creditos": 3,
    "semestre": 6,
    "requisitos": ["MED258"],
    "color": "#cd5c5c"
},
     {
    "codigo": "MED260",
    "nombre": "Fisiopatologia Humana",
    "creditos": 6,
    "semestre": 6,
    "requisitos": ["BIO377"],
    "color": "#00ffff"
},
     {
    "codigo": "MED279",
    "nombre": "Topicos de Investigacion en Salud II",
    "creditos": 4,
    "semestre": 6,
    "requisitos": ["MED278"],
    "color": "#f08080"
},
     {
    "codigo": "MED244",
    "nombre": "Neurologia",
    "creditos": 6,
    "semestre": 7,
    "requisitos": ["BIO288", "MED249"],
    "color": "#ffff00"
},
     {
  "codigo": "MED287",
  "nombre": "Cirugía (ANUAL)",
  "creditos": 5,
  "semestre": 7,
  "requisitos": ["BIO288", "MED260"],
  "color": "#0000ff"
},
    {
  "codigo": "MED287",
  "nombre": "Cirugía (ANUAL)",
  "creditos": 5,
  "semestre": 8,
  "requisitos": ["BIO288", "MED260"],
  "color": "#0000ff"
},
     {
    "codigo": "MED292",
    "nombre": "Salud Publica I",
    "creditos": 4,
    "semestre": 7,
    "requisitos": ["MED279"],
    "color": "#cd5c5c"
},
     {
    "codigo": "MED294",
    "nombre": "Patologia I",
    "creditos": 6,
    "semestre": 7,
    "requisitos": ["BIO320", "BIO321", "BIO377"],
    "color": "#00ffff"
},
     {
  "codigo": "MED296",
  "nombre": "Medicina Interna (ANUAL)",
  "creditos": 20,
  "semestre": 7,
  "requisitos": ["BIO288", "MED249", "MED257", "MED260"],
  "color": "#109dfa"
},
     {
  "codigo": "MED296",
  "nombre": "Medicina Interna (ANUAL)",
  "creditos": 20,
  "semestre": 8,
  "requisitos": ["BIO288", "MED249", "MED257", "MED260"],
  "color": "#109dfa"
},
     {
    "codigo": "MED245",
    "nombre": "Psiquiatria",
    "creditos": 6,
    "semestre": 8,
    "requisitos": ["MED131"],
    "color": "#ffff00"
  },
     {
    "codigo": "MED293",
    "nombre": "Salud Publica II",
    "creditos": 4,
    "semestre": 8,
    "requisitos": ["MED292"],
    "color": "#cd5c5c"
  },
     {
    "codigo": "MED295",
    "nombre": "Patologia II",
    "creditos": 6,
    "semestre": 8,
    "requisitos": ["MED294"],
    "color": "#00ffff"
  }, 
     {
    "codigo": "MED281",
    "nombre": "Otorrinolaringologia (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#ff8000"
  },
    {
    "codigo": "MED282",
    "nombre": "Dermatologia (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#ff69b4"
  },
    {
    "codigo": "MED283",
    "nombre": "Urologia (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#b2ffff"
  },
    {
    "codigo": "MED284",
    "nombre": "Oftamologia (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#e0b0ff"
  },
    {
    "codigo": "MED285",
    "nombre": "Medicina Legal (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#332f2c"
  },
    {
    "codigo": "MED297",
    "nombre": "Pediatria (ANUAL)",
    "creditos": 11,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#ffd700"
 },
    {
    "codigo": "MED298",
    "nombre": "Obstetricia y Ginecologia (ANUAL)",
    "creditos": 11,
    "semestre": [9, 10],
    "requisitos": ["MED296"],
    "color": "#a52019"
 },
    {
    "codigo": "MED399",
    "nombre": "Ingles Basico (ANUAL)",
    "creditos": 1,
    "semestre": [9, 10],
    "requisitos": [],
    "color": "#009b94"
},
  {
    "codigo": "MED374",
    "nombre": "Internado de Pediatria (ANUAL)",
    "creditos": 44,
    "semestre": [11, 12],
    "requisitos": ["MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298"],
    "color": "#ffd700"
},
  {
    "codigo": "MED375",
    "nombre": "Internado de Cirugia (ANUAL)",
    "creditos": 44,
    "semestre": [11, 12],
    "requisitos": ["MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298"],
    "color": "#0000ff"
},
  {
    "codigo": "MED376",
    "nombre": "Internado de Obstetricia y Ginecologia (ANUAL)",
    "creditos": 44,
    "semestre": [11, 12],
    "requisitos": ["MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298"],
    "color": "#a52019"
},
  {
    "codigo": "MED300",
    "nombre": "Internado Electivo (ANUAL)",
    "creditos": 7,
    "semestre": [13, 14],
    "requisitos": ["BIO130", "BIO131", "FMM007", "MED016", "QUI109", "FMF019", "MED017", "MOR330", "MOR331", "QUI024", "BIO266", "BIO376", "HUF124", "MED121", "MOR332", "MOR333", "BIO148", "BIO242", "BIO320", "BIO321", "BIO377", "MED122", "MED131", "BIO250", "BIO251", "MED250", "MED257", "MED258", "MED278", "BIO288", "MED249", "MED259", "MED260", "MED279", "MED244", "MED287", "MED292", "MED294", "MED296", "MED245", "MED293", "MED295", "MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298", "MED399"],
    "color": "#00ff00"
},
  {
    "codigo": "MED377",
    "nombre": "Internado de Medicina Interna (ANUAL)",
    "creditos": 44,
    "semestre": [13, 14],
    "requisitos": ["MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298", "MED399"],
    "color": "#109dfa"
},
  {
    "codigo": "MED378",
    "nombre": "Internado de Medicina Comunitaria (ANUAL)",
    "creditos": 9,
    "semestre": [13, 14],
    "requisitos": ["BIO130", "BIO131", "FMM007", "MED016", "QUI109", "FMF019", "MED017", "MOR330", "MOR331", "QUI024", "BIO266", "BIO376", "HUF124", "MED121", "MOR332", "MOR333", "BIO148", "BIO242", "BIO320", "BIO321", "BIO377", "MED122", "MED131", "BIO250", "BIO251", "MED250", "MED257", "MED258", "MED278", "BIO288", "MED249", "MED259", "MED260", "MED279", "MED244", "MED287", "MED292", "MED294", "MED296", "MED245", "MED293", "MED295", "MED281", "MED282", "MED283", "MED284", "MED285", "MED297", "MED298", "MED399"],
    "color": "#40e0d0"
},
  {
    "codigo": "MED380",
    "nombre": "Internado Integrado (ANUAL)",
    "creditos": 5,
    "semestre": [13, 14],
    "requisitos": ["MED374", "MED375", "MED376"],
    "color": "#e44b8d"
  }
];

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
      await cargarProgreso();
      renderMalla();
    } catch (e) {
      console.error("Error cargando o renderizando:", e);
    }
  } else {
    usuario = null;
    loginContainer.style.display = "block";
    appContainer.style.display = "none";
    progreso = {};
  }
});

// Cargar progreso del usuario
async function cargarProgreso() {
  if (!usuario) return (progreso = {});
  try {
    const ref = db.collection("progresos").doc(usuario.uid);
    const snap = await ref.get();
    progreso = snap.exists ? snap.data() : {};
  } catch (error) {
    console.error("Error cargando progreso:", error);
    progreso = {};
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
            await db.collection("progresos").doc(usuario.uid).set(progreso);
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
