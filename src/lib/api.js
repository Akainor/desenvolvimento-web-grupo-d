async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || 'Erro ao comunicar com o servidor.');
  }
  return data;
}

export const api = {
  getCharacters: () => request('/api/characters'),
  saveCharacter: (character) => request('/api/characters', { method: 'POST', body: JSON.stringify(character) }),
  updateCharacter: (character) => request(`/api/characters/${character.id}`, { method: 'PUT', body: JSON.stringify(character) }),
  deleteCharacter: (id) => request(`/api/characters/${id}`, { method: 'DELETE' }),
  getRolls: () => request('/api/rolls'),
  rollDice: (expression) => request('/api/rolls', { method: 'POST', body: JSON.stringify({ expression }) }),
  clearRolls: () => request('/api/rolls', { method: 'DELETE' }),
};
