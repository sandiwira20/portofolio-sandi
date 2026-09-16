let grid = document.querySelector("#daftarProjekAdmin");
let listWrap = document.querySelector("#listWrap");
let inputNama = document.querySelector("#inputNamaProjek");
let inputDeskripsi = document.querySelector("#inputDeskripsiProjek");
let inputUrl = document.querySelector("#inputUrlProjek");
let inputGambarFile = document.querySelector("#inputGambarFile");
let uploadStatus = document.querySelector("#uploadStatus");
let tombolTambah = document.querySelector("#tombolTambahProjek");
let tombolBatalEdit = document.querySelector("#tombolBatalEdit");

let daftarProjek = [];
let idSedangDiedit = null;
let gambarLama = null;

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

  tombolTambah.disabled = true;
  uploadStatus.textContent = "Menyimpan data...";

  const { collection, addDoc, doc, updateDoc } = window.firestoreFns;
  let imageUrl = gambarLama;

  // Handle file upload jika ada
  let fileGambar = inputGambarFile.files[0];
  if (fileGambar) {
    uploadStatus.textContent = "Sedang mengupload gambar ke ImgBB...";
    
    const formData = new FormData();
    formData.append("image", fileGambar);
    
    // Gunakan API Key ImgBB kamu
    const imgbbKey = "9e770dc89c35cfc34638f8c7b1a7d5b0";
    
    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.success) {
        imageUrl = data.data.url;
      } else {
        throw new Error(data.error.message || "Gagal upload ke ImgBB");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Gagal mengupload gambar: " + error.message);
      tombolTambah.disabled = false;
      uploadStatus.textContent = "";
      return;
    }
  }

  let projekBaru = {
    nama: inputNama.value.trim(),
    deskripsi: inputDeskripsi.value.trim(),
    url: inputUrl.value.trim() || null,
    gambar: imageUrl,
  };

  if (idSedangDiedit) {
    await updateDoc(doc(window.db, "projects", idSedangDiedit), projekBaru);
    uploadStatus.textContent = "Projek berhasil diperbarui!";
  } else {
    await addDoc(collection(window.db, "projects"), projekBaru);
    uploadStatus.textContent = "Projek berhasil ditambahkan!";
  }

  idSedangDiedit = null;
  gambarLama = null;
  tombolTambah.textContent = "Tambah Projek";
  tombolBatalEdit.style.display = "none";

  inputNama.value = "";
  inputDeskripsi.value = "";
  inputUrl.value = "";
  inputGambarFile.value = "";
  
  setTimeout(() => {
    uploadStatus.textContent = "";
  }, 3000);

  tombolTambah.disabled = false;
  muatProjekDariFirebase();
});

tombolBatalEdit.addEventListener("click", function() {
  idSedangDiedit = null;
  gambarLama = null;
  inputNama.value = "";
  inputDeskripsi.value = "";
  inputUrl.value = "";
  inputGambarFile.value = "";
  tombolTambah.textContent = "Tambah Projek";
  tombolBatalEdit.style.display = "none";
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
        <div>
          <button class="btn-hapus-row tombolEditProjek" data-id="${p.id}" style="margin-right: 5px; background: var(--kuning); color: var(--hitam);">Edit</button>
          <button class="btn-hapus-row tombolHapusProjek" data-id="${p.id}">Hapus</button>
        </div>
      </div>
    `;
  }

  document.querySelectorAll(".tombolHapusProjek").forEach((btn) => {
    btn.addEventListener("click", function () {
      idAkanDihapus = this.dataset.id;
      modalHapus.style.display = "flex";
    });
  });

  document.querySelectorAll(".tombolEditProjek").forEach((btn) => {
    btn.addEventListener("click", function () {
      let id = this.dataset.id;
      let projek = daftarProjek.find(p => p.id === id);
      if (projek) {
        idSedangDiedit = id;
        gambarLama = projek.gambar || null;
        inputNama.value = projek.nama;
        inputDeskripsi.value = projek.deskripsi;
        inputUrl.value = projek.url || "";
        inputGambarFile.value = ""; // hapus jika ada file sblmnya
        tombolTambah.textContent = "Simpan Perubahan";
        tombolBatalEdit.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
