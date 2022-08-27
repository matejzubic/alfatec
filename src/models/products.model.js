export class Product {
    constructor(id, name, barCode, color, quantity, productImageUrl) {
        this.id = id;
        this.name = name;
        this.barCode = barCode;
        this.color = color;
        this.quantity = quantity;
        this.productImageUrl = productImageUrl 
    }
}

export const setBaseURL = (product) => {
    return product?.productImageUrl ?? "https://www.index.hr/"
}