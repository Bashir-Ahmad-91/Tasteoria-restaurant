
//*********************** helper function ********************** */

let activeFoodItem = [];
let activCartItem = [];

async function foodCategories() {

    try {
        let response = await fetch('https://course.divinecoder.com/food-categories')
        let data = await response.json()


        document.getElementById('category_list').innerHTML = data.map(item => `<li data-id=${item.id}><a class="text-decoration-none d-inline-block text-uppercase" href="#">${item.name}</a></li>`).join('');



        getCategoriesHandler()


    } catch (error) {
        console.log(error);

    }
}


function cartElem(food) {
    return `<div class="col-lg-4 col-md-6 mb-4">
        <div class="food-cart-item">
            <div class="img position-relative">
                <img class="img-fluid w-100" src= ${food.image} alt="img">
                <div class="overlay position-absolute d-flex align-items-center">
                    <span>Price: ${food.price}/=</span>
                    <i class="fa-solid fa-star"></i>
                    <span> ${food.rating} (${food.rating_count})</span>
                </div>
            </div>
            <div class="text">
                <h4 class="pb-2">${food.name}</h4>
                <ul class="list-unstyled d-flex flex-wrap">
                    <li class="position-relative">4 chicken legs</li>
                    <li class="position-relative">Chili sauce</li>
                    <li class="position-relative">4 chicken legs</li>
                    <li class="position-relative">Soft Drinks</li>
                    <li class="position-relative">Soft Drinks</li>
                    <li class="position-relative">Chili sauce</li>
                </ul>
            </div>
            <a data-id="${food.id}" href="#category_list" class=" ${food.isAddtoCart == true ? 'active' : ''} add-to-cart d-flex justify-content-center align-items-center text-decoration-none">
                <i class="fa-solid fa-cart-plus"></i>
                <span class="d-inline-block">${food.isAddtoCart ? 'Added to cart' : 'Add to cart'}</span>
            </a>
        </div>
    </div>`

}

function appendAddedToCart() {
    let cartHtml = (food) => {
        return `  <tr>
                    <td>
                        <img src=${food.image} alt="img">
                    </td>
                    <td>
                        <span class="title" >${food.name}</span>
                    </td>
                    <td>
                        <span class="price">${food.price} TK </span>
                    </td>
                    <td>
                        <div class="quantity-area d-flex align-items-center">
                            <span class="quantity d-block mr-2">${food.quantity}</span>
                            <div class="plus-minus">
                                <ul class="d-flex list-unstyled m-0">
                                    <li class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-minus"></i></li>
                                    <li class="d-flex justify-content-center align-items-center"><i class="fa-solid fa-plus"></i></li>
                                </ul>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="total">${food.total} TK</span>
                    </td>
                    <td>
                        <span class="action">
                            <i class="fa-solid fa-trash-can"></i>
                        </span>
                    </td>
                  </tr>`;
    }

    let cartItemLoping = activCartItem.map(item => {
        return cartHtml(item)
    })

    document.querySelector('#added-item').innerHTML = cartItemLoping


}


//*********************** init function ********************** */


(() => {
    menu_responsive();
    foodCategories()
    appendFoodItemsToHtml('https://course.divinecoder.com/food/random/6')
    cartCount()
})();


function menu_responsive() {
    let menuToggle = document.getElementById('menu-toggle');
    let menuList = document.getElementById('menu-list');

    menuToggle.addEventListener('click', function (event) {
        event.preventDefault
        menuList.classList.toggle('active');
    });
}






//*********************** handler function ********************** */


async function appendFoodItemsToHtml(link, colback = () => { }) {
    try {
        let response = await fetch(link)

        let data = await response.json()



        data = Array.isArray(data) ? data : data.data;

        activeFoodItem = data.map(item => {

            let checkId = activCartItem.some(active => active.id == item.id)

            return {

                ...item,
                isAddtoCart: checkId
            }


        })



        document.getElementById('food_gallery').innerHTML = activeFoodItem.map(item => cartElem(item)).join('');



        colback()

        addToCartHandler()




    } catch (error) {
        console.log(error);
    }

}


function getCategoriesHandler() {
    let myli = document.querySelectorAll('#category_list li')


    Array.from(myli).forEach(lis => {
        lis.addEventListener('click', function (event) {
            event.preventDefault();

            let catagoryId = lis.getAttribute('data-id')


            lis.classList.add('active');

            appendFoodItemsToHtml(`https://course.divinecoder.com/food/by-category/${catagoryId}/6`, () => { lis.classList.remove('active') })



        })
    })

}


function cartCount() {
    let cartCountElem = document.querySelectorAll('.count-elem')
    let count = activCartItem.length


    count = count > 9 ? count : '0' + count;

    Array.from(cartCountElem).forEach(element => {


        if (count > 0) {
            element.classList.remove('d-none')
        } else {
            element.classList.add('d-none')

        }

        element.textContent = count

    })


}

function addToCartHandler() {
    let addToCartElem = document.querySelectorAll('.add-to-cart')

    Array.from(addToCartElem).forEach(btn => {
        btn.addEventListener('click', event => {
            event.preventDefault()

            let id = btn.getAttribute("data-id")

            let addedItem = activeFoodItem.find(item => {
                return item.id == id
            })


            let activChack = activCartItem.some(item => item.id == id)

            !activChack && activCartItem.push({
                id: addedItem.id,
                name: addedItem.name,
                image: addedItem.image,
                price: addedItem.price,
                quantity: 1,
                total: addedItem.price
            })




            cartCount()
            appendAddedToCart()
            addedButton(id)
        })

    })
}


function addedButton(id) {
    let myButton = document.querySelector(`.add-to-cart[data-id="${id}"]`) 
    
    myButton.classList.add("active")

    if (myButton.classList.contains('active')) {
        myButton.querySelector('span').innerHTML = 'Added to cart'
    }else {
        myButton.querySelector('span').innerHTML = 'Add to cart'

    }
}













