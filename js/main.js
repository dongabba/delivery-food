const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("is-open");
}

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const password = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginErrorMessage = document.querySelector('.login-error-message');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('gloDelivery');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
}


function authorized() {
  console.log('yes');
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  
  userName.textContent = 'Добро пожаловать, '+login+'!';
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);

}

function notAuthorized() {
  console.log('no');
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;
    localStorage.setItem('gloDelivery', login)
    if (!login.trim()) {
      loginErrorMessage.style.display = 'inline';
    } else {
    toggleModalAuth();
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    loginForm.removeEventListener("submit", logIn);
    loginForm.reset();
    loginErrorMessage.style.display = ''
    checkAuth();
    }
  }

  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
  loginForm.addEventListener("submit", logIn);
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    notAuthorized();
  }
}

checkAuth();

function createCardRestaurant () {
  const card = `
          <a class="card card-restaurant">
						<img src="img/tanuki/preview.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">Тануки</h3>
								<span class="card-tag tag">60 мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									4.5
								</div>
								<div class="price">От 1 200 ₽</div>
								<div class="category">Суши, роллы</div>
							</div>
						</div>
          </a>
          `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGoods () {
  const card = document.createElement('div');
  card.className = "card";
  card.insertAdjacentHTML('beforeend', `
            <img src="img/pizza-plus/pizza-vesuvius.jpg" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">Пицца Везувий</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, пепперони, перец
									«Халапенье», соус «Тобаско», томаты.
								</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price-bold">545 ₽</strong>
							</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

function openGoods (event) {
  if(login){
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
      if (restaurant) {
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        cardsMenu.textContent='';
        createCardGoods();
        createCardGoods();
        createCardGoods();
    }   
  } else {
    toggleModalAuth();
  }
  
}

function openRestaraunts(){
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide')
}

cardsRestaurants.addEventListener('click', openGoods);
logo.addEventListener('click', openRestaraunts);