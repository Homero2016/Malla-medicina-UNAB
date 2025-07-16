
// ========================= CONFIGURACIÓN FIREBASE ========================= //
const firebaseConfig = {
  apiKey: "AIzaSyDbz-PJ9OSELTu1tTg2hSPAST8VouWqeEc",
  authDomain: "malla-medicina-unab.firebaseapp.com",
  projectId: "malla-medicina-unab",
  storageBucket: "malla-medicina-unab.appspot.com",
  messagingSenderId: "956870768152",
  appId: "1:956870768152:web:cc005407a395e3db7e2e24",
};

// Inicialización Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ========================= VARIABLES GLOBALES ========================= //
let userId = null;
let mallaData = {};
let ramosAprobados = {};
let promediosRamos = {};

const loginContainer = document.getElementById("login-container");
const appContainer = document.getElementById("app");
const mallaContainer = document.getElementById("malla");
const resumenContainer = document.getElementById("resumen");
const leyenda = document.getElementById("leyenda");

// ========================= AUTENTICACIÓN ========================= //
document.getElementById("loginBtn").addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try {
    const result = await auth.signInWithPopup(provider);
    userId = result.user.uid;
    await cargarDatosUsuario();
    loginContainer.style.display = "none";
    appContainer.style.display = "block";
    leyenda.style.display = "block";
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
});

async function cargarDatosUsuario() {
  const userDoc = await db.collection("usuarios").doc(userId).get();
  if (userDoc.exists) {
    ramosAprobados = userDoc.data().ramosAprobados || {};
    promediosRamos = userDoc.data().promediosRamos || {};
  }
  await cargarMalla();
}

// ========================= CARGA DE MALLA ========================= //
async function cargarMalla() {
  const response = await fetch("malla.json");
  mallaData = await response.json();
  renderizarMalla();
  actualizarResumen();
}

// Resto del archivo sigue...
