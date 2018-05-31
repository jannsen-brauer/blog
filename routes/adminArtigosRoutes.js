var express          = require("express");
var artigosRouter    = express.Router();
var bodyParser       = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });


var ArtigoModel = require("../models/artigomodel");

// tratamento realizada para toda rota de autores
artigosRouter.use((req, res, next) => {
    if (req.app.get("user").id == null)
    {
        res.redirect("/");
        return;
    }
    next();
})

// lista de autores cadastrados
artigosRouter.get("/", (req, res) => {
    var usuario = req.app.get("user");
    var filtro = null;
    if (!usuario.admin) {
        filtro = { "autor.id": usuario.id };
    }
    ArtigoModel.find(filtro)
    .sort({ criado: -1 })
    .exec((erro, artigos) => {
        if (erro) {
            return console.error(erro);
        }
        res.render("admin/artigos", { artigos: artigos, user: req.app.get("user") });  
    });
});

// view para novo cadastro
artigosRouter.get("/novo", (req, res) => {
    res.render("admin/novoartigo", { user: req.app.get("user") });
});

// Incluindo novo usuário
artigosRouter.post("/novo", urlEncodedParser, (req, res) => {
    var parametroViewMsg = {
        msg: "Artigo cadastrado!",
        rota: "/admin/artigos"
    };
    var artigo = new ArtigoModel({
        titulo: req.body.titulo,
        autor: {
            id: req.body.autor_id,
            nome: req.body.autor_nome
        },
        criado: new Date(),
        atualizado: null,
        resumo: req.body.resumo,
        texto: req.body.texto,
        comentarios: []
    });
    artigo.save(function (erro, artigo) {
        if (erro) return console.error(erro);
        res.render('admin/msg', { dadosRota: parametroViewMsg, user: req.app.get('user') });
    });
});

// gestão do autor
artigosRouter.get("/:id", (req, res) => {
    ArtigoModel.findById(req.params.id, (erro, artigo) => {
        res.render("admin/artigo", { artigo: artigo, user: req.app.get("user") });
    })
})

// atualização do autor
artigosRouter.post("/:id", urlEncodedParser, (req, res) => {
    var artigo = new ArtigoModel({
        _id : req.params.id,
        titulo : req.body.titulo,
        autor : {
            id : req.body.autor_id,
            nome : req.body.autor_nome
        },
        criado : req.body.criado,
        atualizado : new Date(),
        resumo : req.body.resumo,
        texto : req.body.texto,
        comentario: (req.body.comentarios) ? JSON.parse(req.body.comentarios) : [],
    });
    var parametroViewMsg = {
        msg: "Artigo atualizado!",
        rota: "/admin/artigos"
    };
    ArtigoModel.update({ _id: req.params.id }, artigo, (erro) => {
        res.render("admin/msg", { dadosRota: parametroViewMsg, user: req.app.get("user") });
    })
})

artigosRouter.get("/:id/excluir", (req, res) => {
    var parametroViewMsg = {
        msg: "Artigo excluido!",
        rota: "/admin/artigos"
    };
    ArtigoModel.remove({ _id: req.params.id }, (erro) => {
        res.render("admin/msg", { dadosRota: parametroViewMsg, user: req.app.get("user") });
    })
})

// exportando as rotas configuradas para autores
module.exports = artigosRouter;