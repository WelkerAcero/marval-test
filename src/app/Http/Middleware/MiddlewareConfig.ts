import express, { Express, Response, Request, NextFunction } from "express";
import response_time from "response-time";
import cookieParser from 'cookie-parser';
import BodyParser from "body-parser";
import cors from "cors";
import http from "http"
import dotenv from 'dotenv';
dotenv.config();

export default class MiddlewareConfig {
  public frontUrl: string = process.env.FRONT_END_URL!;
  public whiteList: string[] = [this.frontUrl!];
  public _app: Express = express();

  public server = http.createServer({ maxHeaderSize: 10000000, requestTimeout: 300000 }, this._app);
  
  constructor() {
    console.log('Cors whitelist:', this.whiteList);
    this._app.use(response_time());
    this._app.use(express.json({ limit: '100mb' }));
    this._app.use(BodyParser.urlencoded({ extended: true, limit: '100mb' }));
    this._app.use(cookieParser());

    this._app.use(cors({
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Content-Security-Policy', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'User-Agent', 'X-Content-Type-Options'],
      credentials: true,
      preflightContinue: false,
      optionsSuccessStatus: 204,
      origin: (origin, callback) => {
        if (origin && this.whiteList.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`${origin} Not allowed by CORS`));
        }
      }
    }));

    // Middleware de manejo de errores en las peticiones
    this._app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error('Error:', err.message);
      res.status(500).json({ error: 'Something went wrong!' });
    });

    //this._app.set('trust proxy', true);
  }
}