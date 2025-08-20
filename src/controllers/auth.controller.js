const User = require("../models/users.model");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const crypto = require("crypto");

const { Op } = require("sequelize");

const mailTransporter = require("../lib/mailer");

const profile = async (req, res) => {
  const user = await User.findOne({
    where: { user_id: req.user.user_id },
    attributes: { exclude: ["password"] },
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Required field cannot be empty",
      });
    }

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: "Username or password are not correct",
        success: false,
      });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: "Username or password are not correct",
        success: false,
      });
    }

    if (user.status === "pending") {
      return res.status(403).json({
        message: "Your account has not been activated yet",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(200).json({
      data: user,
      token,
      message: "Login success",
      success: true,
    });
  } catch (error) {
    console.log("Error login", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const sendMailWithRetry = async (
  transporter,
  mailOptions,
  retries = 3,
  delay = 2000
) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await transporter.sendMail(mailOptions); // sukses langsung return
    } catch (error) {
      console.error(`Sending attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Required field cannot be empty",
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (user) {
      return res.status(409).json({
        message: "Username or Email already used",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const token = crypto.randomUUID();

    const mailOptions = {
      from: process.env.SMTP_SENDER,
      to: email,
      subject: "Chill user activation mail",
      text: `
      Hi there!

      Thanks for signing up for an Chill account!

      To confirm your email, simply go to: http://localhost:3000/api/v1/activation/${token}
      `,
    };

    try {
      await sendMailWithRetry(mailTransporter, mailOptions);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        status: "pending",
        token,
      });

      return res.status(201).json({
        success: true,
        message: "Register success, please check your email",
        data: newUser,
      });
    } catch (mailError) {
      return res.status(500).json({
        success: false,
        message: "Failed to send activation email, please try again",
        data: mailError?.message || String(mailError),
      });
    }
  } catch (error) {
    console.log("Error creating user: ", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const activation = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        token,
      },
    });

    if (!user) {
      {
        return res.status(400).json({
          success: false,
          message: "Invalid verification token",
        });
      }
    }

    user.token = null;
    user.status = "active";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.log("Error activate user: ", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const upload = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "There's no file to upload",
      });
    }

    const user = await User.findOne({
      where: { user_id: req.user.user_id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.photo = file.filename;
    await user.save();

    res.status(200).json({
      success: true,
      message: "File uploaded",
    });
  } catch (error) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large",
      });
    }
    if (
      error.message === "Invalid file extension, only JPG and PNG is allowed"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const AuthenticationController = {
  profile,
  login,
  register,
  activation,
  upload,
};

module.exports = AuthenticationController;
