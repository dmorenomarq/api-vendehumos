const VendehumoRepository = require('../repositories/vendehumo.repository');
const { AppError } = require('../utils/errors');

class VendehumoService {
  constructor() {
    this.vendehumo_repository = new VendehumoRepository();
  }

  create_vendehumo({ nombre, categoria, votos = 0, url_canal, url_foto }) {
    if (!this.is_non_empty_string(nombre) || !this.is_non_empty_string(categoria)) {
      throw new AppError(400, 'nombre y categoria son obligatorios');
    }
    if (!Number.isInteger(votos) || votos < 0) {
      throw new AppError(400, 'votos debe ser un entero mayor o igual que 0');
    }
    if (!this.is_http_url(url_canal) || !this.is_http_url(url_foto)) {
      throw new AppError(400, 'url_canal y url_foto deben ser URLs http(s) válidas');
    }

    return this.vendehumo_repository.create_vendehumo({
      nombre: nombre.trim(),
      categoria: categoria.trim().toLowerCase(),
      votos,
      url_canal: url_canal.trim(),
      url_foto: url_foto.trim(),
    });
  }

  list_vendehumos({ page = 1, limit = 10 } = {}) {
    const page_number = this.parse_positive_int(page);
    const limit_number = this.parse_positive_int(limit);
    if (page_number === null) {
      throw new AppError(400, 'page debe ser un entero mayor o igual que 1');
    }
    if (limit_number === null || limit_number > VendehumoService.MAX_LIMIT) {
      throw new AppError(400, `limit debe ser un entero entre 1 y ${VendehumoService.MAX_LIMIT}`);
    }

    const total = this.vendehumo_repository.count_all();
    const items = this.vendehumo_repository.find_page({
      limit: limit_number,
      offset: (page_number - 1) * limit_number,
    });

    return {
      items,
      page: page_number,
      limit: limit_number,
      total_pages: Math.max(1, Math.ceil(total / limit_number)),
    };
  }

  parse_positive_int(value) {
    const number = typeof value === 'string' && /^\d+$/.test(value) ? Number(value) : value;
    return Number.isSafeInteger(number) && number >= 1 ? number : null;
  }

  is_non_empty_string(value) {
    return typeof value === 'string' && value.trim() !== '';
  }

  is_http_url(value) {
    if (typeof value !== 'string') return false;
    try {
      const { protocol } = new URL(value.trim());
      return protocol === 'http:' || protocol === 'https:';
    } catch {
      return false;
    }
  }
}

VendehumoService.MAX_LIMIT = 100;

module.exports = VendehumoService;
