import { Router } from "express";
import {addSouvenir, prepareForEdit, editSouvenir, fetchProducts} from '../controllers/products.controller.js'
import mongoose from 'mongoose'

const Souvenir = mongoose.model('Souvenir')
const router = Router();

router.get("/", fetchProducts);

router.post("/", fetchProducts);

router.get("/add", function(req, res) {
    res.render('add', {
        souvenir: undefined,
        errors: undefined
    });
})

router.post('/add', addSouvenir);

router.get("/:index", fetchProducts);

router.post("/:index", fetchProducts);

router.get("/edit/:id", prepareForEdit);

router.post('/edit/:id', editSouvenir); // use router.put

router.post("/delete/:id", async function (req, res) {
    console.log(req.params.id);
    await Souvenir.deleteOne({id: req.params.id});
    res.redirect('/');
})

export default router;