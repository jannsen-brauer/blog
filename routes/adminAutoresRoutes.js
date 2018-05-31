var express          = require("express");
var autoresRouter    = express.Router();
var bodyParser       = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });


var AutorModel = require("../models/autormodel");

// tratamento realizada para toda rota de autores
autoresRouter.use((req, res, next) => {
    if (req.app.get("user").id == null)
    {
        res.redirect("/");
        return;
    }
    if (req.app.get("user").id != null && !req.app.get("user").admin)
    {
        res.redirect("/");
        return;
    }
    next();
})

// lista de autores cadastrados
autoresRouter.get("/", (req, res) => {
    AutorModel.find(null, null, {sort:{nome:1}}, (erro, autores) => {
        if (erro)
        {
            return console.error(erro);
        }
        res.render("admin/autores", { autores: autores, user: req.app.get("user")});
    });
});

// view para novo cadastro
autoresRouter.get("/novo", (req, res) => {
    res.render("admin/novoautor", { user: req.app.get("user") });
});

// Incluindo novo usuário
autoresRouter.post("/novo", urlEncodedParser, (req, res) => {
    var parametroViewMsg = {
        msg: "Autor cadastrado!",
        rota: "/admin/autores"
    }
    var autor = new AutorModel({
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == "on")
    });
    autor.save((error, autor) => {
        if (error) console.log(error);
        res.render("admin/msg", { dadosRota: parametroViewMsg, user: req.app.get("user") })
    });
});

// gestão do autor
autoresRouter.get("/:id", (req, res) => {
    AutorModel.findById(req.params.id, (erro, autor) => {
        res.render("admin/autor", { autor: autor, user: req.app.get("user") });
    })
})

// atualização do autor
autoresRouter.post("/:id", urlEncodedParser, (req, res) => {
    var autor = new AutorModel({
        _id: req.params.id,
        nome: req.body.nome,
        email: req.body.email,
        senha: req.body.senha,
        admin: (req.body.admin == "on")
    });
    var parametroViewMsg = {
        msg: "Autor atualizado!",
        rota: "/admin/autores"
    }
    AutorModel.update({ _id: req.params.id }, autor, (erro) => {
        res.render("admin/msg", { dadosRota: parametroViewMsg, user: req.app.get("user") });
    })
})

autoresRouter.get("/:id/excluir", (req, res) => {
    var parametroViewMsg = {
        msg: "Autor excluido!",
        rota: "/admin/autores"
    }
    AutorModel.remove({ _id: req.params.id }, (erro) => {
        res.render("admin/msg", { dadosRota: parametroViewMsg, user: req.app.get("user") });
    })
})

// exportando as rotas configuradas para autores
module.exports = autoresRouter;