let foto = document.querySelector("#fotoProfil");
let inputFoto = document.querySelector("#fotoInput");

// 1. Saat halaman pertama dibuka, cek dulu: ada foto tersimpan gak?
let fotoTersimpan = localStorage.getItem("fotoProfil");
if (fotoTersimpan) {
  foto.src = fotoTersimpan;
}

foto.addEventListener("click", function () {
  inputFoto.click();
});

inputFoto.addEventListener("change", function () {
  let fileTerpilih = inputFoto.files[0];

  let reader = new FileReader();
  reader.onload = function () {
    foto.src = reader.result;
    // 2. Simpan hasil bacaan foto ke localStorage
    localStorage.setItem("fotoProfil", reader.result);
  };
  reader.readAsDataURL(fileTerpilih);
});

// ambil elemen yang dibutuhin
let grid = document.querySelector(".proj-grid");
let inputNama = document.querySelector("#inputNamaProjek");
let inputDeskripsi = document.querySelector("#inputDeskripsiProjek");
let tombolTambah = document.querySelector("#tombolTambahProjek");

// 1. Saat halaman dibuka, cek localStorage — ada data lama gak?
let dataTersimpan = localStorage.getItem("daftarProjek");
let daftarProjek = dataTersimpan ? JSON.parse(dataTersimpan) : [];

// langsung tampilkan yang sudah tersimpan (kalau ada)
tampilkanSemuaProjek();

tombolTambah.addEventListener("click", function () {
  let projekBaru = {
    nama: inputNama.value,
    deskripsi: inputDeskripsi.value,
  };

  daftarProjek.push(projekBaru);
  tampilkanSemuaProjek();
  simpanKeLocalStorage();

  inputNama.value = "";
  inputDeskripsi.value = "";
});

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

function simpanKeLocalStorage() {
  localStorage.setItem("daftarProjek", JSON.stringify(daftarProjek));
}
