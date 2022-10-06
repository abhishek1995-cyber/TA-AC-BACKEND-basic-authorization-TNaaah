var express = require('express');
var router = express.Router();
const session = require('express-session');
var Products = require('../models/product');
var Users = require('../models/user');
var Admin = require('../models/admin');
var auth = require('../middlewares/auth')

router.get('/',auth.loggedInUser,(req,res,next)=>{
    var {category} = req.query;
    var query = {};
    if(category){
        query.category = category;
    }
    Products.find(query,(err,products)=>{
        if(err) return next(err);
        Products.distinct("category",(err,category)=>{
            if(err) return next(err);
            res.render('viewproducts',{products,category});
        })
    })
})

router.get('/add',auth.loggedInAdmin,(req,res)=>{
        res.render('addproduct');
})

router.post('/add',(req,res,next)=>{
  Products.create(req.body,(err,products)=>{
    if(err) return next(err);
    res.redirect('/products')
  })
})

router.get('/view',auth.loggedInAdmin,auth.loggedInUser,(req,res)=>{
  res.redirect('/products')
})

router.get('/:id/edit',auth.loggedInAdmin,(req,res)=>{

        var id = req.params.id;
        Products.findById(id,(err,product)=>{
            if(err) return next(err)
            res.render('editproduct',{product})
        })
})
router.post('/:id/edit',auth.loggedInAdmin,(req,res)=>{
        var id = req.params.id;
        Products.findByIdAndUpdate(id,req.body,(err,updatedproduct)=>{
            if(err) return next(err);
            res.redirect('/products/' + id)
        })
})

router.get('/:id/delete',auth.loggedInAdmin,(req,res)=>{

        var id = req.params.id;
        Products.findByIdAndDelete(id,(err,deletedproduct)=>{
            if(err) return next(err);
            res.redirect('/products' )
        })
})

// add to cart

router.get('/:id/cart',auth.loggedInUser,(req,res)=>{

        var productID = req.params.id;
        var userid = req.session.userId;
        Users.findOneAndUpdate(userid, {$push: {cart: productID}},(err,product)=>{
            if(err) return next(err);
            res.redirect('/products')
        })
})



router.get('/:id',auth.loggedInAdmin,auth.loggedInUser,(req,res)=>{

        var id = req.params.id;
        Products.findById(id,(err,product)=>{
            res.render('productdetails',{product})
        })
})
// increment quantity

router.get('/:id/quantity',auth.loggedInAdmin,auth.loggedInUser,(req,res,next)=>{
    var id = req.params.id;
    Products.findByIdAndUpdate(id,{$inc: {quantity: 1}},(err,product)=>{
        if (err) return next(err);
    res.redirect('/products/' + id)
    })
})

module.exports = router;