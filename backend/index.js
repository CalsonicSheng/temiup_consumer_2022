import express from 'express';
import runbackendConfig from './config/backendConfigSetting.js';
import globalMiddlewareHandler from './middleware/globalMiddleware.js';
import authRouter from './routes/authRouter.js';
import savedTeamRouter from './routes/savedTeamRouter.js';
import teamRouter from './routes/teamRouter.js';
import userRouter from './routes/userRouter.js';
import orderRouter from './routes/orderRouter.js';
import addressRouter from './routes/addressRouter.js';

const app = express();
runbackendConfig(app);
globalMiddlewareHandler(app, express);

//-------------------------------------------------------------------------------------

app.use('/team', teamRouter);

app.use('/auth', authRouter);

app.use('/saved-team', savedTeamRouter);

app.use('/user', userRouter);

app.use('/address', addressRouter);

app.use('/order', orderRouter);

//-------------------------------------------------------------------------------------

app.use((req, res, next) => {
  console.log('404 error reached');
  const customizedErrorObject = {
    customizedMessage: 'The resources you requested may not exist',
    responseStatus: 404,
  };
  next(customizedErrorObject);
});

app.use((errorObject, req, res, next) => {
  console.log(`error sent from backend`);
  res.status(errorObject.responseStatus).json(errorObject);
});
