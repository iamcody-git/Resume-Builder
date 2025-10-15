import mongoose from "mongoose";

const connectDB = async () => {
  try {
    let mongoDbURI = process.env.MONGODB_URI ;
    const projectName = process.env.PROJECT_NAME;

    if (!mongoDbURI) {
      throw new Error("mongoDbURI environment variable is not set");
    }
    if (mongoDbURI.endsWith("/")) {
      mongoDbURI = mongoDbURI.slice(0, -1);
    }

    // Connect to MongoDB
    await mongoose.connect(`${mongoDbURI}/${projectName}`);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    process.exit(1); 
  }
};

export default connectDB;
