import { BuscarCotacaoUltimosDias, ConverterMoeda, ListarMoedas } from './modules/moeda.js';

const caixaSelecao = document.getElementById('lista-moedas');
const opcoesMoedas = document.getElementById('opcoes-moedas');
const resultado = document.getElementById('resultado');
const formulario = document.getElementById('form-conversor');
const graficoContainer = document.getElementById('grafico').getContext('2d');
const botao = document.getElementById('btn-converter');
const periodos = document.getElementById('periodos');

let instanciaChart = null;

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

            CriarGrafico(moedaSelecionadaGrafico.textContent, periodoSelecionado.getAttribute('dias'));
        });
    });

    Array.from(periodos.children).forEach(item => {
        item.addEventListener('click', () => {
            periodoSelecionado.classList.remove("text-purple-500");
            item.classList.add("text-purple-500");
            periodoSelecionado = item;

            CriarGrafico(moedaSelecionadaGrafico.textContent, periodoSelecionado.getAttribute('dias'));
        });
    });

    moedaSelecionadaGrafico.click();
})();

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    AlterarEstadoBotao(botao);

    let valor = document.getElementById('valor').value;

    if (!valor || isNaN(valor) || Number(valor) <= 0) {
        alert('Por favor, insira um valor numérico válido maior que 0.');
        AlterarEstadoBotao(botao);
        return;
    }

    try {
        let moeda = caixaSelecao.value;

        resultado.textContent = moeda + " " + await ConverterMoeda(moeda, valor);
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        alert('Não foi possível converter a moeda. Verifique os dados inseridos e tente novamente.');
    } finally {
        AlterarEstadoBotao(botao);
    }
});


function AlterarEstadoBotao(botao) {
    botao.disabled = !botao.disabled;
    botao.classList.toggle("cursor-no-drop");
}

async function CriarGrafico(moeda, dias) {
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