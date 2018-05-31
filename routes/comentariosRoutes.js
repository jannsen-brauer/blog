var express           = require("express");
var comentariosRouter = express.Router();
var bodyParser        = require("body-parser");
var urlEncodedParser  = bodyParser.urlencoded({ extended: false });
var ArtigoModel       = require("../models/artigomodel");


comentariosRouter.put("/up-comentario", urlEncodedParser, (req, res) => {
    var curtiu, naocurtiu;
    ArtigoModel.findById(req.body.idartigo, (error, artigo) => {
        if (error) return console.error(error);
        artigo.comentario.forEach(c => {
            if (c._id == req.body.idcomentario)
            {
                c.curtiu    += parseInt(req.body.curtiu);
                c.naocurtiu += parseInt(req.body.naocurtiu);
                curtiu       = c.curtiu;
                naocurtiu    = c.naocurtiu;
            }
        });
        ArtigoModel.update({_id : artigo._id}, artigo, (erro) => {
            if (erro) return console.error(erro);
            res.json({ acao: true, curtidas: curtiu, naoCurtidas:naocurtiu });
        });
    });
});

module.exports = comentariosRouter;