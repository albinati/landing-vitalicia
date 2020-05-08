var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;

function validateEmail() {
    if (!email_regex.test($("#email_quote").val())) {
        $("#email_label").html("Email inválido!");
        $('#email_quote').trigger('focus');
        return false
    } else {
        $("#email_label").html("");
        return true
    }
}

function quote() {

    if (!validateEmail()) {
        return false;
    }
    var service_url = "https://jqe8iwi2gc.execute-api.us-east-2.amazonaws.com/PROD"

    var quote_data = {
        "email": $('#email_quote').val(),
        "times": $('#parcela').val(),
        "need": $('#need').val(),
    }

    if ($("#phone_quote").val()) {
        quote_data['phone'] = $("#phone_quote").val();
    }

    console.log(quote_data);

    var xhr = new XMLHttpRequest();
    const options = {
        method: 'POST',
        body: JSON.stringify(quote_data),
        headers: {
            'Content-Type': 'application/json'
        }
    }

    fetch(service_url, options)
        .then(function(response) {
            $('#toast_response').html("Seu pedido foi enviado! Entraremos em contato o mais breve possível.");
            $('#quote_done').toast('show');
        })
        .catch(function(response) {
            $('#toast_response').html("Houve um problema ao processar o seu pedido, tente novamente mais tarde.");
            $('#quote_done').toast('show');
        });

    $('#quote_modal').modal('hide');
    $(".modal-backdrop").remove();

}


function get_value(key) {
    var values = {
        "": [0, ""],
        "acompanhamento": [5000, 'R$ 5.000,00'],
        "fisioterapia": [6500, 'R$ 6.500,00'],
        "pediatra": [4800, 'R$ 4.800'],
        "cirurgia_estetica": [30000, "R$ 30.000,00"],
        "cirurgia": [40000, "R$ 40.000,00"],
        "dentista_estetica": [20000, "R$20.000,00"],
        "dentista": [12000, "R$ 12.000,00"],
        "psico": [6000, "R$ 6.000,00"]
    };

    return values[key];
}

$('#need').on('change', function(e) {
    $('#valor_procedimento').text("");
    $('#legenda_valor').text("");
    $('#valor').val(0);
    $('#valor_procedimento').text(get_value(this.value)[1]);
    $('#valor').val(get_value(this.value)[0]);
    set_valor();
    $('#legenda_valor').text("-  valor global de referência");
});

var slider = document.getElementById("parcela");
var output = document.getElementById("legenda_parcela");
output.innerHTML = slider.value + "x";


slider.oninput = function() {
    parcelas = this.value
    output.innerHTML = parcelas + "x";
    set_valor();
}

function set_valor() {
    parcelas = $('#parcela').val();
    valor_medio = $('#valor').val();
    taxa_juros = 0.02;
    valor = valor_medio * Math.pow((1 + taxa_juros), parcelas);
    valor_parcela = valor / parcelas;
    cada_parcela = (valor_parcela).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
    $('#legenda_valor_parcela').text(cada_parcela);
    valor_final = (valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
    $('#legenda_valor_final').text(valor_final);
    juros_final = (valor - valor_medio).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
    $('#legenda_juros_final').text(juros_final);
    $('#legenda_taxa').text("(" + (taxa_juros * 100) + "% ao mês)");

}

$(document).ready(function() {
    $('.combobox').combobox()
    $('.toast').toast('hide');
});

$('#quote_modal').on('shown.bs.modal', function() {
    $('#email_quote').trigger('focus')
})

$("#email_quote").blur(validateEmail)