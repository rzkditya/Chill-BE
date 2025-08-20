module.exports = {
  Middleware: {
    authenticate: require("./auth.middleware"),
    upload: require("./upload.middleware"),
  },
};
