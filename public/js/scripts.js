$(document).on("click", ".curtiu", function () {
    var curtiu    = 1;
    var naocurtiu = 0; 
    var obj       = $(this);

    if ($("#spanCurtiu_".concat($(this).data("comentario"))).hasClass("marcou-curtiu")) {
        curtiu = (parseInt($("#curtiu_".concat($(this).data("comentario"))).text()) > 1) ? -1 : 0;
        $("#spanCurtiu_".concat($(this).data("comentario"))).removeClass("marcou-curtiu");
    }

    if ($("#spanNaocurtiu_".concat($(this).data("comentario"))).hasClass("marcou-naocurtiu")){
        naocurtiu = (parseInt($("#naocurtiu_".concat($(this).data("comentario"))).text()) > 1) ? -1 : 0;
        $("#spanNaocurtiu_".concat($(this).data("comentario"))).removeClass("marcou-naocurtiu");
    }
    atualizaCurtidasArtigo($(this).data("comentario"), curtiu, naocurtiu, obj);
});

$(document).on("click", ".naocurtiu", function () {
    var curtiu    = 0;
    var naocurtiu = 1;
    var obj       = $(this);
    
    if ($("#spanNaocurtiu_".concat($(this).data("comentario"))).hasClass("marcou-naocurtiu")) {
        naocurtiu = (parseInt($("#naocurtiu_".concat($(this).data("comentario"))).text()) > 1) ? -1 : 0;
        $("#spanNaocurtiu_".concat($(this).data("comentario"))).removeClass("marcou-naocurtiu");
    }
    
    if ($("#spanCurtiu_".concat($(this).data("comentario"))).hasClass("marcou-curtiu")) {
        curtiu = (parseInt($("#curtiu_".concat($(this).data("comentario"))).text()) > 1) ? -1 : 0;
        $("#spanCurtiu_".concat($(this).data("comentario"))).removeClass("marcou-curtiu");
    }
    atualizaCurtidasArtigo($(this).data("comentario"), curtiu, naocurtiu, obj);
});

function atualizaCurtidasArtigo(idcomentario, curtiu, naocurtiu, obj)
{
    $.ajax({
        url: "/api/comentario/up-comentario",
        type: "PUT",
        dataType: "JSON",
        data: {
            idcomentario: idcomentario,
            curtiu: curtiu,
            naocurtiu: naocurtiu,
            idartigo: $("#idartigo").val()
        },
        success: function (data) {
            if (curtiu == 1)
            {
                obj.addClass("marcou-curtiu");
                obj.removeClass("marcou-naocurtiu");
            }
            else if (naocurtiu == 1){
                obj.removeClass("marcou-curtiu");
                obj.addClass("marcou-naocurtiu");
            }

            $("#curtiu_".concat(idcomentario)).html(data.curtidas);
            $("#naocurtiu_".concat(idcomentario)).html(data.naoCurtidas);
        },
        error: function (data) {
        }
    })
}