import apiConfig from "../../apikeys";

var opacidade = 0;
var procurar = document.getElementById("input-cidade");
var matchList = document.getElementById("match-list");
var iconD;

const procurarCidades = async (procurarTexto) => {
  const res = await fetch("../data/cities.json");
  const listaCidades = await res.json();

  // Cidades com o mesmo nome

  let matches = listaCidades.filter((cidade) => {
    const regex = new RegExp(`^${procurarTexto}`, "gi");
    return cidade.name.match(regex);
  });

  if (procurarTexto.length === 0) {
    matches = [];
    matchList.innerHTML = "";
  }

  outputHtml(matches);
};

const outputHtml = (matches) => {
  var cont = 0;

  if (matches.length > 0 && matches.length < 10) {
    const html = matches
      .map(
        (match) => `<a class="sugestoes" href="#" onclick="passarValor(event);">
      <div class="card card-body ">
      <h4 >${match.name}, ${match.country}</h4>
    </div></a>
    `
      )
      .join("");

    matchList.innerHTML = html;
  }
};

procurar.addEventListener("input", () => tresElementos(procurar.value));

function tresElementos(valor) {
  if (valor.length > 2) {
    procurarCidades(valor);
  } else {
    matchList.innerHTML = "";
  }
}

function passarValor(event) {
  var a = event.target.innerHTML;

  document.getElementById("input-cidade").value = a;

  $("#match-list").empty();
}

document.getElementById("botao-procurar").onclick = function () {
  var cidadeAprocurar = procurar.value.split(",");
  console.log(cidadeAprocurar);

  var req = $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cidadeAprocurar[0] +
      "," +
      cidadeAprocurar[1] +
      "&units=metric&appid=" +
      apiConfig.myKey
  );

  var dorn = "";

  req.then(function (rsp) {
    var prefix = "wi wi-";

    var today = new Date();
    var hour = today.getHours();

    if (hour > 6 && hour < 20) {
      //Day time
      dorn = "day-";
    } else {
      //Night time
      dorn = "night-";
    }
    console.log(dorn);
    var code = rsp.weather[0].id;
    iconD = prefix + "owm-" + dorn + code;
  });

  $.getJSON(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cidadeAprocurar[0] +
      "," +
      cidadeAprocurar[1] +
      "&units=metric&appid=" +
      apiConfig.myKey,
    function (data) {
      console.log(data);

      https: atribuirValores(data);
    }
  );
};
function desaparecerConteudo() {
  document
    .getElementById("idconteudo-dados")
    .setAttribute(
      "style",
      "animation: 1.5s ease-out 0s 1 desaparecer forwards;"
    );
}

function atribuirValores(data) {
  var descricao = data.weather[0].description;
  var temperatura = data.main.temp;
  var minTemperatura = data.main.temp_min;
  var maxTemperatura = data.main.temp_max;

  document.getElementById("tempDescricao").innerHTML = descricao;

  document.getElementById("mainTemp").innerHTML =
    "Temperature: " + temperatura + " Cº";

  document.getElementById("minTemp").innerHTML =
    "Min: " + minTemperatura + " Cº";

  document.getElementById("maxTemp").innerHTML =
    "Max: " + maxTemperatura + " Cº";

  document
    .getElementById("idcontainer-principal")
    .setAttribute(
      "style",
      "animation: 1.5s ease-out 0s 1 tirarMargem forwards;"
    );

  document.getElementById("idtempo-icone").className = "";
  document.getElementById("idtempo-icone").className = iconD;

  console.log(temperatura);

  if (temperatura < 10) document.body.style.backgroundColor = "#72cbf7";
  else if (temperatura > 9 && temperatura < 20)
    document.body.style.backgroundColor = "#95f266";
  else if (temperatura > 19) document.body.style.backgroundColor = "#ffce47";

  document
    .getElementById("idconteudo-dados")
    .setAttribute("style", "animation: 1.5s ease-out 0s 1 aparecer forwards;");

  // ocument.getElementById("idbody").classList.remove("mainbackG");d
  // document.getElementById("idbody").classList.add("backG2");

  opacidade = 1;
}
