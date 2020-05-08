const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

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
const restaurantHeader = document.querySelector('.menu .section-heading');
const modalBody = document.querySelector('.modal-body');
const modalPriceTag = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');
const buttonPrimary = document.querySelector('.button-add');

let login = localStorage.getItem('gloDelivery');

const basket = [];

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok){
    throw new Error(`Ошибка по адресу ${url}, статсус ошиибки: ${response.status}!`);
  }
  return await response.json();
};

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
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  
  userName.textContent = 'Добро пожаловать, '+login+'!';
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
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



function createCardRestaurant (restaurant) {
  
  const { image, kitchen, name, price, products, stars, time_of_delivery } = restaurant
  const card = `
          <a class="card card-restaurant" data-products="${products}" data-name="${name}" data-kitchen="${kitchen}" data-price="${price}" data-stars="${stars}">
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${time_of_delivery}</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">От ${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
          </a>
          `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

function createCardGoods (goods) {
  const { id, name, description, image, price } = goods;
  const card = document.createElement('div');
  card.className = "card";
  card.insertAdjacentHTML('beforeend', `
            <img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title card-title-reg">${name}</h3>
							</div>
							<!-- /.card-heading -->
							<div class="card-info">
								<div class="ingredients">${description}</div>
							</div>
							<!-- /.card-info -->
							<div class="card-buttons">
								<button class="button button-primary button-add-cart" id="${id}">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
								<strong class="card-price card-price-bold">${price} ₽</strong>
							</div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
}

function showRestaurantHeader(name, price, stars, kitchen) {
  const header = `
					<h2 class="section-title restaurant-title">${name}</h2>
					<div class="card-info">
						<div class="rating">
							${stars}
						</div>
						<div class="price">От ${price} ₽</div>
						<div class="category">${kitchen}</div>
					</div>
  `;
  restaurantHeader.insertAdjacentHTML('beforeend', header);
}

function openGoods (event) {
  if(login){
    const target = event.target;
    const restaurant = target.closest('.card-restaurant');
      if (restaurant) {
        cardsMenu.textContent='';
        restaurantHeader.textContent='';
        containerPromo.classList.add('hide');
        restaurants.classList.add('hide');
        menu.classList.remove('hide');
        console.log(restaurant.dataset.name);
        showRestaurantHeader(restaurant.dataset.name, restaurant.dataset.price, restaurant.dataset.stars, restaurant.dataset.kitchen);
        getData(`./db/${restaurant.dataset.products}`).then(function(data){
          data.forEach(createCardGoods)
        });

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

function addToCard (event) {
  const target = event.target;
  const buttonAddToCard = target.closest('.button-add-cart');
  if(buttonAddToCard) {
    const cart = target.closest('.card');
    const title = cart.querySelector('.card-title-reg').textContent;
    const cost = cart.querySelector('.card-price').textContent;
    const id = buttonAddToCard.id;
    
    const food = basket.find(function(item){
      return item.id === id;
    });
    
    if (food) {
      food.count +=1;
    } else {
      basket.push({
        id: id,
        title: title,
        cost: cost,
        count: 1
      });
    }
    console.log(basket);
  }
}

function renderCard () {
  modalBody.textContent='';
  modalPriceTag.textContent='0 ₽'
  basket.forEach(function({ id, title, cost, count }) {
    const itemCard = `
        <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
    `
    modalBody.insertAdjacentHTML('afterbegin', itemCard);
  });
  const totalPrice = basket.reduce(function(result, item) {
    return result = result + (parseFloat(item.cost)*item.count);
  }, 0);
  modalPriceTag.textContent=totalPrice + ' ₽';
}

function changeCount(event){
  const target = event.target;
  if(target.classList.contains('counter-minus')) {
    const food = basket.find(function(item) {
      console.log(target.dataset.id)
      return item.id === target.dataset.id;
    });
    //console.log(food)
    food.count--;
    if(food.count === 0){
      basket.splice(basket.indexOf(food), 1);
    }
    renderCard();
  }

  if(target.classList.contains('counter-plus')) {
    const food = basket.find(function(item) {
      return item.id === target.dataset.id;
    });
    food.count++;
    renderCard();
  }

}

function init () {
  localStorage.clear();
  getData('./db/partners.json').then(function(data){
    data.forEach(createCardRestaurant)
  });

  cartButton.addEventListener("click", function(){
    renderCard();
    toggleModal();
  });
  clearCart.addEventListener("click", function(){
    basket.length = 0;
    renderCard();
  })
  buttonPrimary.addEventListener("click", function(){
    basket.forEach(function(item){
      localStorage.setItem(item.id, item.title+' '+item.count + ' шт. '+item.cost);
    })
    
  })
  modalBody.addEventListener("click", changeCount)
  close.addEventListener("click", toggleModal);
  cardsMenu.addEventListener('click', addToCard);
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', openRestaraunts);
  checkAuth();

}

init();