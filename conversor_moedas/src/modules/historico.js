const HISTORICO_KEY = "conversoes";
const TEMPO_EXPIRACAO_MS = 30 * 60 * 1000;

export function RegistrarConversao(valor, moeda, resultadoConversao) {
    let historico = BuscarHistoricoConversoes();
    historico.push({
        valor: valor,
        paraMoeda: moeda,
        resultado: resultadoConversao,
        timestamp: Date.now()
    });
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(historico));
}

export function BuscarHistoricoConversoes() {
    let dados = JSON.parse(localStorage.getItem(HISTORICO_KEY)) || [];
    dados = ExcluirDadosAntigos(dados);
    localStorage.setItem(HISTORICO_KEY, JSON.stringify(dados));
    return dados;
}

export function LimparHistorico() {
    localStorage.removeItem(HISTORICO_KEY);
}

function ExcluirDadosAntigos(dados) {
    const agora = Date.now();
    return dados.filter(registro => 
        registro.timestamp && (agora - registro.timestamp < TEMPO_EXPIRACAO_MS)
    );
}