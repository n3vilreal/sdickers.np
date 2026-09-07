const app = require("./app");
const { connectDatabase } = require("./database/database");

const PORT = process.env.PORT || 3000;
const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } catch (err) {
    console.log("Database Connection Failed:", err);
    process.exit(1);
  }
};
startServer();
