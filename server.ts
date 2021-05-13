import * as  express from "express";
import * as path from "path";
import * as WebSocket from "ws";
import { Clip } from "./core/classes/Clip";
import { CompilationController } from "./core/classes/CompilationController";
import { IAutomaticCompilationConfig, ICompilationConfig, IManualCompilationConfig } from "./core/types";


const PORT = 8080;
const WSPORT = 8081;

const app = express();
const wss = new WebSocket.Server({ port: WSPORT });
app.use(express.static(path.join(__dirname, "/gui/dist")));
app.listen(PORT);  

console.log("Website started at http://localhost:" + PORT);





wss.on("connection", (ws: WebSocket) => {
  ws.on("message", async (message: string) => {
    console.log(message);
    const obj = JSON.parse(message);
    if (obj.header === "clipSearch") {
      const config = obj.data as IAutomaticCompilationConfig;
      const clipsData = await Clip.queryClipsData(config);
      ws.send(JSON.stringify({ header: "clipSearchResult", data: clipsData }));
    } else if (obj.header === "render") {
      const config = obj.data as IManualCompilationConfig;
      const compilationController = new CompilationController(config);
      compilationController.run();
    }
    console.log("received: %s", message);
  });
});


