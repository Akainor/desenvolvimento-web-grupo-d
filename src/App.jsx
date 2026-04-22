import React, { useEffect, useMemo, useState } from 'react';
import { archetypes, occupations, contactTypes, relationCosts, steps, progressionByLevel } from './data/coloniaData';
import { api } from './lib/api';

const ATTRIBUTE_PRESETS = [
  { label: '3 / 2 / 1', values: { fisico: 3, esperteza: 2, sagacidade: 1 } },
  { label: '2 / 2 / 2', values: { fisico: 2, esperteza: 2, sagacidade: 2 } },
];

const SUBATTRIBUTE_LABELS = {
  potencia: 'Potência',
  agilidade: 'Agilidade',
  vigor: 'Vigor',
  informacoes: 'Informações',
  tecnologia: 'Tecnologia',
  tecnica: 'Técnica',
  percepcao: 'Percepção',
  labia: 'Lábia',
  intuicao: 'Intuição',
};


const emptyCharacter = () => ({
  id: crypto.randomUUID(),
  nome: 'Novo Protagonista',
  conceito: '',
  nivel: 1,
  xp: 0,
  archetype: 'Rebelde',
  talents: [],
  occupation: 'Guerrilheiro',
  skill: 'Linha de Frente',
  selectedMod: 'Motor Muscular',
  selectedModDescription: 'Ao testar Intuição ou Percepção, adicione DG iguais ao seu Físico sem gastar da Reserva.',
  items: [],
  contacts: [],
  notes: '',
  attributes: { fisico: 3, esperteza: 2, sagacidade: 1 },
  subattributes: {
    potencia: 0,
    agilidade: 0,
    vigor: 0,
    informacoes: 0,
    tecnologia: 0,
    tecnica: 0,
    percepcao: 0,
    labia: 0,
    intuicao: 0,
  },
  currentBp: 0,
  currentCe: 0,
  gambiarraPool: 3,
});

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getEnergyByLevel(level) {
  return level >= 4 ? 12 : 6;
}

function getAvailableTalentCount(level) {
  if (level === 1) return 3;
  if (level === 2) return 3;
  if (level === 3) return 4;
  if (level === 4) return 4;
  if (level === 5) return 5;
  return 5;
}

function calculateBp(character) {
  return 5 + character.attributes.fisico + character.subattributes.vigor + character.nivel;
}

function buildCharacter(partial) {
  const bp = calculateBp(partial);
  const ce = getEnergyByLevel(partial.nivel);
  return {
    ...partial,
    currentBp: partial.currentBp ? Math.min(partial.currentBp, bp) : bp,
    currentCe: partial.currentCe ? Math.min(partial.currentCe, ce) : ce,
  };
}


function getLevelOneSkills(occupationName) {
  return occupations[occupationName].skills.filter((item) => item.level === 1);
}

function getSkillByName(occupationName, skillName) {
  return occupations[occupationName].skills.find((item) => item.name === skillName);
}

function linesToArray(value) {
  return value.split('\n').map((item) => item.trim()).filter(Boolean);
}

function Header({ currentPage, onNavigate, activeCharacter }) {
  const nav = [
    ['landing', 'Início'],
    ['dashboard', 'Personagens'],
    ['creator', 'Criador'],
    ['sheet', 'Ficha'],
    ['dice', 'Rolagens'],
  ];

  return (
    <header className="topbar">
      <button className="brand" onClick={() => onNavigate('landing')}>COLÔNIA RPG</button>
      <nav className="topnav">
        {nav.map(([key, label]) => (
          <button
            key={key}
            className={currentPage === key ? 'navlink active' : 'navlink'}
            onClick={() => onNavigate(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="topbar-status">{activeCharacter ? activeCharacter.nome : 'Sem ficha selecionada'}</div>
    </header>
  );
}

function LandingPage({ onCreate, onNavigate, characterCount }) {
  return (
    <div className="page landing-page">
      <section className="hero card">
        <div className="hero-badge">Sistema de fichas digitais</div>
        <h1>Crie fichas para Colônia com visual inspirado no projeto do StitchAI.</h1>
        <p>
          Monte protagonistas, calcule Bio Pontos e Cargas de Energia automaticamente, acompanhe ocupações,
          talentos e use um rolador focado nas regras básicas do sistema.
        </p>
        <div className="hero-actions">
          <button className="primary-btn" onClick={onCreate}>Criar protagonista</button>
          <button className="ghost-btn" onClick={() => onNavigate('dashboard')}>Ver fichas salvas</button>
        </div>
      </section>

      <section className="feature-grid">
        <article className="feature-card card"><strong>01</strong><h3>Criação guiada</h3><p>Fluxo em etapas com base inicial, arquétipo, ocupação, mod, recursos, atributos e detalhes finais.</p></article>
        <article className="feature-card card"><strong>02</strong><h3>Nível 1 correto</h3><p>O criador monta sempre um protagonista de nível 1; a progressão futura fica separada na ficha.</p></article>
        <article className="feature-card card"><strong>03</strong><h3>Ficha viva</h3><p>Edite vida, energia, pool de gambiarra, equipamentos, contatos e anotações em um painel único.</p></article>
        <article className="feature-card card"><strong>04</strong><h3>Rolagens rápidas</h3><p>Teste expressões como 4d6, 6d6+1 e veja sucessos, desastres e histórico recente.</p></article>
      </section>

      <section className="stats-strip card">
        <div><span>{characterCount}</span><small>fichas salvas no backend</small></div>
        <div><span>3</span><small>atributos base</small></div>
        <div><span>9</span><small>subatributos</small></div>
        <div><span>10</span><small>ocupações iniciais no app</small></div>
      </section>
    </div>
  );
}

function Dashboard({ characters, onOpen, onCreate }) {
  return (
    <div className="page dashboard-layout">
      <aside className="sidebar card">
        <h2>Colônia</h2>
        <p>Dashboard de fichas</p>
        <div className="sidebar-links">
          <div className="sidebar-item active">Dashboard</div>
          <div className="sidebar-item">Protagonistas</div>
          <div className="sidebar-item">Rolagens</div>
          <div className="sidebar-item">Contatos</div>
        </div>
      </aside>
      <main className="dashboard-main">
        <div className="dashboard-head">
          <h2>Meus personagens</h2>
          <button className="primary-btn" onClick={onCreate}>+ Criar novo protagonista</button>
        </div>
        <div className="dashboard-grid">
          {characters.map((character) => {
            const maxBp = calculateBp(character);
            const maxCe = getEnergyByLevel(character.nivel);
            return (
              <article key={character.id} className="character-card card">
                <div className="character-card-head">
                  <div>
                    <h3>{character.nome}</h3>
                    <p>Arquétipo: {character.archetype}</p>
                  </div>
                  <span className="level-chip">LVL {String(character.nivel).padStart(2, '0')}</span>
                </div>
                <div className="resource-duo">
                  <div>
                    <small>Bio Pontos</small>
                    <strong>{character.currentBp} / {maxBp}</strong>
                  </div>
                  <div>
                    <small>Energia</small>
                    <strong>{character.currentCe} / {maxCe}</strong>
                  </div>
                </div>
                <button className="primary-btn wide" onClick={() => onOpen(character.id)}>Abrir ficha</button>
              </article>
            );
          })}
          <button className="add-card" onClick={onCreate}>+ Novo slot</button>
        </div>
      </main>
    </div>
  );
}

function Creator({ draft, setDraft, onSave, onCancel }) {
  const [step, setStep] = useState(0);
  const occupation = occupations[draft.occupation];
  const selectedArchetype = archetypes[draft.archetype];
  const selectedSkill = getSkillByName(draft.occupation, draft.skill);
  const levelOneSkills = getLevelOneSkills(draft.occupation);
  const availablePoints = 6 - Object.values(draft.subattributes).reduce((sum, value) => sum + value, 0);
  const maxBp = calculateBp(draft);
  const maxCe = getEnergyByLevel(draft.nivel);
  const availableTalentCount = getAvailableTalentCount(draft.nivel);

  useEffect(() => {
    setDraft((previous) => {
      const validSkills = getLevelOneSkills(previous.occupation);
      const fallbackSkill = validSkills[0];
      const alreadySelected = validSkills.find((item) => item.name === previous.skill) || fallbackSkill;
      return {
        ...previous,
        skill: alreadySelected.name,
        selectedMod: previous.selectedMod || alreadySelected.modName || '',
        selectedModDescription: previous.selectedModDescription || alreadySelected.modDescription || '',
        currentBp: Math.min(previous.currentBp || maxBp, calculateBp(previous)),
        currentCe: Math.min(previous.currentCe || getEnergyByLevel(previous.nivel), getEnergyByLevel(previous.nivel)),
      };
    });
  }, [draft.occupation, setDraft, maxBp]);

  const updateDraft = (path, value) => {
    setDraft((previous) => {
      if (path === 'attributes') {
        return { ...previous, attributes: value };
      }
      if (path.startsWith('attributes.')) {
        const key = path.split('.')[1];
        return { ...previous, attributes: { ...previous.attributes, [key]: value } };
      }
      if (path.startsWith('subattributes.')) {
        const key = path.split('.')[1];
        return { ...previous, subattributes: { ...previous.subattributes, [key]: value } };
      }
      return { ...previous, [path]: value };
    });
  };

  const toggleTalent = (talent) => {
    setDraft((previous) => {
      const exists = previous.talents.includes(talent);
      if (exists) {
        return { ...previous, talents: previous.talents.filter((item) => item !== talent) };
      }
      if (previous.talents.length >= availableTalentCount) return previous;
      return { ...previous, talents: [...previous.talents, talent] };
    });
  };

  const updateSubattribute = (key, value) => {
    const numericValue = clamp(Number(value) || 0, 0, 2);
    const others = Object.entries(draft.subattributes)
      .filter(([current]) => current !== key)
      .reduce((sum, [, currentValue]) => sum + currentValue, 0);
    const limitedValue = clamp(numericValue, 0, Math.max(0, 6 - others));
    updateDraft(`subattributes.${key}`, limitedValue);
  };

  const chooseSkill = (skill) => {
    updateDraft('skill', skill.name);
    updateDraft('selectedMod', skill.modName || '');
    updateDraft('selectedModDescription', skill.modDescription || '');
  };

  return (
    <div className="page creator-page card">
      <div className="creator-header">
        <div>
          <h1>Criação de personagem: Colônia</h1>
          <p>Este fluxo sempre monta um protagonista de nível 1.</p>
        </div>
        <div className="stepper">
          {steps.map((label, index) => (
            <button key={label} className={index === step ? 'step active' : 'step'} onClick={() => setStep(index)}>{label}</button>
          ))}
        </div>
      </div>

      {step === 0 && (
        <section className="wizard-section">
          <h2>Passo 1: Base inicial</h2>
          <div className="rule-box">
            <p><strong>Nível inicial fixo:</strong> 1</p>
            <p>O criador monta apenas a ficha base. A progressão dos níveis fica registrada separadamente dentro da ficha do personagem.</p>
          </div>
          <div className="summary-panel compact-grid">
            <div><small>Nível</small><strong>1</strong></div>
            <div><small>Talentos</small><strong>3</strong></div>
            <div><small>Habilidade</small><strong>1</strong></div>
            <div><small>Mod</small><strong>1</strong></div>
          </div>
          <div className="rule-box">
            <strong>Base de criação</strong>
            {progressionByLevel.map((entry) => (
              <p key={entry.level}><strong>Nível {entry.level}:</strong> {entry.gains}</p>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="wizard-section">
          <h2>Passo 2: Arquétipo</h2>
          <div className="selection-grid">
            {Object.entries(archetypes).map(([name, info]) => (
              <button key={name} className={draft.archetype === name ? 'selection-card active' : 'selection-card'} onClick={() => updateDraft('archetype', name)}>
                <h3>{name}</h3>
                <p>{info.description}</p>
              </button>
            ))}
          </div>
          <div className="rule-box">
            <strong>Habilidade de arquétipo:</strong> {selectedArchetype.power}
          </div>
          <h3>Talentos ({draft.talents.length}/{availableTalentCount})</h3>
          <div className="pill-list">
            {selectedArchetype.talents.map((talent) => (
              <button key={talent} className={draft.talents.includes(talent) ? 'pill active' : 'pill'} onClick={() => toggleTalent(talent)}>{talent}</button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="wizard-section">
          <h2>Passo 3: Ocupação</h2>
          <div className="selection-grid">
            {Object.entries(occupations).map(([name, info]) => (
              <button key={name} className={draft.occupation === name ? 'selection-card active' : 'selection-card'} onClick={() => updateDraft('occupation', name)}>
                <h3>{name}</h3>
                <p>{info.description}</p>
              </button>
            ))}
          </div>
          <div className="split-boxes">
            <div className="rule-box">
              <strong>Descrição da ocupação</strong>
              <p>{occupation.description}</p>
            </div>
            <div className="rule-box"><strong>Itens iniciais</strong><ul>{occupation.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
            <div className="rule-box full-span"><strong>Contatos iniciais</strong><ul>{occupation.contacts.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>

          <h3>Escolha a habilidade inicial</h3>
          <div className="selection-grid skill-grid">
            {levelOneSkills.map((skill) => (
              <button key={skill.name} className={draft.skill === skill.name ? 'selection-card active' : 'selection-card'} onClick={() => chooseSkill(skill)}>
                <h3>{skill.name}</h3>
                <p><strong>Nível {skill.level}</strong> • {skill.type}</p>
                <p>{skill.description}</p>
              </button>
            ))}
          </div>

          {selectedSkill && (
            <div className="rule-box">
              <strong>Habilidade escolhida:</strong> {selectedSkill.name}
              <p>{selectedSkill.description}</p>
            </div>
          )}
        </section>
      )}

      {step === 3 && (
        <section className="wizard-section">
          <h2>Passo 4: Mod inicial</h2>
          {selectedSkill ? (
            <>
              <div className="rule-box">
                <p>O nível 1 concede <strong>1 Mod de Habilidade</strong>. Ele será aplicado na habilidade inicial escolhida.</p>
                <p><strong>Habilidade:</strong> {selectedSkill.name}</p>
                <p><strong>Mod:</strong> {selectedSkill.modName}</p>
                <p>{selectedSkill.modDescription}</p>
              </div>
              <button className="selection-card active mod-card" type="button" onClick={() => {
                updateDraft('selectedMod', selectedSkill.modName || '');
                updateDraft('selectedModDescription', selectedSkill.modDescription || '');
              }}>
                <h3>{selectedSkill.modName}</h3>
                <p>{selectedSkill.modDescription}</p>
              </button>
            </>
          ) : (
            <div className="rule-box">Escolha uma ocupação e uma habilidade inicial antes de selecionar o Mod.</div>
          )}
        </section>
      )}

      {step === 4 && (
        <section className="wizard-section">
          <h2>Passo 5: Recursos e Itens</h2>
          <label className="field-label">Itens — um por linha</label>
          <textarea className="text-area" value={draft.items.join('\n')} onChange={(e) => updateDraft('items', linesToArray(e.target.value))} placeholder={'Ex.:\nPistola adaptada\nKit de hacking básico\nChave inglesa vermelha'} />
          <label className="field-label">Contatos — um por linha</label>
          <textarea className="text-area" value={draft.contacts.join('\n')} onChange={(e) => updateDraft('contacts', linesToArray(e.target.value))} placeholder={'Ex.:\nMarta, médica de rua\nJoão do ferro-velho\nNina, informante do porto'} />
          <div className="split-boxes">
            <div className="rule-box"><strong>Tipos de contato</strong>{Object.entries(contactTypes).map(([name, items]) => <p key={name}><strong>{name}:</strong> {items.join(', ')}</p>)}</div>
            <div className="rule-box"><strong>Relação</strong>{Object.entries(relationCosts).map(([name, cost]) => <p key={name}><strong>{name}:</strong> {cost}</p>)}</div>
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="wizard-section">
          <h2>Passo 6: Atributos</h2>
          <div className="preset-row">
            {ATTRIBUTE_PRESETS.map((preset) => (
              <button key={preset.label} className="ghost-btn" onClick={() => updateDraft('attributes', preset.values)}>
                Usar {preset.label}
              </button>
            ))}
          </div>
          <div className="rule-box">
            <p>Como a criação é sempre de nível 1, cada subatributo pode começar no máximo em <strong>2</strong>, totalizando <strong>6 pontos</strong>.</p>
          </div>
          <div className="attribute-grid triple-grid">
            <div className="rule-box"><strong>Físico</strong><input className="text-input" type="number" min="1" max="5" value={draft.attributes.fisico} onChange={(e) => updateDraft('attributes.fisico', clamp(Number(e.target.value) || 1, 1, 5))} /></div>
            <div className="rule-box"><strong>Esperteza</strong><input className="text-input" type="number" min="1" max="5" value={draft.attributes.esperteza} onChange={(e) => updateDraft('attributes.esperteza', clamp(Number(e.target.value) || 1, 1, 5))} /></div>
            <div className="rule-box"><strong>Sagacidade</strong><input className="text-input" type="number" min="1" max="5" value={draft.attributes.sagacidade} onChange={(e) => updateDraft('attributes.sagacidade', clamp(Number(e.target.value) || 1, 1, 5))} /></div>
          </div>
          <div className="subattribute-grid">
            {Object.entries(SUBATTRIBUTE_LABELS).map(([key, label]) => (
              <label key={key} className="subattribute-card">
                <span>{label}</span>
                <input className="text-input" type="number" min="0" max="2" value={draft.subattributes[key]} onChange={(e) => updateSubattribute(key, e.target.value)} />
              </label>
            ))}
          </div>
          <div className="remaining-points">Pontos restantes: <strong>{availablePoints}</strong></div>
        </section>
      )}

      {step === 6 && (
        <section className="wizard-section">
          <h2>Passo 7: Detalhes finais</h2>
          <div className="detail-grid">
            <label><span>Nome</span><input className="text-input" value={draft.nome} onChange={(e) => updateDraft('nome', e.target.value)} /></label>
            <label><span>XP</span><input className="text-input" type="number" value={draft.xp} onChange={(e) => updateDraft('xp', Number(e.target.value) || 0)} /></label>
            <label className="full"><span>Conceito</span><textarea className="text-area" value={draft.conceito} onChange={(e) => updateDraft('conceito', e.target.value)} /></label>
            <label className="full"><span>Anotações</span><textarea className="text-area" value={draft.notes} onChange={(e) => updateDraft('notes', e.target.value)} /></label>
          </div>
          <div className="summary-panel">
            <div><small>BP máximos</small><strong>{maxBp}</strong></div>
            <div><small>CE máximas</small><strong>{maxCe}</strong></div>
            <div><small>Defesa base</small><strong>{draft.attributes.fisico}</strong></div>
            <div><small>Esforços</small><strong>2</strong></div>
          </div>
        </section>
      )}

      <div className="wizard-actions">
        <button className="ghost-btn" onClick={() => step === 0 ? onCancel() : setStep((current) => current - 1)}>{step === 0 ? 'Cancelar' : 'Anterior'}</button>
        {step < steps.length - 1 ? (
          <button className="primary-btn" onClick={() => setStep((current) => current + 1)}>Próximo passo</button>
        ) : (
          <button className="primary-btn" onClick={onSave}>Salvar ficha</button>
        )}
      </div>
    </div>
  );
}

function Sheet({ character, setCharacter, onNavigate }) {
  const maxBp = calculateBp(character);
  const maxCe = getEnergyByLevel(character.nivel);
  const selectedSkill = getSkillByName(character.occupation, character.skill);

  const update = (updater) => setCharacter((previous) => buildCharacter({ ...previous, ...updater(previous) }));

  return (
    <div className="page sheet-page">
      <div className="sheet-main">
        <div className="sheet-banner card">
          <div>
            <span>Nome</span>
            <h1>{character.nome}</h1>
          </div>
          <div>
            <span>Arquétipo</span>
            <h2>{character.archetype}</h2>
          </div>
          <div className="sheet-levels">
            <div><span>Nível</span><strong>{String(character.nivel).padStart(2, '0')}</strong></div>
            <div><span>XP</span><strong>{character.xp}</strong></div>
          </div>
        </div>

        <div className="sheet-grid">
          <section className="card">
            <h3>Atributos</h3>
            {[
              ['Físico', character.attributes.fisico, ['Potência', character.subattributes.potencia], ['Agilidade', character.subattributes.agilidade], ['Vigor', character.subattributes.vigor]],
              ['Esperteza', character.attributes.esperteza, ['Informações', character.subattributes.informacoes], ['Tecnologia', character.subattributes.tecnologia], ['Técnica', character.subattributes.tecnica]],
              ['Sagacidade', character.attributes.sagacidade, ['Percepção', character.subattributes.percepcao], ['Lábia', character.subattributes.labia], ['Intuição', character.subattributes.intuicao]],
            ].map(([name, total, ...subs]) => (
              <div key={name} className="attribute-box">
                <div className="attribute-title"><strong>{name}</strong><span>{total}</span></div>
                {subs.map(([subName, value]) => <p key={subName}>{subName}<span>+{value}</span></p>)}
              </div>
            ))}
          </section>

          <section className="card">
            <h3>Talentos e habilidades</h3>
            <div className="note-box">
              <strong>Ocupação: {character.occupation}</strong>
              <p><strong>Descrição:</strong> {occupations[character.occupation].description}</p>
              <p><strong>Habilidade inicial:</strong> {character.skill}</p>
              <p>{selectedSkill?.description}</p>
              <p><strong>Mod escolhido:</strong> {character.selectedMod}</p>
              <p>{character.selectedModDescription}</p>
            </div>
            {character.talents.map((talent) => <div key={talent} className="skill-row"><strong>{talent}</strong><span>Talento</span></div>)}
            <div className="skill-row"><strong>{archetypes[character.archetype].power}</strong><span>Arquétipo</span></div>
          </section>

          <section className="card">
            <h3>Recursos</h3>
            <div className="resource-boxes">
              <div className="resource-box"><small>Bio Pontos</small><strong>{character.currentBp}/{maxBp}</strong><div className="mini-controls"><button onClick={() => update((prev) => ({ currentBp: clamp(prev.currentBp - 1, 0, maxBp) }))}>-</button><button onClick={() => update((prev) => ({ currentBp: clamp(prev.currentBp + 1, 0, maxBp) }))}>+</button></div></div>
              <div className="resource-box"><small>Energia</small><strong>{character.currentCe}/{maxCe}</strong><div className="mini-controls"><button onClick={() => update((prev) => ({ currentCe: clamp(prev.currentCe - 1, 0, maxCe) }))}>-</button><button onClick={() => update((prev) => ({ currentCe: clamp(prev.currentCe + 1, 0, maxCe) }))}>+</button></div></div>
            </div>
            <div className="inventory-box">
              <h4>Inventário</h4>
              {character.items.length ? character.items.map((item) => <p key={item}>{item}</p>) : <p>Sem itens cadastrados.</p>}
            </div>
          </section>
        </div>

        <section className="contacts-panel card">
          <h3>Progressão por nível</h3>
          <div className="progress-list">
            {progressionByLevel.map((entry) => (
              <div key={entry.level} className={entry.level === character.nivel ? 'progress-row active' : 'progress-row'}>
                <strong>Nível {entry.level}</strong>
                <p>{entry.gains}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="contacts-panel card">
          <h3>Contatos e notas</h3>
          <div className="contact-list">
            {character.contacts.length ? character.contacts.map((contact) => <span key={contact} className="contact-chip">{contact}</span>) : <span className="contact-chip">Sem contatos definidos</span>}
          </div>
          <p className="notes-text">{character.notes || 'Sem anotações adicionais.'}</p>
        </section>
      </div>

      <aside className="dice-rail card">
        {['D4', 'D6', 'D8', 'D10', 'D12', 'D20'].map((die) => <button key={die} className="die-btn" onClick={() => onNavigate('dice')}>{die}</button>)}
        <div className="last-roll-box">
          <small>Pool de Gambiarra</small>
          <strong>{character.gambiarraPool}</strong>
        </div>
      </aside>
    </div>
  );
}

function DicePage({ history, setHistory }) {
  const [expression, setExpression] = useState('4d6');
  const [result, setResult] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = async () => {
    setIsRolling(true);
    try {
      const rolled = await api.rollDice(expression);
      setResult(rolled);
      setHistory((previous) => [rolled, ...previous.filter((item) => item.id !== rolled.id)].slice(0, 8));
    } catch (error) {
      setResult({ error: error.message });
    } finally {
      setIsRolling(false);
    }
  };

  const clearHistory = async () => {
    try {
      await api.clearRolls();
      setHistory([]);
    } catch (error) {
      setResult({ error: error.message });
    }
  };

  return (
    <div className="page dice-page">
      <div className="dice-shell">
        <section className="dice-left card">
          <h2>Reservatório</h2>
          <button className="primary-btn wide" onClick={() => setExpression((value) => `${value}+1`)}>+ Adicionar modificador</button>
          <label className="field-label">Rolagem customizada</label>
          <div className="inline-roll">
            <input className="text-input" value={expression} onChange={(e) => setExpression(e.target.value)} />
            <button className="ghost-btn" onClick={handleRoll} disabled={isRolling}>{isRolling ? '...' : 'ROLL'}</button>
          </div>
          <div className="rule-box"><strong>Dica:</strong> use sempre Xd6+Y. Em Colônia, sucessos normais são resultados 4, 5 ou 6.</div>
        </section>

        <section className="dice-right card">
          <h2>Resultado do lançamento</h2>
          <div className="result-screen">
            {result?.error ? result.error : result ? `[ ${result.dice.join(', ')} ]` : 'Aguardando rolagem...' }
          </div>
          <div className="result-stats">
            <div><small>Sucessos</small><strong>{result?.successes ?? 0}</strong></div>
            <div><small>Desastres</small><strong>{result?.disasters ?? 0}</strong></div>
            <div><small>Total</small><strong>{result?.total ?? 0}</strong></div>
          </div>
        </section>
      </div>

      <section className="card history-card">
        <div className="history-head"><h3>Histórico recente</h3><button className="ghost-btn" onClick={clearHistory}>Limpar histórico</button></div>
        {history.length === 0 ? <p>Nenhuma rolagem ainda.</p> : history.map((item, index) => (
          <div key={item.id} className="history-row">
            <span>#{String(index + 1).padStart(3, '0')}</span>
            <strong>{item.expression}</strong>
            <span>[ {item.dice.join(', ')} ]</span>
            <span className={item.successes > 0 ? 'success-tag' : 'fail-tag'}>{item.successes > 0 ? 'sucessos' : 'sem sucessos'}</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function App() {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState('landing');
  const [activeId, setActiveId] = useState(null);
  const [draft, setDraft] = useState(buildCharacter(emptyCharacter()));
  const [history, setHistory] = useState([]);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const [savedCharacters, savedRolls] = await Promise.all([
          api.getCharacters(),
          api.getRolls(),
        ]);
        setCharacters(savedCharacters || []);
        setHistory(savedRolls || []);
        if (savedCharacters?.length) {
          setActiveId(savedCharacters[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsBooting(false);
      }
    }

    bootstrap();
  }, []);

  const activeCharacter = useMemo(() => characters.find((item) => item.id === activeId) || null, [characters, activeId]);

  const handleCreate = () => {
    const defaultSkill = getLevelOneSkills('Guerrilheiro')[0];
    const base = buildCharacter({
      ...emptyCharacter(),
      nivel: 1,
      occupation: 'Guerrilheiro',
      items: occupations.Guerrilheiro.items,
      contacts: occupations.Guerrilheiro.contacts,
      skill: defaultSkill.name,
      selectedMod: defaultSkill.modName,
      selectedModDescription: defaultSkill.modDescription,
      talents: archetypes.Rebelde.talents.slice(0, 3),
    });
    setDraft(base);
    setCurrentPage('creator');
  };

  const handleSave = async () => {
    const completed = buildCharacter({
      ...draft,
      nivel: 1,
      items: draft.items.length ? draft.items : occupations[draft.occupation].items,
      contacts: draft.contacts.length ? draft.contacts : occupations[draft.occupation].contacts,
    });

    try {
      const exists = characters.some((item) => item.id === completed.id);
      const saved = exists ? await api.updateCharacter(completed) : await api.saveCharacter(completed);
      setCharacters((previous) => {
        if (exists) return previous.map((item) => item.id === saved.id ? saved : item);
        return [saved, ...previous];
      });
      setActiveId(saved.id);
      setCurrentPage('sheet');
    } catch (error) {
      console.error(error);
      window.alert(error.message);
    }
  };

  const setActiveCharacter = async (updater) => {
    const current = characters.find((item) => item.id === activeId);
    if (!current) return;

    const next = buildCharacter(typeof updater === 'function' ? updater(current) : updater);
    setCharacters((previous) => previous.map((item) => item.id === activeId ? next : item));

    try {
      await api.updateCharacter(next);
    } catch (error) {
      console.error(error);
    }
  };

  if (isBooting) {
    return <div className="app-shell"><div className="page"><div className="empty-state card"><h2>Carregando dados do servidor...</h2></div></div></div>;
  }

  return (
    <div className="app-shell">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} activeCharacter={activeCharacter} />
      {currentPage === 'landing' && <LandingPage onCreate={handleCreate} onNavigate={setCurrentPage} characterCount={characters.length} />}
      {currentPage === 'dashboard' && <Dashboard characters={characters} onOpen={(id) => { setActiveId(id); setCurrentPage('sheet'); }} onCreate={handleCreate} />}
      {currentPage === 'creator' && <Creator draft={draft} setDraft={setDraft} onSave={handleSave} onCancel={() => setCurrentPage('dashboard')} />}
      {currentPage === 'sheet' && activeCharacter && <Sheet character={activeCharacter} setCharacter={setActiveCharacter} onNavigate={setCurrentPage} />}
      {currentPage === 'sheet' && !activeCharacter && <div className="page"><div className="empty-state card"><h2>Nenhuma ficha selecionada</h2><button className="primary-btn" onClick={handleCreate}>Criar protagonista</button></div></div>}
      {currentPage === 'dice' && <DicePage history={history} setHistory={setHistory} />}
    </div>
  );
}
