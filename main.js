// firebase-config + lógica unificada
const firebaseConfig = {
  apiKey: "AIzaSyDbz-PJ9OSELTu1tTg2hSPAST8VouWqeEc",
  authDomain: "malla-medicina-unab.firebaseapp.com",
  projectId: "malla-medicina-unab",
  storageBucket: "malla-medicina-unab.firebasestorage.app",
  messagingSenderId: "624124095109",
  appId: "1:624124095109:web:83649db993b8f570afd7ec",
  measurementId: "G-QR06PHWGZX"
};
// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// DOM
const loginBtn = document.getElementById("loginBtn");
const mallaDiv = document.getElementById("malla");
const loader = document.getElementById("loader");
const appContainer = document.getElementById("app");

let usuario = null;
let datosMalla = [];
let progreso = {};

// Login con Google
loginBtn.onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).catch(console.error);
};

// Ver cambios en el login
auth.onAuthStateChanged(async (user) => {
  if (user) {
    usuario = user;
    loader.style.display = 'none';
    appContainer.style.display = 'block';
    await cargarMalla();
    await cargarProgreso();
    renderMalla();
  }
});

// Cargar la malla
async function cargarMalla() {
  const res = await fetch("data/malla.json");
  datosMalla = await res.json();
}

// Cargar progreso del usuario desde Firestore
async function cargarProgreso() {
  const ref = db.collection("progresos").doc(usuario.uid);
  const snap = await ref.get();
  progreso = snap.exists ? snap.data() : {};
}

// Renderizar malla en pantalla
function renderMalla() {
  mallaDiv.innerHTML = '';
  datosMalla.forEach(ramo => {
    const div = document.createElement("div");
    div.className = "ramo bloqueado";
    div.innerText = ramo.nombre;
    div.style.background = ramo.color;

    if (!ramo.requisitos.length || ramo.requisitos.every(r => progreso[r])) {
      div.classList.remove("bloqueado");
      div.classList.add("desbloqueado");
      div.onclick = async () => {
        progreso[ramo.codigo] = true;
        await db.collection("progresos").doc(usuario.uid).set(progreso);
        renderMalla();
      };
    }

    if (progreso[ramo.codigo]) {
      div.classList.add("aprobado");
      div.innerHTML += " ✅";
    }

    mallaDiv.appendChild(div);
  });
}
