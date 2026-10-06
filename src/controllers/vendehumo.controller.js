const VendehumoService = require('../services/vendehumo.service');

class VendehumoController {
  constructor() {
    this.vendehumo_service = new VendehumoService();
  }

  create_vendehumo = async (req, res) => {
    const vendehumo = this.vendehumo_service.create_vendehumo(req.body ?? {});
    res.status(201).json(vendehumo);
  };

  list_vendehumos = async (req, res) => {
    const { items, page, limit, total_pages } = this.vendehumo_service.list_vendehumos({
      page: req.query.page,
      limit: req.query.limit,
    });

    const link = (target) => `${req.baseUrl}?page=${target}&limit=${limit}`;
    const body = { self: link(page), first: link(1) };
    if (page > 1) body.prev = link(Math.min(page - 1, total_pages));
    if (page < total_pages) body.next = link(page + 1);
    body.last = link(total_pages);
    body.items = items;

    res.status(200).json(body);
  };
}

module.exports = VendehumoController;
