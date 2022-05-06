import mongoose from 'mongoose';
import dotenv from 'dotenv';

// dotenv.config is to load all the environment variables and make these accessible in the current file from the DEFAULT ".env" file
// then use "process.env" prefix to access/use/call any env variable
dotenv.config();

// the backend database sever needs to be connected first before processing/setting up our express server-side app to activly listen on port request
// this is because many initial http request made to express requires backend database data
async function runbackendConfig(app) {
  try {
    // first, use mongodb string to connect to db
    const result = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);
    console.log(`backend mongoDB altas is connected at ${result.connection.host}`);

    // only with no error from above operation, we then initalize the express app for listening
    app.listen(process.env.PORT, function () {
      console.log(`backend server is running, actively listening on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
}

export default runbackendConfig;
