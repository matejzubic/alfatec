// When the user clicks on <span>, open the popup
function openPopup(productId) {
    var popup = document.getElementById("popup-" + productId);
    console.log(popup);
    popup.classList.add("open-popup");
}

function closePopup(productId) {
    var popup = document.getElementById("popup-" + productId);
    popup.classList.remove("open-popup");
}

function filter() {
    let attribute = document.getElementById("filter").value.toLowerCase();
    let data = document.getElementById("filterData").value.toLowerCase();
    localStorage.setItem("filter", attribute);
    localStorage.setItem("filterData", data);
    location.assign("/" + curIndex);
}

function sort() {
    let sort = document.getElementById("sort").value.toLowerCase();
    let order = document.getElementById("order").value.toLowerCase();
    localStorage.setItem("sort", sort);
    localStorage.setItem("order", order);
    location.assign("/" + curIndex);
}
