const { Router } = require('express');
const VendehumoController = require('../controllers/vendehumo.controller');

class VendehumoRoutes {
  constructor() {
    this.router = Router();
    this.vendehumo_controller = new VendehumoController();
    this.router.get('/', this.vendehumo_controller.list_vendehumos);
    this.router.post('/', this.vendehumo_controller.create_vendehumo);
  }
}

module.exports = VendehumoRoutes;
