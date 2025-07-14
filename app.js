import { firebaseConfig } from './firebase-config,js'; 
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const loginBtn = document.getElementById("loginBtn");
const mallaDiv = document.getElementById("malla");
const loader = document.getElementById("loader");
const appContainer = document.getElementById("app");

let usuario = null;
let datosMalla = [];
let progreso = {};

loginBtn.onclick = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider).catch(console.error);
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    usuario = user;
    loader.style.display = 'none';
    appContainer.style.display = 'block';
    await cargarMalla();
    await cargarProgreso();
    renderMalla();
  }
});

async function cargarMalla() {
  const res = await fetch("data/malla.json");
  datosMalla = await res.json();
}

async function cargarProgreso() {
  const ref = doc(db, "progresos", usuario.uid);
  const snap = await getDoc(ref);
  progreso = snap.exists() ? snap.data() : {};
}

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
        await setDoc(doc(db, "progresos", usuario.uid), progreso);
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
