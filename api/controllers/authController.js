const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  // Registration is disabled
  res.status(501).json({ message: 'Registration disabled' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const validEmail = 'giddy@gmail.com';
  const validPassword = '1234';

  try {
    if (email === validEmail && password === validPassword) {
      const userPayload = {
        id: 1,
        email: validEmail,
        role: 'admin'
      };

      const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
