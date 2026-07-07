
const BASE_URL = 'http://localhost:5218/api'; 

export async function fetchAtivos(incluirExcluidos = false) {
  const response = await fetch(`${BASE_URL}/ativos?incluirExcluidos=${incluirExcluidos}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Falha ao buscar ativos');
  return response.json();
}

export async function cadastrarAtivo(dados: any) {
  const response = await fetch(`${BASE_URL}/ativos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!response.ok) throw new Error('Falha ao cadastrar');
  return response.json();
}