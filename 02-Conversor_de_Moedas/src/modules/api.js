export async function BuscarDados(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Erro ao buscar os dados: ${response.statusText} - Código: ${response.status}`);
        }

        const data = await response.json();
        
        return data;
    }
    catch (error) {
        console.error('Erro ao buscar dados:', error);
        throw new Error('Não foi possível buscar os dados das moedas.' + error.message);
    }
};