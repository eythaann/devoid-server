import { Router } from 'express';
const router = Router();
import request from 'request';
import pool from '../database.js';
import jwt from 'jsonwebtoken';

const CLIENT = 'AQaZIbQGYL2zOIt4bE6WiSH20PLRULriWn1RIpIq5Gl1C3rU-Z6ZN17A-NS10JYNNdzYJzWvdMjcEMlH';
const SECRET = 'EFPvPMPaEwOJto37prdQb3GvILb1K6hrZc0xBLKwHqkBCi9j_rHh9fNzUdjmfIHdVQtHEJ2YpjuyZV29';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com' //'https://api-m.sandbox.paypal.com'; //LIVE  https://api-m.paypal.com
const auth = { user: CLIENT, pass: SECRET };

/* 
CREANDO LA ORDEN PARA PROCESAR 
*/

const createOrder = async (req, res, decoded, method) => {
  const car = await pool.query(`SELECT product_amount, product_price FROM user_car
              JOIN product 
              ON user_id = ${decoded.id} && product.product_id = user_car.product_id`);

  if (car.length > 0) {
    const total = car.reduce((acc, obj) => acc + (obj.product_price * obj.product_amount),
      0).toFixed(2);
    const order = {
      user_id: decoded.id,
      total: total,
    };
    switch (method) {
      case 'paypal':
        pool.query('INSERT INTO orders set?', [order]).then(data => {
          pool.query(
            `INSERT INTO order_items (product_id,product_amount,product_color,product_size,order_id)
              SELECT product_id,product_amount,product_color,product_size,${data.insertId}
              FROM user_car WHERE user_id = ${decoded.id}`
          )
            .then(rs => {
              const order_id = data.insertId;
              createPayment(req, res, decoded, order_id, total);
            })
        })

        break
      case 'efectivo':
        pool.query('INSERT INTO orders set?', [order]).then(data => {
          pool.query(
            `INSERT INTO order_items (product_id,product_amount,product_color,product_size,order_id)
              SELECT product_id,product_amount,product_color,product_size,${data.insertId}
              FROM user_car WHERE user_id = ${decoded.id}`
          )
            .then(rs => {
              const order_id = data.insertId;
              createwasslink(req, res, decoded, order_id, total);
              pool.query(`DELETE FROM user_car WHERE user_id = ${decoded.id}`);
            })
        })

        break
      default:
        res.json({ 'err': 'metodo de pago no valido' })
    }
  }else{
    res.json({'err':'no cart'})
  }
};

const createPayment = (req, res, decoded, order_id, total) => {
  console.log("\x1b[33m%s\x1b[0m", "Nueva Compra Iniciada");
  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: decoded.id,
        custom_id: order_id,
        amount: {
          currency_code: 'USD',
          value: total,
        },
      },
    ],
    application_context: {
      brand_name: 'Devoid',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:3000/api/v1/neworder',
      cancel_url: 'http://localhost:4200/cart',
    },
  };

  request.post(
    `${PAYPAL_API}/v2/checkout/orders`,
    {
      auth,
      body,
      json: true,
    },
    (err, response) => {
      //console.log(response)
      res.json(response.body.links[1].href);
      //console.log(response.body.links[1].href);
    }
  );
};

const createwasslink = (req, res, decoded, order_id, total) => {
  const wass = `https://wa.me/593939649993?text=Hola!, mi nombre es ${decoded.name} y estoy
  interesado en pagar/comprar un producto en efectivo/deposito. id de compra:${order_id}, valor total $${total}`
  res.json(wass)
}
/* 
PROCESANDO LA ORDEN DESPUES DE PAGO CORRECTO 
*/
const executePayment = (req, res) => {
  console.log("\x1b[33m%s\x1b[0m", "Nueva Orden Creada");
  const token = req.query.token;
  if (token) {
    request.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {
        auth,
        body: {},
        json: true,
      },
      (err, response) => {
        if (response.body.status === 'COMPLETED') {
          let id = response.body.purchase_units[0].reference_id;
          let order_id =
            response.body.purchase_units[0].payments.captures[0].custom_id;
          pool.query(`DELETE FROM user_car WHERE user_id = ${id}`);
          pool.query(
            `UPDATE orders SET order_state=1 WHERE orders.order_id=${order_id}`
          );
          res.redirect('http://localhost:4200/user/orders');
        } else {
          res.redirect('http://localhost:4200/user/orders?err');
        }
      }
    );
  } else {
    res.redirect('http://localhost:4200/user/orders?err');
  }
};

router.post('/order', (req, res) => {
  const method = req.body.method
  const decoded = jwt.verify(req.body.token, 'secret');
  createOrder(req, res, decoded, method);
});

router.get('/neworder', executePayment);



export default router;
