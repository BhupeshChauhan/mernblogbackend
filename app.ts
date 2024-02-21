import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';
import userRoutes from './routes/user';
import postRoutes from './routes/post';
import categoriesRoutes from './routes/categories';
import uploadImgRoutes from './routes/uploadImg';
import tagsRoutes from './routes/tags';
import rolesRoutes from './routes/roles';
import connectToDB from './db/db';
import dotenv from 'dotenv';

dotenv.config({path: './config.env'})

const app = express();

//DB
connectToDB();

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(function (req, res, next) {

  var allowedDomains = ['https://next-mern-blog.vercel.app/', "https://mernblog-admin.vercel.app/" ];
  var origin: any = req.headers.origin;
  if(allowedDomains.indexOf(origin) > -1){
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Accept');
  //@ts-ignore
  res.setHeader('Access-Control-Allow-Credentials', true);

  next();
})
app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/", uploadImgRoutes);
app.use("/api/v1/tags", tagsRoutes);
app.use("/api/v1/roles", rolesRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
