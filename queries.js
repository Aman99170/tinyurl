const db = require('./db');

async function createLink({ code, target }) {
  const text = `INSERT INTO links(code, target) VALUES($1, $2) RETURNING *`;
  const values = [code, target];
  return db.query(text, values);
}

async function getLink(code) {
  return db.query('SELECT * FROM links WHERE code = $1', [code]);
}

async function listLinks() {
  return db.query('SELECT * FROM links ORDER BY created_at DESC');
}

async function deleteLink(code) {
  return db.query('DELETE FROM links WHERE code = $1 RETURNING *', [code]);
}

async function incrementClick(code) {
  return db.query(
    `UPDATE links
     SET total_clicks = total_clicks + 1,
         last_clicked = now()
     WHERE code = $1
     RETURNING *`,
     [code]
  );
}

module.exports = {
  createLink,
  getLink,
  listLinks,
  deleteLink,
  incrementClick
};
