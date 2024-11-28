const db = require('../../../server/server').db;

// Función para guardar la suscripción
const saveSubscription = (subscription) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO subscriptions (endpoint, keys) VALUES (?, ?)';
    db.query(query, [subscription.endpoint, JSON.stringify(subscription.keys)], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Función para obtener todas las suscripciones
const getAllSubscriptions = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM subscriptions', (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = { saveSubscription, getAllSubscriptions };
