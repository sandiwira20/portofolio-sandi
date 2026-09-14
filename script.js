let grid = document.querySelector(".proj-grid");
let daftarProjek = [];

async function muatProjekDariFirebase() {
  const { collection, getDocs } = window.firestoreFns;
  const snapshot = await getDocs(collection(window.db, "projects"));

  daftarProjek = [];
  snapshot.forEach((docSnap) => {
    daftarProjek.push({ id: docSnap.id, ...docSnap.data() });
  });

  tampilkanSemuaProjek();
}

muatProjekDariFirebase();

function tampilkanSemuaProjek() {
  grid.innerHTML = "";
  for (let i = 0; i < daftarProjek.length; i++) {
    let p = daftarProjek[i];
    grid.innerHTML += `
      <div class="proj-card">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
      </div>
    `;
  }
}
