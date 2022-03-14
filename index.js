import express from "express";
import winston from "winston";                                            //Para gravação de logs
import accountsRouter from "./routes/account.routes.js";
import {promises as fs} from "fs";
import cors from "cors";
import swaggerUi from "swagger-ui-express";                              //Documentação
import {swaggerDocument} from "./doc.js";

const {readFile, writeFile} = fs;

global.fileName = "accounts.json";

const {combine, timestamp, label, printf} = winston.format;
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

global.logger = winston.createLogger({
    level: "silly",
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "my-bank-api.log" })
    ],
    format: combine(
        label({label: "my-bank-api"}),
        timestamp(),
        myFormat
    )
});

const app = express();
app.use(express.json());
app.use(cors());                                                        //Libera endpoints para outra api
app.use(express.static("public"));                                      //Servindo página estática criada para teste do cors
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));     //Servindo documentação do Swagger
app.use("/account", accountsRouter);
app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        logger.info("API Started!");
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        }
        try {
            await writeFile(global.fileName, JSON.stringify(initialJson));
            logger.info("API Started and File Created!");
        } catch (err) {
            logger.error(err);
        }
    }
});