var express          = require("express");
var app              = express();
var bodyParser       = require("body-parser");
var urlEncodedParser = bodyParser.urlencoded({ extended: false });
var mongoose         = require("mongoose");
var moment           = require("moment");
const porPagina      = 2;

moment.locale("pt-BR");

mongoose.connect("mongodb://localhost:27017/blog");

// model
var AutorModel  = require("./models/autormodel");
var ArtigoModel = require("./models/artigomodel");

// sets
app.set("view engine", "ejs");
app.set("user", { id: null, nome: "", admin: false });

// rotas filhas
var adminAutoresRoute = require("./routes/adminAutoresRoutes");
app.use("/admin/autores", adminAutoresRoute);

var adminArtigosRoute = require("./routes/adminArtigosRoutes");
app.use("/admin/artigos", adminArtigosRoute);

var comentariosRoute = require("./routes/comentariosRoutes");
app.use("/api/comentario", comentariosRoute);

// fuções locais
app.locals.formataData = (d) => {
    return moment(d).format("LLLL");
};

// roteamento
app.use("/public", express.static("./public"));

app.get("/", (req, res) => {
    res.redirect("/artigos");
});

// lista todos os artigos
app.get("/artigos", (req, res) => {
    ArtigoModel.find(null)
    .limit(porPagina)
    .sort({ criado: -1 })
    .skip(porPagina * 0)
    .exec((error, artigos) => {
        res.render("artigos", { pagina: 0, porPagina: porPagina, filtro: null, artigos: artigos, user: app.get("user")});
    });
});

// lista os artigos considerando a página informada
app.get("/artigos/pagina/:pagina", (req, res) => {
    ArtigoModel.find(null)
    .limit(porPagina)
    .sort({ criado: -1 })
    .skip(porPagina * req.params.pagina)
    .exec((error, artigos) => {
        res.render("artigos", { pagina: req.params.pagina, porPagina: porPagina, filtro: null, artigos: artigos, user: app.get("user")});
    });
});

// lista todos autores
app.get("/autores", (req, res) => {
    AutorModel.find(null)
    .sort({ nome: 1 })
    .exec((error, autores) => {
        res.render("autores", { autores: autores, user: app.get("user")});
    });
});

// lista todos os artigos dos autores informados
app.get("/artigos/:autor_id", (req, res) => {
    ArtigoModel.find({ "autor.id": req.params.autor_id})
    .limit(porPagina)
    .skip(porPagina * 0)
    .sort({ criado: -1 })
    .exec((error, artigos) => {
        if (artigos && artigos.length){
            res.render("artigos", { pagina: 0, porPagina: porPagina, filtro: { nome: artigos[0].autor.nome, id: artigos[0].autor.id }, artigos: artigos, user: app.get("user")});
        }
        else{
            res.render("artigos", { pagina: 0, porPagina: porPagina, filtro: null, artigos: [], user: app.get("user")});
        }
    });
});

// lista todos os artigos dos autores informados considerando o número da página
app.get("/artigos/:autor_id/pagina/:pagina", (req, res) => {
    ArtigoModel.find({ "autor.id": req.params.autor_id})
    .limit(porPagina)
    .skip(porPagina * req.params.pagina)
    .sort({ criado: -1 })
    .exec((error, artigos) => {
        if (artigos && artigos.length){
            res.render("artigos", { pagina: req.params.pagina, porPagina: porPagina, filtro: { nome: artigos[0].autor.nome, id: artigos[0].autor.id }, artigos: artigos, user: app.get("user")});
        }
        else{
            res.render("artigos", { pagina: req.params.pagina, porPagina: porPagina, filtro: null, artigos: [], user: app.get("user")});
        }
    });
});

// mostra detalhes do artigo selecionado
app.get("/artigo/:id", (req, res) => {
    ArtigoModel.findById(req.params.id, (error, artigo) => {
        res.render("artigo", { artigo: artigo, user: app.get("user")});
    });
});

app.post("/artigo/:id/comentario", urlEncodedParser, (req, res) => {
    var comentario = {
        nome: req.body.nome,
        texto: req.body.comentario
    }
    ArtigoModel.findById(req.params.id, (error, artigo) => {
        if (error) return console.error(error);
        if (artigo)
        {
            artigo.comentario.push(comentario);
            ArtigoModel.update({ _id: artigo._id }, artigo, (error) => {
                if (error) return console.error(error);
                var parametroViewMsg = {
                    msg: "Comentário registrado com sucesso!",
                    rota: "/artigo/".concat(artigo._id)
                }
                res.render("admin/msg", { dadosRota: parametroViewMsg, artigo: artigo, user: app.get("user") });
            });
        }
    });
});

// exibe a página de login
app.get("/login", (req, res) => {
    res.render("login", { user: app.get("user") });
});

// realiza logout
app.get("/logout", (req, res) => {
    app.set("user", { id: null, nome: "", admin: false });
    res.redirect("/artigos");
});

app.post("/login", urlEncodedParser, (req, res) => {
    AutorModel.findOne({ email: req.body.email.trim()}, (erro, autor) => {
        if (erro) return console.error(erro);
        if (autor){
            if (req.body.senha == autor.senha){
                app.set("user", { id: autor._id, nome: autor.nome, admin: autor.admin });
                res.redirect("/admin/artigos");
            }
            else{
                res.render("logininvalido", { user: app.get("user")});
                return;
            }
        }
        else{
            res.render("logininvalido", { user: app.get("user")});
            return;
        }
    });
});

app.listen(3000);
