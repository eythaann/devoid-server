import { Router } from 'express';
import { check, validationResult } from 'express-validator';
const router = Router();
import { login, register } from '../lib/user.js';
import jwt from 'jsonwebtoken';
import pool from '../database.js';
import { jwtSecret } from '../keys.js';

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
      login(req, res, next);
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
      register(req, res, next);
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
    }).catch(err=>res.send(err))
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
  }).catch(err=>res.send(err))
})


/* Product */
router.get('/store/:nompro', (req, res, next) => {
  const { nompro } = req.params;
  pool.query(`
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
  //console.log(token)
  if(!token){
    res.json({'error':'notoken'})
  }else{
    const decoded = jwt.verify(token, 'secret')
    //console.log(decoded)
    const car = {
      user_id: decoded.id,
      product_id: req.body.id,
      product_color: req.body.color,
      product_size: req.body.size,
      product_amount: req.body.amount,
  }
  //console.log(car)
    pool.query(`SELECT car_id FROM user_car WHERE (user_id = ${decoded.id}) && (product_id=${car.product_id}) && (product_color='${car.product_color}') && (product_size='${car.product_size}')`)
    .then(rows=>{
    if(rows.length === 0){/*item car exist, just add amount*/
        pool.query('INSERT INTO user_car set ?', [car]);
        res.json({"res":true})
      }else{
        pool.query(`UPDATE user_car SET product_amount= product_amount+${car.product_amount} WHERE car_id=${rows[0].car_id}`).then(data=>{
          res.json({"res":true})
        })
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
      ON user_car.user_id=${decoded.id} && user_car.product_id=product.product_id
      ORDER BY car_id DESC`)
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

router.get('/check-adress',(req, res)=>{
  const token = req.headers['x-access'];
  const decoded = jwt.verify(token, 'secret')
  if(decoded){
  pool.query(`SELECT * FROM adress WHERE user_id = ${decoded.id}`).then(data =>{
    if(data.length === 0){
      res.json({'adress':false})
    }else{ 
      res.json({'adress':true})
    }
  })
  }
})

router.post('/adress',(req, res)=>{
  const token = req.body.token
  const decoded = jwt.verify(token, 'secret')
  if(decoded){
    pool.query(`SELECT * FROM adress WHERE user_id = ${decoded.id}`).then(data=>{
      if(data.length === 0){
        const adress = {
          user_id : decoded.id,
          adress : req.body.adress,
          adress2 : req.body.adress2,
          country : req.body.country,
          state : req.body.state,
          city : req.body.city,
          postal_code : req.body.postal,
          phone : req.body.phone
        }
        pool.query(`INSERT INTO adress SET ?`,[adress]).then(data=>{ res.json({'adress':true})})
      }else{
        res.json({'error':'ya registrado'})
      }
    })
    
  }
  
})


router.get('/order', (req, res) => {
  const token = req.headers['x-access'];
  if (!token) {
    res.json({ 'error': 'no token' })
  } else {
    const decoded = jwt.verify(token, 'secret');
    if (decoded) {
      pool.query(`
  SELECT order_date, orders.order_id , order_state, product_amount, product_color, product_size, product_name, product_route, total from orders
  JOIN order_items
  ON user_id = ${decoded.id} && orders.order_id = order_items.order_id
  JOIN product
  ON product.product_id = order_items.product_id
  ORDER BY order_id DESC`).then(orders => {
        if (orders.length > 0) {
          res.json(orders)
        } else res.json({ 'orders': 'no items' })
      })
    }
  }

})

export default router;
