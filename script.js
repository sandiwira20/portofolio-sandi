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

document.querySelectorAll(".btn-copy[data-copy]").forEach(function (btn) {
  btn.addEventListener("click", async function () {
    await navigator.clipboard.writeText(btn.dataset.copy);
    let asli = btn.textContent;
    btn.textContent = "Tersalin!";
    setTimeout(function () {
      btn.textContent = asli;
    }, 1500);
  });
});

let tombolKirimPesan = document.querySelector("#tombolKirimPesan");
if (tombolKirimPesan) {
  tombolKirimPesan.addEventListener("click", function () {
    let nama = document.querySelector("#pesanNama").value;
    let email = document.querySelector("#pesanEmail").value;
    let isi = document.querySelector("#pesanIsi").value;

    let subjek = encodeURIComponent("Pesan dari Portofolio - " + nama);
    let body = encodeURIComponent(
      "Nama: " + nama + "\nEmail: " + email + "\n\n" + isi,
    );

    window.location.href = `mailto:email-kamu@contoh.com?subject=${subjek}&body=${body}`;
  });
}
