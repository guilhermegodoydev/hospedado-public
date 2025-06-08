import { BuscarCotacaoUltimosDias, ConverterMoeda, ListarMoedas } from './modules/moeda.js';
import { RegistrarConversao, BuscarHistoricoConversoes, LimparHistorico } from './modules/historico.js'; 

const caixaSelecao = document.getElementById('lista-moedas');
const opcoesMoedas = document.getElementById('opcoes-moedas');
const resultado = document.getElementById('resultado');
const formulario = document.getElementById('form-conversor');
const botao = document.getElementById('btn-converter');
const periodos = document.getElementById('periodos');
const elHistorico = document.getElementById('historico');
const graficoContainer = document.getElementById('grafico').getContext('2d');
const btnApagarHistorico = document.getElementById('btn-limpar-historico');

let instanciaChart = null;

RenderizarHistorico();

(async () => {
    const moedas = await ListarMoedas();

    moedas.forEach(moeda => {
        const option = document.createElement('option'); 
        option.value = moeda.codigo;
        option.title = moeda.nome;
        option.textContent = moeda.codigo;

        caixaSelecao.appendChild(option);

        const li = document.createElement('li');
        li.textContent = moeda.codigo;
        li.title = moeda.nome;
        li.classList.add("cursor-pointer");

        opcoesMoedas.appendChild(li);
    });

    let moedaSelecionadaGrafico = opcoesMoedas.children[0];
    moedaSelecionadaGrafico.classList.add("text-purple-500");

    let periodoSelecionado = periodos.children[0];
    periodoSelecionado.classList.add("text-purple-500");

    Array.from(opcoesMoedas.children).forEach(item => {
        item.addEventListener('click', () => {
            moedaSelecionadaGrafico.classList.remove("text-purple-500");
            item.classList.add("text-purple-500");
            moedaSelecionadaGrafico = item;

            RenderizarGrafico(moedaSelecionadaGrafico.textContent, periodoSelecionado.getAttribute('dias'));
        });
    });

    Array.from(periodos.children).forEach(item => {
        item.addEventListener('click', () => {
            periodoSelecionado.classList.remove("text-purple-500");
            item.classList.add("text-purple-500");
            periodoSelecionado = item;

            RenderizarGrafico(moedaSelecionadaGrafico.textContent, periodoSelecionado.getAttribute('dias'));
        });
    });

    moedaSelecionadaGrafico.click();
})();

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    AlterarEstadoBotao(botao);

    const valor = document.getElementById('valor').value;

    if (!valor || isNaN(valor) || Number(valor) <= 0) {
        alert('Por favor, insira um valor numérico válido maior que 0.');
        AlterarEstadoBotao(botao);
        return;
    }

    try {
        const moeda = caixaSelecao.value;

        const resultadoConversao = await ConverterMoeda(moeda, valor);
        resultado.textContent = moeda + " " + resultadoConversao;

        RegistrarConversao(valor, moeda, resultadoConversao.toFixed(2));
        RenderizarHistorico();
        
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        alert('Não foi possível converter a moeda. Verifique os dados inseridos e tente novamente.');
    } finally {
        AlterarEstadoBotao(botao);
    }
});

btnApagarHistorico.addEventListener('click', () => {
    LimparHistorico();
    RenderizarHistorico();
});

function AlterarEstadoBotao(botao) {
    botao.disabled = !botao.disabled;
    botao.classList.toggle("cursor-no-drop");
}

async function RenderizarGrafico(moeda, dias) {
    const dados = await BuscarCotacaoUltimosDias(moeda, dias);

    dados.reverse();

    const labels = dados.map(d => dayjs.unix(d.timestamp).format("DD-MM"));
    const valores = dados.map(d => parseFloat(d.ask));

    if (instanciaChart) {
        instanciaChart.destroy();
    }

    const config = {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: `Cotação ${moeda}`,
                data: valores,
                borderColor: '#6e1ed5',
                backgroundColor: '#8564f7a8',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    };

    instanciaChart = new Chart(graficoContainer, config);
}

function RenderizarHistorico() {
    elHistorico.innerHTML = "";
    const historico = BuscarHistoricoConversoes();
    if (historico.length === 0) {
        const li = document.createElement('li');
        li.textContent = "Nenhuma conversão realizada ainda.";
        li.classList.add("p-2", "text-center", "bg-gray-100");
        elHistorico.appendChild(li);
    } else {
        historico.forEach((item, i) => {
            const li = document.createElement('li');
            li.textContent = `R$${Number(item.valor).toFixed(2)} → ${item.paraMoeda} ${Number(item.resultado).toFixed(2)}`;
            li.classList.add("text-start", "p-2", i % 2 === 0 ? "bg-gray-100" : "bg-gray-200");
            elHistorico.appendChild(li);
        });
    }
}