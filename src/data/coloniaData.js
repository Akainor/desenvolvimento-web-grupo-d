export const archetypes = {
  Rebelde: {
    description: 'Quebra regras, provoca o sistema e cria caos quando necessário.',
    talents: ['Intenso', 'Encrenqueiro', 'Ousado', 'Intrigante', 'Desafiador', 'Baderneiro', 'Provocador', 'Confiante', 'Impulsivo', 'Obstinado'],
    power: 'Ao rolar um DG com valor 6, pode lançar mais um DG sem gastar da reserva.'
  },
  Expert: {
    description: 'Especialista lógico e estratégico, usa conhecimento para vencer.',
    talents: ['Lógico', 'Engenhoso', 'Estrategista', 'Nerd', 'Precavido', 'Detalhista', 'Racional', 'Focado', 'Calculista', 'Acadêmico'],
    power: 'Ao rolar um DG com valor 6, pode refazer a rolagem de um DG da mesma rolagem.'
  },
  Renegado: {
    description: 'Ex-integrante do sistema que agora luta contra ele.',
    talents: ['Resiliente', 'Justiceiro', 'Conspiracionista', 'Cauteloso', 'Cético', 'Revolto', 'Corajoso', 'Fugitivo', 'Desconfiado', 'Intimidador'],
    power: 'Ao rolar um DG com valor 6, recupera 1 CE.'
  },
  Ativista: {
    description: 'Fortalece a comunidade e protege o povo.',
    talents: ['Comunicativo', 'Coordenador', 'Empático', 'Tenaz', 'Líder', 'Atencioso', 'Leal', 'Empenhado', 'Companheiro', 'Cativante'],
    power: 'Ao rolar um DG com valor 6, adiciona 1 DG à reserva.'
  },
  Malandro: {
    description: 'Astuto, furtivo e sempre com um truque na manga.',
    talents: ['Oportunista', 'Perspicaz', 'Ligeiro', 'Preciso', 'Adaptável', 'Atento', 'Persuasivo', 'Furtivo', 'Enganador', 'Ardiloso'],
    power: 'Ao rolar um DG com valor 6, recupera o uso de um Talento.'
  },
  Expressivo: {
    description: 'Se conecta com os outros por arte, ofício e presença.',
    talents: ['Espirituoso', 'Performático', 'Inovador', 'Estudioso', 'Criativo', 'Eloquente', 'Inspirador', 'Talentoso', 'Sonhador', 'Culto'],
    power: 'Ao rolar um DG com valor 6, um outro protagonista recupera 1 CE.'
  }
};

const skill = (name, level, type, description, modName, modDescription) => ({
  name,
  level,
  type,
  description,
  modName,
  modDescription,
});

export const occupations = {
  Benzedeiro: {
    description: 'Mistura biomedicina caseira, cura improvisada e conhecimentos herbalistas para salvar aliados nas piores emergências.',
    items: ['Equipamento Biotecnológico', 'Mais um equipamento à escolha ou Proteção Média'],
    contacts: ['Científico ou Social'],
    skills: [
      skill('Tratar Ferido', 1, 'Ativa', 'Gaste 2 CE, escolha um protagonista ao seu lado e faça um teste de Técnica. Cada sucesso recupera 1 BP do alvo.', 'Seringa Biotec', 'O alvo recupera 1 BP e também o uso de um Talento.'),
      skill('Socorrista Protetor', 1, 'Passiva', 'Ao ver outro protagonista perder BP, gaste 1 CE para se mover até ele imediatamente. O alvo recebe +1 de Defesa até o fim do turno.', 'Choque no Peito', 'Seu aliado recebe Vantagem no próximo teste de Vigor.'),
      skill('Cibermedicina', 2, 'Passiva', 'Quando gastar o uso de um Equipamento Biotecnológico, escolha um protagonista para recuperar 1 CE ou 2 BP.'),
      skill('Assistência de Maca', 2, 'Desperta', 'Gaste 2 CE para fazer um aliado recuperar BP ou CE por completo, independente do tipo de descanso.'),
      skill('Mecanizar Carne', 3, 'Ativa', 'Gaste 2 CE para conceder um Mod de Talento a um protagonista até o fim da cena.'),
      skill('Restaurar Ferida', 3, 'Ativa', 'Gaste 1 CE ou o uso de um Equipamento Biotecnológico para evitar Cicatrizes no turno e remover Sobrecarga de um aliado.'),
    ],
  },
  Ciborgue: {
    description: 'Fundiu carne com próteses e implantes, transformando o próprio corpo em ferramenta de sobrevivência e combate.',
    items: ['Arma de Fogo', 'Arma de Briga', 'Proteção Média'],
    contacts: ['Militar ou Científico'],
    skills: [
      skill('Corpo Robótico', 1, 'Passiva', 'Ao fazer teste de Tecnologia ou Técnica, você pode gastar 1 CE para usar Físico como atributo base. Sempre que um DG tirar 6, recupere 1 BP.', 'Coração Biotec', 'Você pode adicionar até 2 DG ao teste sem gastar da Reserva.'),
      skill('Guerreiro Cibernético', 1, 'Passiva', 'Uma vez por turno, ao causar dano em um alvo, você recupera 1 CE e adiciona 1 DG à Reserva.', 'Golpe Virtual', 'Você pode realizar a ação de Sabotar sem gastar Esforço no alvo atacado.'),
      skill('Amplificar Poder', 2, 'Ativa', 'Gaste 2 CE para atacar e adicionar DG iguais ao seu Físico sem gastar da Reserva.'),
      skill('Fábrica Biomecânica', 2, 'Desperta', 'Gaste 1 CE para adicionar DG à Reserva iguais a Físico + Vigor ou Potência.'),
      skill('Quebra-Galho Ambulante', 3, 'Passiva', 'Gaste 2 BP para ativar um Mod, adicionar 1 DG ou recuperar o uso de um Equipamento.'),
      skill('Tunar Chassi', 3, 'Ativa', 'Gaste 2 CE para receber um Mod de Talento e um Mod de Proteção até o fim da cena.'),
    ],
  },
  Esportista: {
    description: 'Vive pela adrenalina das arenas e transforma preparo físico em vantagem constante durante a cena.',
    items: ['Arma de Briga', 'Proteção Média'],
    contacts: ['Elitista ou Social'],
    skills: [
      skill('Pique de Atleta', 1, 'Passiva', 'No primeiro teste de Físico da cena, escolha um subatributo. Pelo resto da cena, você pode gastar 1 CE para receber +1 em testes desse subatributo.', 'Tralha de Atleta', 'Adicione à Reserva DG iguais à metade do resultado do teste.'),
      skill('Espírito Competitivo', 1, 'Passiva', 'Ao ver outro protagonista realizando um teste, gaste 1 CE para receber +1 no próximo teste do mesmo subatributo.', 'Nano Estimulante', 'Você recebe Vantagem no próximo teste desse mesmo subatributo e recupera o uso de um Talento.'),
      skill('De Hoje Tá Pago', 2, 'Desperta', 'Gaste 2 CE e escolha um subatributo de Físico; até descansar, você pode adicionar até 2 Talentos nesses testes.'),
      skill('Jogo Acelerado', 2, 'Passiva', 'Ao Correr ou Recuperar o Fôlego, você ou um aliado recebem +1 no próximo teste de Físico; você também tem Vantagem em Iniciativa.'),
      skill('Trombar na Massa', 3, 'Ativa', 'Gaste 2 CE para Golpear com Vantagem e causar dano igual à sua Potência, reduzido pela Defesa do alvo.'),
      skill('Incentivar Equipe', 3, 'Ativa', 'Gaste 2 CE para dar a um aliado um Esforço adicional na próxima rodada.'),
    ],
  },
  Guerrilheiro: {
    description: 'Linha de frente da resistência: protege aliados, segura pressão e revida quando a situação aperta.',
    items: ['Arma de Fogo', 'Arma de Briga', 'Proteção Média'],
    contacts: ['Militar ou Criminoso'],
    skills: [
      skill('Linha de Frente', 1, 'Passiva', 'Aliados ao seu lado recebem +1 de Defesa. Além disso, você pode gastar 1 CE para usar Físico como atributo base em Intuição ou Percepção.', 'Motor Muscular', 'Ao testar Intuição ou Percepção, adicione DG iguais ao seu Físico sem gastar da Reserva.'),
      skill('Acertar na Mosca', 1, 'Ativa', 'Gaste 1 CE para fazer um ataque à distância ignorando desvantagens por cobertura, alcance ruim ou disparo ao lado do alvo.', 'Cano Cromado', 'Você recebe Vantagem no ataque e o alvo não pode ativar Habilidades de Defesa.'),
      skill('Coordenar Tática', 2, 'Ativa', 'Gaste 2 CE para um aliado realizar imediatamente uma ação de Ataque com Vantagem.'),
      skill('Trocação Pesada', 2, 'Passiva', 'Se sofrer dano menor que seu Físico, gaste 2 CE para contra-atacar imediatamente.'),
      skill('Periféricos Bélicos', 3, 'Desperta', 'Gaste 2 CE para fazer uma Arma ou Proteção sua receber um Mod até o fim da próxima cena de combate.'),
      skill('Líder de Tropa', 3, 'Passiva', 'Quando outro protagonista fizer teste de Físico ou Sagacidade, gaste 2 CE para permitir rerrolar dados até seu valor no atributo.'),
    ],
  },
  Informista: {
    description: 'Especialista em pistas, reconhecimento e leitura de alvos; transforma informação em vantagem antes do confronto.',
    items: ['Arma Pequena', 'Proteção Leve', 'Equipamento Investigativo'],
    contacts: ['2 contatos à escolha'],
    skills: [
      skill('Olhos de Onça', 1, 'Passiva', 'Ao testar Informações ou Percepção, gaste 1 CE para receber +1 no teste. Você também é imune à Desvantagem em testes de Percepção.', 'Identificador Criminal', 'Você recebe Vantagem no teste e recupera o uso de um Equipamento Investigativo.'),
      skill('Biometria Visual', 1, 'Ativa', 'Ao olhar o rosto de alguém, gaste 1 CE para obter automaticamente dados básicos sobre o alvo: nome, idade, profissão, família, contato, endereço e notícias.', 'Scanner Social', 'Você também descobre a relação do alvo com facções, corporações ou contatos relevantes.'),
      skill('Instinto Aguçado', 2, 'Passiva', 'Foca em leitura rápida de ambientes e pessoas, ajudando em investigações e emboscadas.'),
      skill('Vendedor de Informações', 2, 'Ativa', 'Converte suas pistas em vantagens sociais, favores e negociação.'),
      skill('Lista de Contatinhos', 3, 'Passiva', 'Amplia a rede de contatos e melhora acionamento de favores.'),
      skill('Revelar Segredo', 3, 'Ativa', 'Expõe informações perigosas para quebrar a resistência de um alvo.'),
    ],
  },
  Saqueador: {
    description: 'Planeja invasões, manipula ameaças e aproveita qualquer brecha para sair com lucro e vantagem.',
    items: ['R$ 10 adicionais', 'Proteção Leve', 'Arma Pequena', 'Um equipamento à escolha'],
    contacts: ['Criminoso, Militar ou Elitista'],
    skills: [
      skill('Orquestrar Plano', 1, 'Passiva', 'Antes da ação, você organiza a abordagem e ganha vantagem tática para o grupo.', 'Plano de Fuga', 'A ação planejada também gera reposicionamento ou cobertura imediata.'),
      skill('Invasor Estratégico', 1, 'Passiva', 'Você sabe entrar, sair e improvisar rotas em ambientes hostis.', 'Ferramenta de Arrombamento', 'Além do bônus principal, recupere o uso de um equipamento útil na invasão.'),
      skill('Instinto Malicioso', 2, 'Passiva', 'Você recebe bônus ao ler oportunidades, blefes e riscos.'),
      skill('Ameaçar Pescoço', 2, 'Ativa', 'Gaste 2 CE para Ameaçar um alvo; se ele resistir, você pode atacar sem gastar Esforço.'),
      skill('Golpe Sujo', 3, 'Passiva', 'Permite Golpear usando Esperteza ou Sagacidade, além de ignorar desvantagens específicas.'),
      skill('Sacar Truque', 3, 'Ativa', 'Gaste 1 CE para dar um Mod temporário a Equipamento, Arma, Proteção ou Veículo.'),
    ],
  },
  Saltimbanco: {
    description: 'Artista de rua, performer e agitador cultural que inspira aliados e transforma presença em recurso real.',
    items: ['R$ 10 adicionais', 'Equipamento Artístico', 'Outro equipamento à escolha'],
    contacts: ['2 contatos à escolha'],
    skills: [
      skill('Mandar o Repente', 1, 'Ativa', 'Gaste 2 CE e escolha protagonistas iguais ao seu valor de Lábia. Os escolhidos recuperam 2 Talentos.', 'Caixinha Estourada', 'Os protagonistas escolhidos recebem Vantagem no próximo teste.'),
      skill('Manha na Prática', 1, 'Passiva', 'Ao testar Técnica ou Agilidade que não seja Ataque, gaste 1 CE para usar Sagacidade como atributo base.', 'Peça de Improviso', 'Adicione à Reserva uma quantidade de DG igual ao seu valor de Sagacidade.'),
      skill('Instrumento de Show', 2, 'Passiva', 'Na primeira vez em que gastar o uso de um Equipamento Artístico na cena, todos os protagonistas recuperam 2 CE.'),
      skill('Apresentando a Arte', 2, 'Desperta', 'Em descanso parcial, faça teste de Técnica ou Lábia para gerar DG e recuperação extra de CE.'),
      skill('Famosinho do Baile', 3, 'Passiva', 'Gaste 1 CE para explorar sua fama e melhorar interações com um alvo.'),
      skill('Aptidão Grafiteira', 3, 'Passiva', 'Usa Equipamento Artístico para fortalecer contatos e conceder vantagem a próximos testes.'),
    ],
  },
  Sucateiro: {
    description: 'Constrói, desmonta e reconfigura bugigangas até tirar delas efeitos absurdos e úteis.',
    items: ['Arma de Fogo Pequena', 'Proteção Leve', 'Equipamento Mecânico', 'Deslizador ou Drone'],
    contacts: ['Científico ou Criminoso'],
    skills: [
      skill('Manipular Engrenagens', 1, 'Ativa', 'Gaste 2 CE para mudar o tipo de um Equipamento. Sempre que gastar uso de um Equipamento, seu grupo recebe 3 DG.', 'Sucata Completa', 'O equipamento alterado recarrega todos os seus usos.'),
      skill('Estoque de Lata', 1, 'Desperta', 'Em descanso parcial, restaure todos os usos de até 2 equipamentos. Ao trocar de cena, seu grupo recebe 1 DG.', 'Lata Caprichada', 'Cada protagonista também recupera um uso de um equipamento à escolha.'),
      skill('Velocista Radical', 2, 'Passiva', 'Receba um Deslizador ou Moto Comum com Mod; em testes de Agilidade para pilotar, gaste 1 CE para rerrolar dados.'),
      skill('Inventor de Quintal', 2, 'Desperta', 'Gaste 2 CE em descanso parcial para produzir Equipamento, Arma de Fogo ou Proteção temporária.'),
      skill('Improvisar Treco', 3, 'Ativa', 'Gaste 2 CE e teste Técnica para instalar Mods temporários em Armas, Proteções ou Equipamentos.'),
      skill('Parça Robótico', 3, 'Passiva', 'Receba um Drone e use Equipamento Mecânico para reforçar testes e funções dele.'),
    ],
  },
  Tecnopata: {
    description: 'Manipula máquinas pela própria mente e trata tecnologia como extensão direta da sua consciência.',
    items: ['Arma de Fogo Pequena', 'Equipamento Mecânico ou Hacking', 'Drone ou Proteção Média'],
    contacts: ['Militar ou Científico'],
    skills: [
      skill('Zumbido Iara', 1, 'Ativa', 'Você emite uma interferência tecnológica agressiva para atrapalhar máquinas e sistemas próximos.', 'Capacete Iarador', 'A interferência fica mais forte e gera mais pressão eletrônica sobre o alvo.'),
      skill('Manipulação Metálica', 1, 'Passiva', 'Você move, trava ou reposiciona tecnologia e estruturas metálicas com controle mental limitado.', 'Condutor Neural', 'A ação recebe alcance ou intensidade ampliada.'),
      skill('Tele Comunicar', 2, 'Passiva', 'Cria comunicação direta e silenciosa entre aliados e dispositivos.'),
      skill('Destruir Interface', 2, 'Ativa', 'Força pane ou ruptura em equipamentos conectados.'),
      skill('Maestro das Máquinas', 3, 'Passiva', 'Recebe controle muito mais refinado sobre sistemas e aparatos.'),
      skill('Dronagem Mental', 3, 'Passiva', 'Controla drones sem aparelho e ainda recupera CE ao gastar funções do drone.'),
    ],
  },
  Trapanet: {
    description: 'Pirata digital, sabotador e hacker de campo que transforma rede, dados e dispositivos em arma.',
    items: ['Equipamento Hacking', 'Drone ou Arma de Fogo Pequena'],
    contacts: ['Científico ou Criminoso'],
    skills: [
      skill('Cortar Sinal', 1, 'Ativa', 'Gaste 1 CE para Sabotar um alvo. Se der certo, defesas contra ataques dele são feitas com Vantagem até o fim do seu próximo turno.', 'Apagão Total', 'A Defesa do alvo é zerada para o próximo ataque que ele receber.'),
      skill('Facilitador Digital', 1, 'Passiva', 'Sempre que você gastar uso de um Equipamento Hacking ou Investigativo, todos os outros protagonistas recebem +1 no próximo teste.', 'Módulo Quebra-Muro', 'Os outros protagonistas recuperam 1 CE e recebem Vantagem no próximo teste.'),
      skill('Carregador Portátil', 2, 'Passiva', 'Ao trocar de cena, gaste 1 CE para recuperar o uso de um Equipamento Hacking.'),
      skill('Acelerar Sabotagem', 2, 'Ativa', 'Gaste 2 CE para Sabotar um alvo e ganhar um Esforço adicional no turno, se der certo.'),
      skill('Piloto Jogador', 3, 'Passiva', 'Ao usar Drone, gaste uso de Equipamento Hacking para ganhar Vantagem e recuperar função do Drone.'),
      skill('Camuflar Holograma', 3, 'Ativa', 'Gaste 2 CE para ficar indetectável a sensores e ainda ganhar Defesa contra Armas de Fogo.'),
    ],
  },
};

export const contactTypes = {
  Científico: ['Equipamento Hacking', 'Equipamento Biotecnológico', 'Equipamento Mecânico'],
  Criminoso: ['Equipamento Hacking', 'Veículo Comum', 'Arma de Fogo'],
  Elitista: ['Veículo Comum', 'Equipamento Investigativo', 'Equipamento Hacking'],
  Militar: ['Arma de Fogo', 'Proteção', 'Equipamento Biotecnológico'],
  Social: ['Equipamento Artístico', 'Equipamento Mecânico', 'Veículo Comum']
};

export const relationCosts = {
  Boa: '1 CE',
  Neutra: '2 CE',
  Ruim: '3 CE e não pode pedir recurso'
};

export const steps = ['Base', 'Arquétipo', 'Ocupação', 'Mod', 'Recursos', 'Atributos', 'Detalhes'];

export const progressionByLevel = [
  { level: 1, gains: 'Base inicial: 6 pontos de Subatributos, atributos 3/2/1 ou 2/2/2, 3 Talentos, 1 Habilidade e 1 Mod de Habilidade.' },
  { level: 2, gains: '+1 em 2 Subatributos diferentes, +1 em 1 Atributo, +1 Habilidade e +1 Mod.' },
  { level: 3, gains: '+1 em 2 Subatributos diferentes, +1 Talento, +1 Habilidade e +1 Mod.' },
  { level: 4, gains: '+1 em 2 Subatributos diferentes, +1 em 1 Atributo, +1 Habilidade, +1 Mod, novo Arquétipo e CE sobe para 12.' },
  { level: 5, gains: '+1 em 2 Subatributos diferentes, +1 Talento, +1 Habilidade e +1 Mod.' },
  { level: 6, gains: '+1 em 2 Subatributos diferentes, +1 em 1 Atributo, +1 Habilidade e +1 Mod.' },
];
