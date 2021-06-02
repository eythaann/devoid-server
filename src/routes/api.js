const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
const UserController = require('../lib/user');
const jwt = require('jsonwebtoken');
const pool = require('../database');
const { jwtSecret }= require('../keys');

/* Login and Register*/
router.post(
  '/login',
  [
    check('email','error en el email').isEmail().isLength({ min: 5, max: 50 }),
    check('password','error en el password').isLength({ min: 8, max: 30 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors);
    } else {
      UserController.login(req, res, next);
    };
  }
);

router.post(
  '/register',
  [
    check('username','error en el username').isLength({ min: 3, max: 30 }),
    check('email','error en el email').isEmail().isLength({ min: 5, max: 40 }),
    check('password','error en el password').isLength({ min: 8, max: 30 }),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send(errors);
    } else {
      UserController.register(req, res, next);
    };
  }
);

/* Store */
router.get('/store', (req, res) => {
  let category = req.query.category;
  let collection = req.query.collection;

  if(category)
  {
    pool.query(`Select id FROM category WHERE category_name =?`,category)
    .then(id=>{
    pool.query(`SELECT product_name,product_price,product_route FROM product WHERE product_state = 1 && category_id=${id[0].id}`)
      .then(store=>{
      res.json(store);
      }).catch(err=>{res.json(err)})
    })
    .catch(err=>{
      res.send(err)
    })
  }
  else if(collection)
  {
    pool.query(`Select id FROM collection WHERE collection_name=?`, collection)
    .then(id=>{
      pool.query(`SELECT product_name,product_price,product_route FROM product WHERE product_state = 1 && collection_id=${id[0].id}`)
      .then(store=>{
        res.json(store);
      }).catch(err=>{res.json(err)})
    })
    .catch(err=>{
      res.send(err)
    })
  }else{
    pool.query  ('SELECT product_name,product_price,product_route FROM product WHERE product_state = 1')
    .then(store=>{
      res.json(store);
    })
  }
});

router.get('/filters', (req,res)=>{
  pool.query('SELECT * FROM collection')
  .then(collection=>{
    let filters = [collection]
    pool.query('SELECT * FROM category')
    .then(category=>{
      filters.push(category)
      res.json(filters)
    })
  })
})


/* Product */
router.get('/store/:nompro', (req, res, next) => {
  const { nompro } = req.params;
  const product = pool.query(`
  SELECT * FROM product 
  INNER JOIN product_variant 
  ON product.product_route='${nompro}' && product.product_id = product_variant.product_id`)
  .then(product=>{
    if(Object.entries(product).length === 1){
      res.json(product);
    }else{
      res.json([{error:'no-exist'}])
    }
  })
  .catch(err=>{
    next(err);
  })
  
  
});

/* Add, Get, Delete and Uptade Cart */
router.post('/car',(req,res)=>{
  const token = req.headers['x-access'];
  if(!token){
    res.json({'error':'notoken'})
  }else{
    const decoded = jwt.verify(token, 'secret')
    const car = {
      user_id: decoded.id,
      product_id: req.body.id,
      product_color: req.body.color,
      product_size: req.body.size,
      product_amount: req.body.amount,
  }
    pool.query(`SELECT car_id FROM user_car WHERE (user_id = ${car.user_id}) && (product_id=${car.product_id}) && (product_color='${car.product_color}') && (product_size='${car.product_size}')`)
    .then(rows=>{
    if(Object.entries(rows).length === 1){/*item car exist, just add amount*/
      pool.query(`UPDATE user_car SET product_amount= product_amount+${car.product_amount} WHERE car_id=${rows[0].car_id}`)
      res.json({"res":"sumando al carrito"})
      }else{
        pool.query('INSERT INTO user_car set ?', [car]);
        res.json({"res":"agregado correctamente"})
      }
    })  
  }
});


router.get('/car', (req, res)=>{
  const token = req.headers['x-access'];
  if(!token){
    res.json({'error':'no token'})
  }else{
    const decoded = jwt.verify(token, 'secret')
    if(decoded){
    pool.query(
      `SELECT * FROM user_car 
      INNER JOIN product 
      ON user_car.user_id=${decoded.id} && user_car.product_id=product.product_id`)
    .then(cart=>{
      if(cart.length > 0){
        res.json(cart)
      }else res.json({'cart': 'no items'})
      
    })
    }
  }
});

router.delete('/car',(req,res)=>{
 const token = req.body.token
  if(!token){
    res.json({'error':'no token'})
  }else{
    const decoded = jwt.verify(token, 'secret')
    if(decoded){
      pool.query(`Delete FROM user_car where car_id=${req.body.car_id} && user_id=${decoded.id}`)
      res.json({'ok':'ok'})
    }
  }
})

module.exports = router;
