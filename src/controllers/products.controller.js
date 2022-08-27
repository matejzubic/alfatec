import {getAllData, initiDB} from '../db.js'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { table } from 'console';

const Souvenir = mongoose.model('Souvenir')
const pageSize = 12
var isFiltered = false

function getSortOrder(prop, order) {    
  return function(a, b) {   
      var res = 0 
      if (a[prop] > b[prop]) {    
          res = 1;    
      } else if (a[prop] < b[prop]) {    
          res = -1;    
      }
      if(order == 'desc')
        res = res * -1;
      return res;    
  }    
} 

function checkForSortAndFilter(req) {
  isFiltered = false;
  if(req.body.sort !== undefined)
    req.session.sort = req.body.sort;
  if(req.body.order !== undefined)
    req.session.order = req.body.order;
  if(req.body.filter !== undefined) {
    req.session.filter = req.body.filter;
    isFiltered = true;
  }
  if(req.body.filterData !== undefined)
    req.session.filterData = req.body.filterData;
}

async function fetchSortFilterData(req) {
  var tableData = await getAllData();

  var lengthOfData = tableData.length
  if(lengthOfData == 0) {
    await initiDB();
    tableData = await getAllData();
    lengthOfData = tableData.length;
  }

  checkForSortAndFilter(req);

  var sort = req.session.sort;
  var order = req.session.order;
  var attribute = req.session.filter;
  var filterData = req.session.filterData;

  if(attribute !== undefined && filterData !== "") {
    tableData = tableData.filter(function(v) {
      if (attribute !== 'quantity') {
        var condition = v[attribute].toLowerCase().indexOf(filterData) > -1;
      } else {
        var condition = v[attribute] == Number(filterData);
      }
      return condition;
    });
  }

  if(sort !== undefined) {
    tableData.sort(getSortOrder(sort, order));
  }

  return tableData;
}

function getPageData(tableData, pageIndex) {
  var lengthOfData = tableData.length;
  var begin = (pageIndex - 1) * pageSize

  if (begin >= lengthOfData)
    throw new Error("Index out of range.");
  var end = (pageIndex * pageSize - 1 < lengthOfData) ? pageIndex * pageSize - 1 : lengthOfData - 1;
    
  var neededData = []

  for(var i = begin; i <= end; i++) {
    neededData[i - begin] = tableData[i];
  }

  return neededData;
}

// Service for getting view with all products displayed
async function fetchProducts(req, res) {
  try {
    var pageIndex = 0;
    if(req.params.index === undefined || isFiltered == true)
      pageIndex = 1;
    else
      pageIndex = req.params.index;
    
    var tableData = await fetchSortFilterData(req);
    var lengthOfData = tableData.length;
    
    res.render('productsList', { 
      pageData : getPageData(tableData, pageIndex),
      curIndex : pageIndex,
      numOfPages : Math.ceil(lengthOfData / pageSize) 
    });
  } catch(error) {
    res.render('error', {
      error : error
    }); 
  } 
}

async function addSouvenir(req, res) {
  try {
    var doesExist = true;
    while(doesExist) {
      var uuid = crypto.randomUUID();
      await Souvenir.find({id : uuid})
          .then((souvenirs) => {
              if(souvenirs.length == 0) {
                  doesExist = false
              }
          })
    }

    var attributes = {
      id: uuid,
      name: req.body.name,
      barCode: req.body.barCode,
      color: req.body.color,
      quantity: req.body.quantity,
      productImageUrl: req.body.url,
      description: req.body.description
    }

    const newSouvenir = new Souvenir(attributes);
    let error = newSouvenir.validateSync();

    if(error === undefined) {
      await newSouvenir.save();
      res.redirect('/');
    } else {
      console.log(error.errors);

      res.render('add', {
        souvenir : attributes,
        errors : error.errors
      })
    }
  } catch(error) {
    res.render('error', {
      error : error
    }); 
  }
}

async function prepareForEdit(req, res) {
  try {
    var souvenir = {};
    console.log(req.params.id);
    await Souvenir.findOne({id : req.params.id}, function (err, docs) {
      souvenir = docs;
    }).clone();

    if(souvenir == null)
      throw new Error("Souvenir with given ID does'nt exist.");
      
    res.render('edit', {
        souvenir : souvenir,
        errors: undefined
    });
  } catch(error) {
    res.render('error', {
      error : error
    }); 
  }
}

async function editSouvenir(req, res) {
  try {
    var uuid = String(req.params.id);
    console.log("Id : " + uuid);
    await Souvenir.deleteOne({id: uuid});
    var newAttributes = {
      id: uuid,
      name: req.body.name,
      barCode: req.body.barCode,
      color: req.body.color,
      quantity: req.body.quantity,
      productImageUrl: req.body.url,
      description: req.body.description
    }

    const editedSouvenir = new Souvenir(newAttributes);
    let error = editedSouvenir.validateSync();
    if(error === undefined) {
      await editedSouvenir.save();
      res.redirect('/');
    } else {
      res.render('edit', {
        souvenir : newAttributes,
        errors: error.errors
      })
    }
  } catch(error) {
    res.render('error', {
      error : error
    }); 
  }
}

export {fetchProducts, addSouvenir, prepareForEdit, editSouvenir}