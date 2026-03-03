import db from "../config/db.js";

/* LOGIN */
export const login = (req, res) => {
  const { email, password } = req.body;

  const sql =
    "SELECT * FROM users WHERE email = ? AND password = ?";

  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = results[0];

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });
  });
};

/* SIGNUP */
export const signup = (req, res) => {
  const { name, email, password, role } = req.body;

  const sql =
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";

  db.query(sql, [name, email, password, role], (err, result) => {
    if (err) return res.status(500).json(err);

    res.status(201).json({ message: "User registered successfully" });
  });
};