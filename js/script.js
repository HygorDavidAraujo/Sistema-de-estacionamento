var veiculos = [];
var valorPrimeiraHora;
var valorHoraAdicional;

// Função para carregar os valores do localStorage e verificar se estão salvos
window.onload = function() {
    if (!loadConfigFromLocalStorage()) {
        openMenu();
    }
};

// Função para carregar os valores do localStorage
function loadConfigFromLocalStorage() {
    var savedValorPrimeiraHora = localStorage.getItem("valorPrimeiraHora");
    var savedValorHoraAdicional = localStorage.getItem("valorHoraAdicional");
    if (savedValorPrimeiraHora !== null && savedValorHoraAdicional !== null) {
        valorPrimeiraHora = parseFloat(savedValorPrimeiraHora);
        valorHoraAdicional = parseFloat(savedValorHoraAdicional);
        return true; // Retorna true se os valores estiverem salvos
    }
    return false; // Retorna false se os valores não estiverem salvos
}

function openEntradaPopup() {
    document.getElementById("entradaPopup").style.display = "block";
}

function openSaidaPopup() {
    document.getElementById("saidaPopup").style.display = "block";
    document.getElementById("placaSaida").value = "";
}

function closePopup(popupId) {
    document.getElementById(popupId).style.display = "none";
    clearFields();
}

function clearFields() {
    document.getElementById("placaEntrada").value = "";
    document.getElementById("marcaEntrada").value = "";
    document.getElementById("modeloEntrada").value = "";
    document.getElementById("corEntrada").value = "";
    document.getElementById("placaSaida").value = "";
}

function registrarEntrada() {
    var placa = document.getElementById("placaEntrada").value;
    var marca = document.getElementById("marcaEntrada").value;
    var modelo = document.getElementById("modeloEntrada").value;
    var cor = document.getElementById("corEntrada").value;
    var entrada = new Date();
    veiculos.push({placa: placa, marca: marca, modelo: modelo, cor: cor, entrada: entrada});
    closePopup("entradaPopup");
    openCupomPopup(placa, marca, modelo, cor, entrada);
}

function openCupomPopup(placa, marca, modelo, cor, entrada) {
    document.getElementById("imprimirPopup").style.display = "block";
    document.getElementById("dadosVeiculoImprimirEntrada").innerHTML = "Placa: " + placa + "<br>" +
                                                                     "Marca: " + marca + "<br>" +
                                                                     "Modelo: " + modelo + "<br>" +
                                                                     "Cor: " + cor + "<br>";
    document.getElementById("horaEntradaImprimirEntrada").innerHTML = "Hora de Entrada: " + formatTime(entrada);
}

function imprimirCupom(contexto) {
    if (contexto === "entrada") {
        selectPrinter("imprimirPopup");
    } else if (contexto === "saida") {
        selectPrinter("imprimirPopupSaida");
    }
}

function selectPrinter(popupId) {
    var popup = document.getElementById(popupId);
    if (popup && popup.style.display === "block") {
        if (window.print) {
            window.print();
        } else {
            alert("A impressão não é suportada neste navegador.");
        }
    }
}

function calcularPermanencia() {
    var placa = document.getElementById("placaSaida").value;
    var saida = new Date();
    var veiculoEncontrado = veiculos.find(function(v) {
        return v.placa === placa;
    });
    if (veiculoEncontrado) {
        var entrada = veiculoEncontrado.entrada;
        var permanenciaMillis = saida.getTime() - entrada.getTime();
        var permanenciaMinutos = Math.ceil(permanenciaMillis / (1000 * 60));
        var horas = Math.floor(permanenciaMinutos / 60);
        var minutos = permanenciaMinutos % 60;
        var valorPagar = 0;
        if (horas === 0) {
            valorPagar = valorPrimeiraHora;
        } else {
            valorPagar = valorPrimeiraHora + (horas - 1) * valorHoraAdicional;
        }

        openImprimirPopup(entrada, valorPagar, horas, minutos);
    } else {
        alert("Veículo não encontrado!");
    }
}

function openImprimirPopup(entrada, valorPagar, horas, minutos) {
    document.getElementById("imprimirPopup").style.display = "block";
    document.getElementById("valorPagarImprimir").innerHTML = "Valor a Pagar: R$ " + valorPagar.toFixed(2);
    if (entrada instanceof Date) {
        document.getElementById("horaEntradaImprimir").innerHTML = "Hora de Entrada: " + formatTime(entrada);
    } else {
        console.error("Valor de entrada inválido:", entrada);
    }
    document.getElementById("tempoPermanenciaImprimir").innerHTML = "Tempo de Permanência: " + horas + " horas e " + minutos + " minutos";
}

function openMenu() {
    document.getElementById("menu").style.display = "block";
}

function closeMenu() {
    document.getElementById("menu").style.display = "none";
}

function saveConfig() {
    valorPrimeiraHora = parseFloat(document.getElementById("valorPrimeiraHora").value);
    valorHoraAdicional = parseFloat(document.getElementById("valorHoraAdicional").value);
    closeMenu();
    localStorage.setItem("valorPrimeiraHora", valorPrimeiraHora);
    localStorage.setItem("valorHoraAdicional", valorHoraAdicional);
}

function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return hours + ':' + minutes + ':' + seconds;
}

function checkConfig() {
    var savedValorPrimeiraHora = localStorage.getItem("valorPrimeiraHora");
    var savedValorHoraAdicional = localStorage.getItem("valorHoraAdicional");
    if (savedValorPrimeiraHora && savedValorHoraAdicional) {
        valorPrimeiraHora = parseFloat(savedValorPrimeiraHora);
        valorHoraAdicional = parseFloat(savedValorHoraAdicional);
        return true;
    }
    return false;
}
