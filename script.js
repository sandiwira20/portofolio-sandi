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
    let nomor = String(i + 1).padStart(2, "0");
    let warnaThumb = ["kuning", "pink-soft", "lime"][i % 3];
    let tombolDetail = p.url
      ? `<a href="${p.url}" target="_blank" rel="noopener" class="btn-detail-proyek">Detail Proyek &rarr;</a>`
      : `<span class="btn-detail-proyek btn-detail-disabled">Belum ada link</span>`;

    let thumbContent = p.gambar
      ? `<img src="${encodeURI(p.gambar)}" alt="${p.nama}" style="width: 100%; height: 100%; object-fit: cover;" />`
      : `<span class="proj-thumb-huruf">${p.nama.charAt(0).toUpperCase()}</span>`;

    grid.innerHTML += `
      <div class="proj-card-v2">
        <div class="proj-thumb-v2" style="background:var(--${warnaThumb}); overflow: hidden;">
          <span class="proj-num">${nomor}</span>
          ${thumbContent}
        </div>
        <div class="proj-body-v2">
          <h3>${p.nama}</h3>
          <p>${p.deskripsi}</p>
          ${tombolDetail}
        </div>
      </div>
    `;
  }
}
