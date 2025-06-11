const db = require('../db');

const checkLogin = (req, res) => {
  console.log('🔍 SESSION IN /check-login:', req.session);

  if (req.session && req.session.user) {
    res.json({
      loggedIn: true,
      username: req.session.user.username,
      role: req.session.user.role,
      id: req.session.user.id
    });
  } else {
    res.json({ loggedIn: false });
  }
};

const fetchUserData = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const sql = `SELECT account.id, account.username, account.password, role.name AS role,
      account.lead, account.division, account.subdivision
            FROM account
            JOIN role ON account.roleID = role.id
            WHERE account.username = ?
            AND account.password = ?
    `;
    db.query(sql, [username, password], (err, result) => {
        if (result.length === 0) {
            return res.json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }
        if (err) throw err;

        const user = result[0];
        req.session.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            lead: user.lead,
            division: user.division,
            subdivision: user.subdivision
        };
        console.log('SESSION AFTER LOGIN:', req.session.user);
        res.status(200).json({message: 'เข้าสู่ระบบแล้ว', user: req.session.user});
    });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    return res.json({ message: 'Logged out' });
  });
};

module.exports = {
  checkLogin,
  fetchUserData,
  logout
};