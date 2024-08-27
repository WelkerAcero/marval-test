import MiddlewareConfig from "../app/Http/Middleware/MiddlewareConfig"
import ConfigRouteList from "../routes/ConfigRouteList";
import { IRouter } from "express";
import dotenv from "dotenv";
dotenv.config();

export default class MyServer extends MiddlewareConfig {
  private _port: number | string = process.env.PORT || 8000;

  constructor() {
    super();
  }

  routes() {
    const ROUTES: IRouter[] = ConfigRouteList.getRoutes();
    ROUTES.forEach((element: IRouter) => {
      this._app.use('/api', element);
    });

    this._app.use((req, res, next) => {
      // console.log(`Request URL: ${req.url}`);
      // console.log(`Request Headers: ${JSON.stringify(req.headers)}`);
      next();
    });

    this._app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", this.frontUrl);
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH");
      next();
    })
  }

  // async ngrokConnection(): Promise<any> {
  //   ngrok.disconnect("ma2w1wkc");
  //   ngrok.kill();
  //   const url = await ngrok.connect({
  //     id: "rd_2PiMfCMk0kLlbTdJOkn0oJJluq9",
  //     proto: "http", // http|tcp|tls, defaults to http
  //     addr: this._port,
  //     domain: "ma2w1wkc",
  //     //subdomain: "jay-fresh-filly.ngrok-free.app",
  //   });
  //   return console.log(`This is the route generated: ${url}`);
  // }

  async start() {
    //await this.ngrokConnection();
    this.routes();
    this.server.listen(this._port, () => {
      console.log("localhost:" + this._port);
    });
  }

}
const server = new MyServer();
server.start();


