const db = require('../db');

const fetchUserData = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = `SELECT account.id, account.username, account.password, role.name AS role
            FROM account
            JOIN role ON account.roleID = role.id
            WHERE account.username = ?
            AND account.password = ?
    `;
    db.query(sql, [username, password], (err, result) => {
        if (result.length === 0) {
            return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
        if (err) throw err;

        const user = result[0];
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role
        };
        res.status(200).json({message: 'เข้าสู่ระบบแล้ว', user: req.session.user});
    });
};

module.exports = {
  fetchUserData
};