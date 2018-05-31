var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var artigoSchema = new Schema(
    {
        titulo: {type: String, required: true},
        autor:{
            id: Schema.Types.ObjectId,
            nome: String
        },
        criado: Date,
        atualizado: Date,
        resumo: String,
        texto: String,
        comentario: [{
            nome: String,
            texto: String,
            data: { type: Date, default: Date.now },
            curtiu: { type: Number, default: 0 },
            naocurtiu: { type: Number, default: 0 }
        }]
    }
);

module.exports = mongoose.model("Artigo", artigoSchema);