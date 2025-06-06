import { BuscarDados } from './api.js';

export async function ConverterMoeda(para, valor) {
    try {
        const url = `https://economia.awesomeapi.com.br/json/last/${para}-BRL`;

        const dados = await BuscarDados(url);

        const cotacao = parseFloat(Object.values(dados)[0].ask);
        const total = valor.replace(",",".") / cotacao;

        return total;
    } catch (error) {
        console.error('Erro ao converter moeda');
        throw new Error('Não foi possível converter a moeda.', error);
    }
};

export async function ListarMoedas() {
    try {
        const dados = await BuscarDados('https://economia.awesomeapi.com.br/json/all');

        let moedas = [];

        moedas = Object.entries(dados).map(([key, info]) => ({
            codigo: key,
            nome: info.name.split("/")[0]
        }));

        return moedas;
    } catch (erro) {
        console.error('Erro ao listar moedas:');
        throw new Error('Não foi possível listar as moedas disponíveis.', erro);
    }
};

export async function BuscarCotacaoUltimosDias(moeda, dias) {
    try {
        const dtFim = dayjs();
        const dtInicio = dtFim.subtract(dias, "days");

        const dados = await BuscarDados(`https://economia.awesomeapi.com.br/json/daily/${moeda}/${dias}?start_date=${dtInicio.format("YYYYMMDD")}&end_date=${dtFim.format("YYYYMMDD")}`);

        return dados;
        console.log(dados);
    } catch (error) {
        console.error('Erro ao buscar cotação dos últimos dias');
        throw new Error('Não foi possível buscar a cotação dos últimos dias.', error);
    }
};

