const { connectDatabase } = require("../src/database/database");

let appPromise = null;

module.exports = async (req, res) => {
  if (!appPromise) {
    appPromise = connectDatabase().then(() => require("../src/app"));
  }
  const app = await appPromise;
  if (req.url !== "/" && !req.url.startsWith("/api")) {
    req.url = "/api" + req.url;
  }
  return app(req, res);
};
