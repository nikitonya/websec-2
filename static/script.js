let section = document.querySelector('.sneakers_section');
let modal = document.getElementById("modalInfo");
let modalShoppingCart = document.getElementById("modalShoppingCart");
let span = document.getElementsByClassName("close")[0];
let spanShoppingCart = document.getElementsByClassName("close")[1];
let shoppingList = []

window.onload = function(){
    if (localStorage.getItem('shoppingList'))
        shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
    generateNikeSneakers()
}

span.onclick = function() {
    modal.style.display = "none";
}

spanShoppingCart.onclick = function() {
    modalShoppingCart.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === modalShoppingCart) {
        modalShoppingCart.style.display = "none";
    }
}

function generateNikeSneakers(){
    fetch('/nikes', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function generateAdidasSneakers(){
    fetch('/adidas', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function generateFilaSneakers(){
    fetch('/fila', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function generateZaraSneakers(){
    fetch('/zara', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function generateChanelSneakers(){
    fetch('/chanel', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function generateHMSneakers(){
    fetch('/hm', {
        method: 'GET'
    }).then(res => {
        return res.json();
    }).then(data => {
        regenerateGrid(data);
    });
}

function regenerateGrid(sneakers){
    section.innerHTML = '';
    const newItem = document.createElement('div');
    newItem.className="sneaker_grid"
    sneakers.map((sneaker, count) =>(
        newItem.innerHTML += `
    		 <div class="sneakers" id=${"sneaker_"+count}>
                        <div class="sneaker_image">
                            <img
                                    src=${"photo/" + sneaker.image}
                                    width="250"
                                    height="220"
                                    alt=${"Sneaker Image" + count}
                                    style="background-color: #f1f1f1;"
                            />
                        </div>
                        <div class="sneaker_details">
                            <p class="sneaker_name">${sneaker.brand}</p>
                            <p class="sneaker_price">${sneaker.price}</p>
                            <p class="sneaker_brand">${sneaker.model}</p>
                        </div>
                    </div>
    		`
    ))
    section.appendChild(newItem);
    sneakers.map((sneaker, count) =>(
        document.getElementById("sneaker_"+count).addEventListener('click', (event) => {
            openSneakerInfo(sneaker)
        })
    ))
}

function openSneakerInfo(sneaker){
    modal.style.display = "block";
    document.querySelector(".modal-info-container").innerHTML = `
      		 <div class="sneaker_modal">
                        <div class="sneaker_modal_image">
                            <img
                                    src=${"photo/" + sneaker.image}
                                    height="400"
                                    alt="Sneaker Image 1"
                            />
                        </div>
                        <div class="sneaker_modal_details">
                            <h2 class="sneaker_modal_brand">${sneaker.model}</h2>
                            <h3 class="sneaker_modal_price">Цена: ${sneaker.price}</h3>
                            <p class="sneaker_modal_description">${sneaker.description}</p>
                            <button class="modal_button">Добавить в корзину</button>
                        </div>
                    </div>
    `
    document.querySelector(".sneaker_modal_description").after(generateSizeButton(sneaker.size))
    document.querySelector(".modal_button").addEventListener('click', (event) => {
        modal.style.display = "none";
        shoppingList.push(
            {
                "model": sneaker.model,
                "price": sneaker.price,
                "size": getSelectSize()
            }
        )
        localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
    })
}

function getSelectSize(){
    const sizes = document.querySelectorAll('input[name="radio"]')
    for (const size of sizes) {
        if (size.checked) {
            return size.value;
        }
    }
}

function generateSizeButton(size){
    const newItem = document.createElement('div');
    newItem.className = "form_radio_group";
    size.map((one_size, count) =>(
        newItem.innerHTML += `
    		 <div class="form_radio_group-item">
                <input id=${"radio-"+count} type="radio" name="radio" value=${one_size} checked>
                <label for=${"radio-"+count}>${one_size}</label>
             </div>
    		`
    ))
    return newItem;
}

function openShoppingCart(){
    document.querySelector('#error_field').textContent = "";
    modalShoppingCart.style.display = "block";
    document.querySelector(".selected-sneakers").innerHTML = '';
    let newItem = document.createElement('div');
    newItem.className="selected-sneakers_rows"
    let sum = 0;
    shoppingList.map((sneaker_row, count) =>(
        sum+=sneaker_row.price,
        newItem.innerHTML += `
    		 <div class="sneaker_row" id=${"sneaker_row_"+count}>
                            <p class="sneaker_row_model">Модель: ${sneaker_row.model}</p>
                            <p class="sneaker_row_size">Размер: ${sneaker_row.size}</p>
                            <p class="sneaker_row_price">Цена: ${sneaker_row.price}</p>
                    </div>
    		`
    ))
    newItem.innerHTML += `
    		 <h2>Итоговая цена: ${sum}</h2>
    		`
    document.querySelector(".selected-sneakers").appendChild(newItem);
}

function buySneakers(){
    let user_name = document.querySelector('#user_name').value;
    let user_phone = document.querySelector('#phone').value;
    if(user_name===""||user_phone===""){
        document.querySelector('#error_field').textContent = "Проверьте заполнение полей"
    }else{
        let urlencoded = new URLSearchParams();
        urlencoded.append("phone", user_phone);
        urlencoded.append("name", user_name);
        urlencoded.append("order", localStorage.getItem('shoppingList'));
        fetch('/new_order', {
            method: 'POST',
            body:urlencoded,
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }).then(res => {
            shoppingList = [];
            localStorage.clear();
            modalShoppingCart.style.display = "none";
        });
    }
}