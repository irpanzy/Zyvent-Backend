import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL as string, {
      dbName: "db-zyvent",
    });
    return Promise.resolve("Connected to the database successfully");
  } catch (error) {
    return Promise.reject("Database connection failed");
  }
};

export default connect;
