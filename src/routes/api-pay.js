const express = require('express');
const router = express.Router();
const request = require('request');
const pool = require('../database');
const jwt = require('jsonwebtoken');

const CLIENT = 'AYI62dbOwWmX08xifVsXwBgpxlF1IfwgGjmc9otgZlnBQPor-Xm5hy_71pOdvNDFSWxInN4HJ0_MMUoY';
const SECRET ='EJPWLBB8y2uuHudFq9BaYXihk71V9NEwkQJx0Jr39TK8m856_1f8P1StbubrroUHYt8zGWyIyYpLvZIi';
const PAYPAL_API = 'https://api-m.paypal.com' //'https://api-m.sandbox.paypal.com'; //LIVE  https://api-m.paypal.com
const auth = { user: CLIENT, pass: SECRET };

/* 
CREANDO LA ORDEN PARA PROCESAR 
*/

const createOrder = (req, res, decoded) => {
  const order = {
    user_id: decoded.id,
    total: req.body.total,
  };
  pool.query('INSERT INTO orders set?', [order]).then((data) => {
    pool
      .query(
        `INSERT INTO order_items (product_id,product_amount,product_color,product_size,order_id)
                SELECT product_id,product_amount,product_color,product_size,${data.insertId}
                FROM user_car WHERE user_id = 87`
      )
      .then((rs) => {
        let order_id = data.insertId;
        createPayment(req, res, decoded, order_id);
      });
  });
};
const createPayment = (req, res, decoded, order_id) => {
  console.log("\x1b[33m%s\x1b[0m" ,"Nueva Compra Iniciada");
  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        reference_id: decoded.id,
        custom_id: order_id,
        amount: {
          currency_code: 'USD',
          value: req.body.total,
        },
      },
    ],
    application_context: {
      brand_name: 'Devoid',
      landing_page: 'NO_PREFERENCE',
      user_action: 'PAY_NOW',
      return_url: 'http://100.64.183.173:3000/api/v1/neworder',
      cancel_url: 'http://100.64.183.173:3000/car',
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
      res.json(response.body.links[1].href);
      console.log(response.body.links[1].href);
    }
  );
};


/* 
PROCESANDO LA ORDEN DESPUES DE PAGO CORRECTO 
*/
const executePayment = (req, res) => {
  console.log("\x1b[33m%s\x1b[0m" ,"Nueva Orden Creada");
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
          res.redirect('/');
        } else {
          res.redirect('/');
        }
      }
    );
  } else {
    res.redirect('/');
  }
};

router.post('/order', (req, res) => {
  const decoded = jwt.verify(req.body.token, 'secret');
  createOrder(req, res, decoded);
});

router.get('/neworder', executePayment);

module.exports = router;
