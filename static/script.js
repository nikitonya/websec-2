let section = document.querySelector('.sneakers_section');
let modal = document.getElementById("modalInfo");
let modalShoppingCart = document.getElementById("modalShoppingCart");
let span = document.getElementsByClassName("close")[0];
let spanShoppingCart = document.getElementsByClassName("close")[1];
let shoppingList = []

window.onload = function(){
    if (localStorage.getItem('shoppingList'))
        shoppingList = JSON.parse(localStorage.getItem('shoppingList'));
    generateSneakers('nike')
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

function generateSneakers(type){
    fetch('/sneakers/' + type, {
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
    sneakers.map((sneaker, count) =>{
        const sneaker_panel = document.createElement('div')
        sneaker_panel.className = "sneakers"
        sneaker_panel.id = "sneaker_"+count
        const sneaker_img = document.createElement('div')
        sneaker_img.className = "sneaker_image"
        const  img = document.createElement('img')
        img.src = "photo/" + sneaker.image
        img.width = 250
        img.height = 220
        img.alt = "Sneaker Image" + count
        img.style.cssText = "background-color: #f1f1f1;"
        sneaker_img.append(img)
        sneaker_panel.append(sneaker_img)
        const sneaker_details = document.createElement('div')
        sneaker_details.className = "sneaker_details"
        const sneaker_name = document.createElement('p')
        sneaker_name.className = "sneaker_name"
        sneaker_name.textContent = sneaker.brand
        const sneaker_price = document.createElement('p')
        sneaker_price.className = "sneaker_price"
        sneaker_price.textContent = sneaker.price
        const sneaker_model = document.createElement('p')
        sneaker_model.className = "sneaker_brand"
        sneaker_model.textContent = sneaker.model
        sneaker_details.append(sneaker_name)
        sneaker_details.append(sneaker_price)
        sneaker_details.append(sneaker_model)
        sneaker_panel.append(sneaker_details)
        newItem.append(sneaker_panel)
    })
    section.appendChild(newItem);
    sneakers.map((sneaker, count) =>(
        document.getElementById("sneaker_"+count).addEventListener('click', (event) => {
            openSneakerInfo(sneaker)
        })
    ))
}

function openSneakerInfo(sneaker){
    modal.style.display = "block";
    let modal_info_container = document.querySelector(".modal-info-container")
    modal_info_container.innerHTML = ``
    const sneaker_modal = document.createElement('div')
    sneaker_modal.className = "sneaker_modal"
    const sneaker_modal_img = document.createElement('div')
    sneaker_modal_img.className = "sneaker_modal_image"
    const img = document.createElement('img')
    img.src = "photo/" + sneaker.image
    img.height = 400
    img.alt = "Sneaker Image 1"
    sneaker_modal_img.append(img)
    sneaker_modal.append(sneaker_modal_img)
    const sneaker_modal_details = document.createElement('div')
    sneaker_modal_details.className = "sneaker_modal_details"
    const sneaker_modal_brand = document.createElement('h2')
    sneaker_modal_brand.className = "sneaker_modal_brand"
    sneaker_modal_brand.textContent = sneaker.model
    const sneaker_modal_price = document.createElement('h3')
    sneaker_modal_price.className = "sneaker_modal_price"
    sneaker_modal_price.textContent = "Цена:" + sneaker.price
    const sneaker_modal_description = document.createElement('p')
    sneaker_modal_description.className = "sneaker_modal_description"
    sneaker_modal_description.textContent = sneaker.description
    const modal_button = document.createElement('button')
    modal_button.className = "modal_button"
    modal_button.textContent ="Добавить в корзину"
    sneaker_modal_details.append(sneaker_modal_brand)
    sneaker_modal_details.append(sneaker_modal_price)
    sneaker_modal_details.append(sneaker_modal_description)
    sneaker_modal_details.append(modal_button)
    sneaker_modal.append(sneaker_modal_details)
    modal_info_container.append(sneaker_modal)
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
    size.map((one_size, count) => {
        newItem.innerHTML += `
    		 <div class="form_radio_group-item">
                <input id=${"radio-" + count} type="radio" name="radio" value=${one_size} checked>
                <label for=${"radio-" + count}>${one_size}</label>
             </div>
    		`
    })
    return newItem;
}

function openShoppingCart(){
    document.querySelector('#error_field').textContent = "";
    modalShoppingCart.style.display = "block";
    document.querySelector(".selected-sneakers").innerHTML = '';
    let newItem = document.createElement('div');
    newItem.className="selected-sneakers_rows"
    let sum = 0;
    shoppingList.map((sneaker_row_data, count) => {
        sum += sneaker_row_data.price
        const sneaker_row = document.createElement('div')
        sneaker_row.className = "sneaker_row"
        sneaker_row.id = "sneaker_row_" + count
        const sneaker_row_model = document.createElement('p')
        sneaker_row_model.className = "sneaker_row_model"
        sneaker_row_model.textContent = sneaker_row_data.model
        const sneaker_row_size = document.createElement('p')
        sneaker_row_size.className = "sneaker_row_size"
        sneaker_row_size.textContent = sneaker_row_data.size
        const sneaker_row_price = document.createElement('p')
        sneaker_row_price.className = "sneaker_row_price"
        sneaker_row_price.textContent = sneaker_row_data.price
        sneaker_row.append(sneaker_row_model)
        sneaker_row.append(sneaker_row_size)
        sneaker_row.append(sneaker_row_price)
        newItem.append(sneaker_row)
    })
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