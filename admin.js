let grid = document.querySelector("#daftarProjekAdmin");
let listWrap = document.querySelector("#listWrap");
let inputNama = document.querySelector("#inputNamaProjek");
let inputDeskripsi = document.querySelector("#inputDeskripsiProjek");
let inputUrl = document.querySelector("#inputUrlProjek");
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

tombolTambah.addEventListener("click", async function () {
  if (!inputNama.value.trim() || !inputDeskripsi.value.trim()) {
    alert("Nama dan deskripsi projek wajib diisi.");
    return;
  }

  const { collection, addDoc } = window.firestoreFns;

  let projekBaru = {
    nama: inputNama.value.trim(),
    deskripsi: inputDeskripsi.value.trim(),
    url: inputUrl.value.trim() || null,
  };

  await addDoc(collection(window.db, "projects"), projekBaru);

  inputNama.value = "";
  inputDeskripsi.value = "";
  inputUrl.value = "";

  muatProjekDariFirebase();
});

let modalHapus = document.querySelector("#modalHapus");
let modalHapusYa = document.querySelector("#modalHapusYa");
let modalHapusBatal = document.querySelector("#modalHapusBatal");
let idAkanDihapus = null;

function tampilkanSemuaProjek() {
  if (!window.auth.currentUser) {
    listWrap.style.display = "none";
    return;
  }

  listWrap.style.display = "block";
  grid.innerHTML = "";

  for (let i = 0; i < daftarProjek.length; i++) {
    let p = daftarProjek[i];
    grid.innerHTML += `
      <div class="admin-list-row">
        <h4>${p.nama}</h4>
        <p>${p.deskripsi}</p>
        <button class="btn-hapus-row tombolHapusProjek" data-id="${p.id}">Hapus</button>
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
    muatProjekDariFirebase();
  } else {
    loginBox.style.display = "block";
    formTambahProjek.style.display = "none";
    listWrap.style.display = "none";
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
