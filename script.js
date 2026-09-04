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

tombolTambah.addEventListener("click", async function () {
  const { collection, addDoc } = window.firestoreFns;

  let projekBaru = {
    nama: inputNama.value,
    deskripsi: inputDeskripsi.value,
  };

  await addDoc(collection(window.db, "projects"), projekBaru);

  inputNama.value = "";
  inputDeskripsi.value = "";

  muatProjekDariFirebase();
});

let modalHapus = document.querySelector("#modalHapus");
let modalHapusYa = document.querySelector("#modalHapusYa");
let modalHapusBatal = document.querySelector("#modalHapusBatal");
let idAkanDihapus = null;

function tampilkanSemuaProjek() {
  grid.innerHTML = "";
  for (let i = 0; i < daftarProjek.length; i++) {
    let p = daftarProjek[i];
    let tombolHapus = window.auth.currentUser
      ? `<button class="tombolHapusProjek" data-id="${p.id}">Hapus</button>`
      : "";
    grid.innerHTML += `
      <div class="proj-card">
        <h3>${p.nama}</h3>
        <p>${p.deskripsi}</p>
        ${tombolHapus}
      </div>
    `;
  }

  document.querySelectorAll(".tombolHapusProjek").forEach((btn) => {
    btn.addEventListener("click", function () {
      idAkanDihapus = this.dataset.id;
      modalHapus.style.display = "flex";
    });
  });
}

modalHapusBatal.addEventListener("click", function () {
  idAkanDihapus = null;
  modalHapus.style.display = "none";
});

modalHapusYa.addEventListener("click", async function () {
  const { doc, deleteDoc } = window.firestoreFns;
  await deleteDoc(doc(window.db, "projects", idAkanDihapus));
  modalHapus.style.display = "none";
  muatProjekDariFirebase();
});

function simpanKeLocalStorage() {
  localStorage.setItem("daftarProjek", JSON.stringify(daftarProjek));
}

const { signInWithEmailAndPassword, signOut, onAuthStateChanged } =
  window.authFns;

let loginBox = document.querySelector("#loginBox");
let formTambahProjek = document.querySelector("#formTambahProjek");
let inputEmail = document.querySelector("#inputEmail");
let inputPassword = document.querySelector("#inputPassword");
let tombolLogin = document.querySelector("#tombolLogin");
let tombolLogout = document.querySelector("#tombolLogout");
let loginStatus = document.querySelector("#loginStatus");

onAuthStateChanged(window.auth, function (user) {
  if (user) {
    loginBox.style.display = "none";
    formTambahProjek.style.display = "block";
  } else {
    loginBox.style.display = "block";
    formTambahProjek.style.display = "none";
  }
});

tombolLogin.addEventListener("click", async function () {
  try {
    await signInWithEmailAndPassword(
      window.auth,
      inputEmail.value,
      inputPassword.value,
    );
    loginStatus.textContent = "";
  } catch (error) {
    loginStatus.textContent = "Login gagal, cek email/password.";
  }
});

tombolLogout.addEventListener("click", async function () {
  await signOut(window.auth);
});
