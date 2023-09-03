const API = "http://localhost:8000/cars";

let searchValue = "";
let inpName = document.querySelector(".inpName");
let inpAge = document.querySelector(".inpAge");
let inpCategory = document.querySelector(".inpCategory");
let inpPrice = document.querySelector(".inpPrice");
let inpImage = document.querySelector(".inpImg");
let inpDescr = document.querySelector("#inpDescr");
let btnAdd = document.getElementById("addBtn");
let modalForm = document.getElementById("modalForm");
let btnOpen = document.getElementById("btnForOpen");
let modalDiv = document.querySelector(".main-modal");
let sectionCars = document.getElementById("sectionCars");
let btnClose = document.querySelector(".btn-closer");
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");
let currentPage = 1;
let countPage = 1;
let selectedCategory = "";

readCars();

btnOpen.addEventListener("click", () => {
  modalDiv.style.display = "block";
});
btnAdd.addEventListener("click", (event) => {
  event.preventDefault();
  console.log(inpDescr.value);
  if (
    !inpName.value.trim() ||
    !inpAge.value.trim() ||
    !inpCategory.value.trim() ||
    !inpPrice.value.trim() ||
    !inpImage.value.trim() ||
    !inpDescr.value.trim()
  ) {
    alert("Введите все данные");
    return;
  }
  let newCar = {
    carName: inpName.value,
    carAge: inpAge.value,
    carCategory: inpCategory.value,
    carPrice: inpPrice.value,
    carImage: inpImage.value,
    carDescr: inpDescr.value,
  };
  createCars(newCar);
  readCars();
  modalDiv.style.display = "none";
});

//Create
function createCars(cars) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(cars),
  }).then(() => readCars());
  inpName.value = "";
  inpAge.value = "";
  inpCategory.value = "";
  inpPrice.value = "";
  inpImage.value = "";
  inpDescr.value = "";
}

btnClose.addEventListener("click", () => {
  modalDiv.style.display = "none";
});
function readCars() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then((res) => res.json())
    .then((data) => {
      sectionCars.innerHTML = "";
      data.forEach((item) => {
        if (
          (!searchValue ||
            item.carName.toLowerCase().includes(searchValue.toLowerCase())) &&
          (!selectedCategory || selectedCategory === item.carCategory)
        ) {
          sectionCars.innerHTML += `
            <div class="card m-4 cardBook" style="width: 18rem; border-radius: 15px;">
              <div class="img-box" style="height: 280px; border-radius: 15px;">
                <img id="${item.id}" src="${
            item.carImage
          }" class="card-img-top detailsCard" style="height: 200px; border-radius: 15px;" alt="${
            item.carName
          }" />
              </div>
              <div class="card-body" style="display: flex; flex-direction: column; justify-content: space-between; max-height: 250px;">
                <h5 class="card-title">${item.carName}</h5>
                <p class="card-text">${item.carCategory}</p>
                <p class="card-text">${item.carPrice}</p>
                ${
                  adminRole
                    ? `<div style="display: flex; justify-content: space-between;"> 
                        <button class="btn mt-1 btnDelete" style="background-color: white; color: black; display: flex;" id="${item.id}">Delete</button> 
                        <button class="btn mt-1 btnEdit" style="background-color: white; color: black; display: flex;" id="${item.id}" data-bs-toggle="modal" data-bs-target="#exampleModal">Edit</button> 
                      </div>`
                    : ""
                } 
                <div style="display: flex; justify-content: space-between;">
                  ${
                    isLogin
                      ? `<button class="btn btn-outline-danger descr descr-button" id="${item.id}">
                          Описание
                        </button>
                        <button class="btn btn-outline-danger btn-sm btnBuy" id="${item.id}">
                          Оформить заказ
                        </button>`
                      : ""
                  }
                </div>
              </div>
            </div>
          `;
        }
      });
      if (isLogin) {
        const buyButtons = document.querySelectorAll(".btnBuy");
        buyButtons.forEach((buyButton) => {
          buyButton.addEventListener("click", () => {
            modalDivSp.style.display = "block";
          });
        });
      }
      pageFunc();
    });
}
readCars();

//! delete

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readCars());
  }
});

//! edit

let editInpName = document.getElementById("editInpName");
let editInpAge = document.getElementById("editInpAge");
let editInpCategory = document.getElementById("editInpCategory");
let editInpPrice = document.getElementById("editInpPrice");
let editInpImage = document.getElementById("editInpImage");
let editBtnSave = document.getElementById("editBtnSave");
let editInpDescr = document.querySelector("#editInpDescr");

document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];
  if (arr.includes("btnEdit")) {
    e.preventDefault();
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.carName;
        editInpAge.value = data.carAge;
        editInpCategory.value = data.carCategory;
        editInpPrice.value = data.carPrice;
        editInpImage.value = data.carImage;
        editInpDescr.value = data.carDescr;
        editBtnSave.setAttribute("data-id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let editedCar = {
    carName: editInpName.value,
    carAge: editInpAge.value,
    carCategory: editInpCategory.value,
    carPrice: editInpPrice.value,
    carImage: editInpImage.value,
    carDescr: editInpDescr.value,
  };
  editCar(editedCar, editBtnSave.getAttribute("data-id"));
});

function editCar(editedCar, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedCar),
  }).then(() => readCars());
}

// SEARCH
let inpSearch = document.getElementById("inpSearch");

inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  currentPage = 1;
  readCars();
});

// PAGINATION
function pageFunc() {
  fetch(`${API}?q=${searchValue}`)
    .then((res) => res.json())
    .then((data) => {
      countPage = Math.ceil(data.length / 6);
    });
}

prevBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentPage <= 1) return;
  currentPage--;
  readCars();
});

nextBtn.addEventListener("click", (event) => {
  event.preventDefault();
  if (currentPage >= countPage) return;
  currentPage++;
  readCars();
});

// // // DETAILS

document.addEventListener("click", (e) => {
  let classList = e.target.classList;
  if (classList.contains("descr")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        let description = data.carDescr;
        document.getElementById("descriptionContent").textContent = description;
        let descriptionModal = new bootstrap.Modal(
          document.getElementById("descriptionModal")
        );
        descriptionModal.show();
      });
  }

  if (classList.contains("btn-closer")) {
    modalDiv.style.display = "none";
  }
});

// filtration
document.addEventListener("DOMContentLoaded", () => {
  let categoryDropdown = document.getElementById("categoryDropdown");
  let categoryDropdownItems = document.querySelectorAll(
    ".dropdown-item[data-category]"
  );

  categoryDropdownItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      event.preventDefault();
      selectedCategory = event.target.getAttribute("data-category");
      currentPage = 1;
      readCars();

      categoryDropdown.textContent = selectedCategory || "Категория";
    });
  });
});

// Sign in
const usersApi = "http://localhost:8000/users";

let signInOpen = document.getElementById("signInOpen");
let signInModal = document.querySelector(".main-modal2");
let btnCloseSign = document.querySelector(".btn-closer2");
let inpSignLog = document.querySelector(".inpSignLog");
let inpSignPass = document.querySelector(".inpSignPass");
let inpSignConfirm = document.querySelector(".inpSignConfirm");
let btnSaveSign = document.querySelector(".btn-save2");

signInOpen.addEventListener("click", () => {
  signInModal.style.display = "block";
});

btnCloseSign.addEventListener("click", () => {
  signInModal.style.display = "none ";
});

btnSaveSign.addEventListener("click", (event) => {
  event.preventDefault();
  if (
    !inpSignLog.value.trim() ||
    !inpSignPass.value.trim() ||
    !inpSignConfirm.value.trim()
  ) {
    alert("Введите все данные");
    return;
  }
  if (inpSignPass.value !== inpSignConfirm.value) {
    alert("Пароль и подтверждение пароля не совпадают");
    return;
  }

  let user = {
    login: inpSignLog.value,
    password: inpSignPass.value,
    passwordConfirm: inpSignConfirm.value,
    isAdmin: false,
    isUser: true,
  };
  fetch(usersApi, {
    method: "POST",
    headers: {
      "Content-type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(user),
  });
  inpSignLog.value = "";
  inpSignPass = "";
  inpSignConfirm = "";
  signInModal.style.display = "none";
  alert("Вы успешно зарегестрировались");
});

// authorisation
let logInOpen = document.getElementById("logInOpen");
let inpLogInName = document.querySelector(".inpLogInName");
let inpLogInPassword = document.querySelector(".inpLogInPassword");
let btnLogIn = document.querySelector(".btn-save3");
let btnLogInClose = document.querySelector(".btn-closer3");
let logOutBtn = document.getElementById("logOut");
let logInModal = document.querySelector(".main-modal3");
let logUser = [];
let isLogin = false;
let adminRole = false;

logInOpen.addEventListener("click", () => {
  logInModal.style.display = "block";
});

btnLogInClose.addEventListener("click", () => {
  logInModal.style.display = "none";
});

btnLogIn.addEventListener("click", (event) => {
  event.preventDefault();
  if (!inpLogInName.value.trim() || !inpLogInPassword.value.trim()) {
    alert("Заполните поля");
    return;
  }
  let user = {
    login: inpLogInName.value,
    password: inpLogInPassword.value,
  };
  let userCheck = false;
  let userName;
  fetch(usersApi)
    .then((res) => res.json())
    .then((data) => {
      data.forEach((item) => {
        if (item.login == user.login && item.password == user.password) {
          userCheck = true;
          logUser = item;
          userName = logUser.login;
        }
      });
      if (userCheck) {
        isLogin = true;
        logInModal.style.display = "none";
        readCars();
        showIfLogIn(userName);
      } else {
        alert("Такого пользователя не существует");
        logInModal.style.display = "none";
      }
      if (logUser.isAdmin) {
        adminRole = true;
        readCars();
        showIfAdmin();
      }

      console.log(logUser);
    });
});

function showIfLogIn(item) {
  signInOpen.style.display = "none";
  logInOpen.style.display = "none";
  logOutBtn.style.display = "block";
  let descrButtons = document.querySelectorAll(
    ".btn .btn-outline-danger .descr .descr-button"
  );
  isLogin = true;
  descrButtons.forEach((button) => {
    if (logUser.isUser == true) {
      button.style.display = "block";
    }
  });
}

//logout
logOutBtn.addEventListener("click", () => {
  reloadPage();
});
function reloadPage() {
  location.reload();
}

function showIfAdmin(item) {
  signInOpen.style.display = "none";
  logInOpen.style.display = "none";
  logOutBtn.style.display = "block";
  btnOpen.style.display = "block";
  let openBtn = document.querySelectorAll("#btnForOpen");
  isAdmin = true;
  openBtn.forEach((button) => {
    if (logUser.isAdmin == true) {
      button.style.display = "block";
    }
  });
}

// Extra
let inpModalNameR = document.querySelector(".inpSpName");
let inpModalPhoneR = document.querySelector(".inpSpPhone");
let inpModalEmailR = document.querySelector("#inpSpEmail");
let btnModalSaveR = document.querySelector(".btn-saveSp");
let buttOpenSp = document.querySelectorAll(".btnBuy");
let modalDivSp = document.querySelector(".main-modalSp");
let btnCloseSp = document.querySelector(".btn-closerSp");
let modalFormSp = document.querySelector("#modalFormSp");

buttOpenSp.forEach((button) => {
  button.addEventListener("click", () => {
    modalDivSp.style.display = "block";
  });
});

function openModal() {
  modalDivSp.style.display = "block";
}
buttOpenSp.forEach((button) => {
  button.addEventListener("click", openModal);
});

modalFormSp.addEventListener("submit", (event) => {
  event.preventDefault(); //
  if (!inpModalNameR.value.trim() || !inpModalPhoneR.value.trim()) {
    alert("Заполните все данные");
  } else {
    let obj = {
      num: inpModalNameR.value,
      phone: inpModalPhoneR.value,
      email: inpSpEmail.value,
    };

    function setItemToStorage5(c) {
      let data = JSON.parse(localStorage.getItem("Reg")) || [];
      data.push(c);
      localStorage.setItem("Reg", JSON.stringify(data));
    }
    setItemToStorage5(obj);

    inpModalNameR.value = "";
    inpModalPhoneR.value = "";
    inpSpEmail.value = "";
    alert("Спасибо, что остаётесь с NEO!");
    modalDivSp.style.display = "none";
  }
});

btnCloseSp.addEventListener("click", () => {
  modalDivSp.style.display = "none";
});

const textElement = document.getElementById("animated-text");
const originalText = textElement.textContent;

function typeText(text, index = 0) {
  if (index < text.length) {
    textElement.textContent = text.substring(0, index + 1);
    setTimeout(() => {
      typeText(text, index + 1);
    }, 300);
  } else {
    setTimeout(() => {
      textElement.textContent = "";
      typeText(originalText);
    }, 1000);
  }
}

typeText(originalText);
