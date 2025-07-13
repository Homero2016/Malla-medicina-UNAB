
const malla = [
  {
    semestre: 1,
    ramos: [
      { nombre: "Biología Celular", id: "bioCel", color: "#e6f7ff", desbloquea: ["anato", "fisio"], descripcion: "Créditos: 4<br>Requisito: Ninguno" },
    ]
  },
  {
    semestre: 2,
    ramos: [
      { nombre: "Anatomía", id: "anato", color: "#fff5e6", desbloquea: ["histo", "bioqui"], descripcion: "Créditos: 6<br>Requiere: Biología Celular" },
      { nombre: "Fisiología", id: "fisio", color: "#ffe6f0", desbloquea: [], descripcion: "Créditos: 7<br>Requiere: Biología Celular" }
    ]
  },
  {
    semestre: 3,
    ramos: [
      { nombre: "Histología", id: "histo", color: "#e6ffe6", desbloquea: [], descripcion: "Créditos: 4<br>Requiere: Anatomía" },
      { nombre: "Bioquímica", id: "bioqui", color: "#f0e6ff", desbloquea: [], descripcion: "Créditos: 6<br>Requiere: Anatomía" }
    ]
  }
];

function renderMalla() {
  const contenedor = document.getElementById("malla");
  malla.forEach(bloque => {
    const divSemestre = document.createElement("div");
    divSemestre.className = "semestre";
    const titulo = document.createElement("h2");
    titulo.textContent = `Semestre ${bloque.semestre}`;
    divSemestre.appendChild(titulo);

    bloque.ramos.forEach(ramo => {
      const divRamo = document.createElement("div");
      divRamo.textContent = ramo.nombre;
      divRamo.className = "ramo bloqueado";
      divRamo.id = ramo.id;
      divRamo.style.backgroundColor = ramo.color;
      divRamo.onclick = () => desbloquear(ramo.id);
      divRamo.onmouseenter = () => mostrarInfo(ramo.descripcion);
      divRamo.onmouseleave = () => ocultarInfo();
      divSemestre.appendChild(divRamo);
    });

    contenedor.appendChild(divSemestre);
  });

  malla[0].ramos.forEach(r => desbloquear(r.id, true));
}

function mostrarInfo(texto) {
  const infoBox = document.getElementById("info-box");
  infoBox.innerHTML = texto;
  infoBox.classList.remove("hidden");
}

function ocultarInfo() {
  document.getElementById("info-box").classList.add("hidden");
}

function desbloquear(id, inicial = false) {
  const ramo = document.getElementById(id);
  if (!ramo || ramo.classList.contains("desbloqueado") || ramo.classList.contains("completado")) return;

  if (!inicial && ramo.classList.contains("bloqueado")) {
    ramo.classList.remove("bloqueado");
    ramo.classList.add("completado");
    ramo.innerHTML += " ✅";

    const desbloquea = malla.flatMap(b => b.ramos).find(r => r.id === id)?.desbloquea || [];
    desbloquea.forEach(d => desbloquear(d));
  } else if (inicial) {
    ramo.classList.remove("bloqueado");
    ramo.classList.add("desbloqueado");
  }
}

renderMalla();
