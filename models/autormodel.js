var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var autorSchema = new Schema(
    {
        nome : String,
        email : String,
        senha : String,
        admin : { type: Boolean, default:false}
    }
);

module.exports = mongoose.model("Autor", autorSchema);