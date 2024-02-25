import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { PixelsJsonPayload, forwardRequestToDiscord } from './discord-adapter.ts';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get("/", (req: Request, res: Response) => {
	res.send("Express + TypeScript Server");
});

app.post("/pixels", async (req: Request, res: Response) => {
    console.log(`Called pixels endpoint with ${JSON.stringify(req.body)}`);
    const sanitizedPayload: PixelsJsonPayload = {
        pixelName: req.body.pixelName,
        profileName: req.body.profileName,
        actionValue: req.body.actionValue,
        faceValue: req.body.faceValue,
    };
    res.statusCode = await forwardRequestToDiscord(sanitizedPayload);
    res.send();
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
