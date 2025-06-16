import { BuscarDados } from './api.js';

export async function ConverterMoeda(para, valor) {
    try {
        const url = `https://economia.awesomeapi.com.br/json/last/${para}-BRL`;
        const dados = await BuscarDados(url);

        const cotacao = parseFloat(Object.values(dados)[0].ask);
        const valorNumerico = typeof valor === "string" ? parseFloat(valor.replace(",", ".")) : Number(valor);

        if (isNaN(valorNumerico) || isNaN(cotacao) || cotacao === 0) {
            throw new Error('Valor ou cotação inválidos.');
        }

        return valorNumerico / cotacao;
    } catch (error) {
        console.error('Erro ao converter moeda:', error);
        throw new Error('Não foi possível converter a moeda. ' + error.message);
    }
}

export async function ListarMoedas() {
    try {
        const dados = await BuscarDados('https://economia.awesomeapi.com.br/json/all');
        return Object.entries(dados).map(([key, info]) => ({
            codigo: key,
            nome: info.name.split("/")[0]
        }));
    } catch (error) {
        console.error('Erro ao listar moedas:', error);
        throw new Error('Não foi possível listar as moedas disponíveis. ' + error.message);
    }
}

export async function BuscarCotacaoUltimosDias(moeda, dias) {
    try {
        const dtFim = dayjs();
        const dtInicio = dtFim.subtract(dias, "days");
        const url = `https://economia.awesomeapi.com.br/json/daily/${moeda}/${dias}?start_date=${dtInicio.format("YYYYMMDD")}&end_date=${dtFim.format("YYYYMMDD")}`;
        const dados = await BuscarDados(url);
        
        return dados;
    } catch (error) {
        console.error('Erro ao buscar cotação dos últimos dias:', error);
        throw new Error('Não foi possível buscar a cotação dos últimos dias. ' + error.message);
    }
}

