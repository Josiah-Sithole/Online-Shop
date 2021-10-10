let carts = document.querySelectorAll('.add-cart');
//variable used to grab the products into the cart with their specific details
//this is the only way to track on how many products are in the cart
let products = [{
        name: "headphones",
        tag: "headphones",
        price: 10,
        inCart: 0,
    },
    {
        name: "watch",
        tag: "watch",
        price: 20,
        inCart: 0, //zero represents nothing inCart
    },
    {
        name: "powerbank",
        tag: "powerbank",
        price: 15,
        inCart: 0,
    },
    {
        name: "huawei",
        tag: "huawei",
        price: 10,
        inCart: 0,
    },
    {
        name: "charger",
        tag: "charger",
        price: 18,
        inCart: 0,
    },
    {
        name: "macbook",
        tag: "macbook",
        price: 25,
        inCart: 0
    }
];
//whenever we load the page this function must be executed
displayCart();

//function will be called whenever the click event is delivered to the target
//all buttons with add-cart class have been targeted with javascript
//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

for (let i = 0; i < carts.length; i++) { //loops is going to run from zero to 5
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]); //each of the products have an index thats why i put [i]
        totalCost(products[i])
    });
}
//this function checks the products in the localStorage if they exist

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}
//this function cartNumbers is attached to the eventListener
function cartNumbers(_product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');

    //converting the number by (parseInt)from a string that was passed to the local storage
    productNumbers = parseInt(productNumbers);
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    /*to check if they was already products in the cart return something, 
    and in this case they is something then we must be able to add other items as well*/
    //grabbing all what we have in the localStorage and adding 1

    if (action) {
        localStorage.setItem("cartNumbers", productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
        //console.log("action");

    } else if (productNumbers) {
        localStorage.setItem("cartNumbers", productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;

    } else {
        localStorage.setItem("cartNumbers", 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(_product);
}

//when we click on this we added our products to the cart which equals to 1
function setItems(_product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems); //passing JSON into a javascript object
    //console.log(cartItems);

    //the second time you click its going to check if the cart item is null
    //null represents absence of an object/item
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null

    if (cartItems != null) {
        let currentProduct = _product.tag;
        if (cartItems[currentProduct] == undefined) {
            cartItems = {
                //the rest operator(...) in javascript
                ...cartItems,
                [currentProduct]: _product //add new products, if there was products in the cart
            }
        }
        cartItems[currentProduct].inCart += 1;
    } else {
        _product.inCart = 1; //when clicking for the first time we updating products incart to 1.
        cartItems = {
            [_product.tag]: _product //then we create variable items to be equal to the product "tag" name
        };
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

function totalCost(_product, action) {
    let cart = localStorage.getItem("totalCost");
    if (action) {
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart - _product.price);
    } else if (cart != null) {
        cart = parseInt(cart);
        localStorage.setItem("totalCost", cart + _product.price);
        alert("The Total Price is" + " " + (cart + _product.price));
    } else {
        localStorage.setItem("totalCost", _product.price);
    }
}

function displayCart() { //when the page load this function must be executed straight away
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let cart = localStorage.getItem("totalCost");
    cart = parseInt(cart);
    let productContainer = document.querySelector('.products');

    //backticks in the (if) is the way we can inject variables inside the strings 
    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map((item, _index) => {

            productContainer.innerHTML += `
                <div class="product">
                <div>
                <ion-icon name="close-circle" style="color: red"></ion-icon>
                <img src="./images/${item.tag}.jpg">
                <span class="sm-hide">${item.name}</span>
                </div>
                <div class="price sm-hide">$${item.price},00</div>
                <div class="quantity">
                    <ion-icon class="decrease"
                     name="arrow-dropleft-circle"></ion-icon>
                          <span>${item.inCart}</span>
                      <ion-icon class="increase" 
                      name="arrow-dropright-circle"></ion-icon>
                </div>

                <div class="total">$${item.inCart * item.price},00</div>
                `;
        });
        productContainer.innerHTML += `
               <div class="total">
                   Total  <img id="bin" src="./images/cash.png" style="width:30px"/>: $${cart},00             
               </div>
              `
        productContainer.innerHTML += `
              <div class="vat">
                  Vat: $${cart * 0.15}                
              `
        deleteButtons();
        manageQuantity();
    }
}

function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease'); //selets all decrease buttons
    let increaseButtons = document.querySelectorAll('.increase'); //selets all increase buttons
    let currentQuantity = 0;
    let currentProduct = ''; //when they is no product increment by 1 starting from 0
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for (let i = 0; i < increaseButtons.length; i++) { //loop  through all the buttons 
        decreaseButtons[i].addEventListener('click', () => { //decrease products on click
            //console.log(cartItems);
            currentQuantity = decreaseButtons[i].parentElement.querySelector('span').textContent;
            //console.log(currentQuantity);
            currentProduct = decreaseButtons[i].parentElement.previousElementSibling
                .previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g, '').trim();
            //console.log(currentProduct);

            if (cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], "decrease");
                totalCost(cartItems[currentProduct], "decrease");
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                displayCart();

            }
        });

        increaseButtons[i].addEventListener('click', () => { //when clicked increase buttons a function will be executed 
            currentQuantity = increaseButtons[i].parentElement.querySelector('span').textContent;

            currentProduct = increaseButtons[i].parentElement.previousElementSibling
                .previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g, '').trim();
            //console.log(currentProduct); 
            //console.log(cartItems);
            //console.log(currentQuantity);

            //add plus one from the current product in cart 
            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }
}
//delete product in cart function
function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productNumbers = localStorage.getItem('cartNumbers');
    let cartCost = localStorage.getItem("totalCost");
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productName;
    //console.log(cartItems);

    for (let i = 0; i < deleteButtons.length; i++) { //for loops through all delete buttons in the page
        deleteButtons[i].addEventListener('click', () => { //when clicked the buttons will execute the function
            productName = deleteButtons[i].parentElement.textContent.toLocaleLowerCase().replace(/ /g, '').trim();

            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);
            localStorage.setItem('totalCost', cartCost - (cartItems[productName].price * cartItems[productName].inCart));

            delete cartItems[productName]; //target a specific product name
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            displayCart();
            onLoadCartNumbers();
        })
    }
}
displayCart();
onLoadCartNumbers(); //when the entire document loads this function must be executed

//this function will hide the entire text within the p tags
//the speed parameter is included in the hide()*/
//https://www.w3schools.com/jquery/jquery_hide_show.asp
$(document).ready(function () {
    $("#hide").click(function () {
        $("p").hide(1000);

    });

    $("#show").click(function () {
        $("p").show();

    });
    //Chaining allows to run multiple jQuery methods within a single statement.
    //https://www.w3schools.com/jquery/jquery_chaining.asp

    $("#btn").click(function () {
        $(".hello").css("color", "gold")
            .slideUp(2000)
            .slideDown(2000);
    });
    $('.menuBackground ul li').hover(function () {
        $(this).children('ul').stop(true, false, true).slideToggle(400);
    });

    //an alert message will show up when get coupon button is clicked
    //the code put in the page are just random letters and number added on jquery function 
    $('#coupon').on('click', function () {
        alert("J-Sithy Brand Coupon Code:" + '\n' + "25% off: 0AQRJSITHY7" +
            '\n' + "15% off: 0AQRJSITHY7" + '\n' + "10% off: 0AQRJSITHY7") //"n" representing newline
    });

});

