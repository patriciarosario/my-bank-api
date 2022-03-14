//Rotas são responsáveis apenas pelo ncaminhamento das requisições

import express from "express";
import cors from "cors";
import AccountController from "../controllers/account.controllers.js";

const router = express.Router();

router.post("/", AccountController.createAccount);                                   //Adicionar conta
router.get("/", AccountController.getAccounts);                                      //Trás conteudo do arquivo - contas
router.get("/:id", AccountController.getAccount);                                    //Trás conta com determinado id
router.delete("/:id", AccountController.deleteAccount);                              //Deleta conta
router.put("/", AccountController.updateAccount);                                    //Atualizar conta
router.patch("/updateBalance", AccountController.updateBalance);                     //Atualizar saldo

// Tratamento de erros
router.use((err, req, res, next) => {
    logger.error(`${err.message}`);
    res.status(400).send({ error: err.message});
});

export default router;