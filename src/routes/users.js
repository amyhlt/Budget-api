const router = require("express").Router();

module.exports = (db) => {
  router.get("/users", (request, response) => {
    db.query(`SELECT * FROM users`).then(({ rows: users }) => {
      response.json(
        users.reduce(
          (previous, current) => ({ ...previous, [current.id]: current }),
          {}
        )
      );
    });
  });
  router.post("/users", (request, response) => {
    if (process.env.TEST_ERROR) {
      setTimeout(() => response.status(500).json({}), 1000);
      return;
    }

    const {firstNname,lastName,email,password } = request.body;

    db.query(
      `
      INSERT INTO users (first_name,last_name,email,password) VALUES ($1::text, $2::text, $3::text,$4::text)
    `,
      [firstNname, lastName, email,password]
    )
      .then(() => {
        setTimeout(() => {
          response.status(204).json({});
        }, 1000);
      })
      .catch(error => console.log(error));
  });
  return router;
};
