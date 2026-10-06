const { DatabaseSync } = require('node:sqlite');
const config = require('../config');
const VendehumoModel = require('../models/vendehumo.model');

class VendehumoRepository {
  constructor() {
    this.db = new DatabaseSync(config.dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS vendehumos (
        id         INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre     TEXT NOT NULL,
        categoria  TEXT NOT NULL,
        votos      INTEGER NOT NULL DEFAULT 0,
        url_canal  TEXT NOT NULL,
        url_foto   TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `);
  }

  create_vendehumo({ nombre, categoria, votos, url_canal, url_foto }) {
    const result = this.db
      .prepare(
        `INSERT INTO vendehumos (nombre, categoria, votos, url_canal, url_foto, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(nombre, categoria, votos, url_canal, url_foto, new Date().toISOString());
    return this.find_by_id(Number(result.lastInsertRowid));
  }

  find_page({ limit, offset }) {
    return this.db
      .prepare('SELECT * FROM vendehumos ORDER BY id LIMIT ? OFFSET ?')
      .all(limit, offset)
      .map((row) => VendehumoModel.create_vendehumo(row));
  }

  count_all() {
    return this.db.prepare('SELECT COUNT(*) AS total FROM vendehumos').get().total;
  }

  find_by_id(id) {
    const row = this.db.prepare('SELECT * FROM vendehumos WHERE id = ?').get(id);
    return row ? VendehumoModel.create_vendehumo(row) : null;
  }
}

module.exports = VendehumoRepository;
