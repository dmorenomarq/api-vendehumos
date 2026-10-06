// Entidad Vendehumo: { id, nombre, categoria, votos, url_canal, url_foto, created_at }
class VendehumoModel {
  static create_vendehumo({ id, nombre, categoria, votos, url_canal, url_foto, created_at }) {
    return { id, nombre, categoria, votos, url_canal, url_foto, created_at };
  }
}

module.exports = VendehumoModel;
