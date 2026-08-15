/*
 * welcome-pack-defaults.js
 * Estrutura partilhada dos Welcome Packs por serviço.
 * O layout continua no briefing.html; este ficheiro contém apenas conteúdo e normalização.
 */
(function (window) {
  'use strict';

  const SERVICE_TYPES = [
    'branding',
    'identidade-visual',
    'social-media',
    'design-publicitario',
    'design-eventos',
    'web-design',
    'materiais-graficos'
  ];

  const CONTACT = {
    email: 'pedromuindi5@gmail.com',
    url: 'www.lucasmuindi.vercel.app'
  };

  const SHARED = {
    page2: {
      eyebrow: 'BOAS-VINDAS',
      titleLine1: 'Obrigado por',
      titleEmphasis: 'confiares no processo.',
      noteLabel: 'NOTA / 01',
      noteText: 'Este documento é um guia breve para o início do nosso trabalho. As respostas completas do briefing ficam reservadas à análise interna do projeto.'
    },
    page3: {
      eyebrow: 'A PARTIR DE AGORA',
      titleLine1: 'O que acontece',
      titleEmphasis: 'agora.',
      intro: 'O processo começa por organizar a informação. Cada etapa cria espaço para decisões mais simples e um resultado mais consistente.'
    },
    page4: {
      eyebrow: 'UMA FORMA DE TRABALHAR',
      titleLine1: 'Clareza antes',
      titleEmphasis: 'da forma.',
      intro: 'O design torna-se mais forte quando existe uma intenção clara por trás de cada escolha. É isso que vamos construir em conjunto.',
      timeline: ['ENTENDER', 'DEFINIR', 'DESENVOLVER', 'ENTREGAR']
    },
    page5: {
      eyebrow: 'PARA AVANÇAR COM RITMO',
      titleLine1: 'O que precisamos',
      titleEmphasis: 'de ti.',
      intro: 'Já recebemos o primeiro passo. Ao longo do projeto, estes são os elementos que ajudam a tomar decisões mais rápidas e fiéis à tua realidade.',
      calloutLabel: 'IMPORTANTE',
      calloutTitle: 'Se ainda não tens tudo pronto, não há problema.',
      calloutText: 'Partilha o que já existe. O processo também serve para descobrir o que falta.'
    },
    page6: {
      eyebrow: 'PARA MANTER O PROJETO EM MOVIMENTO',
      titleLine1: 'Prazos claros.',
      titleEmphasis: 'Comunicação simples.',
      intro: 'O calendário final será confirmado depois da revisão do briefing e depende da dimensão, urgência e número de etapas do projeto.',
      contactLabel: 'CONTACTO DIRETO'
    },
    page7: {
      eyebrowPrefix: 'ATÉ JÁ,',
      closeHeadlineLine1: 'Vamos criar algo',
      closeHeadlineEmphasis: 'com sentido.',
      footerEmail: CONTACT.email,
      footerUrl: CONTACT.url
    },
    shared: {
      contactEmail: CONTACT.email,
      portfolioUrl: CONTACT.url
    }
  };

  const PRESETS = {
    branding: {
      title: 'Branding',
      welcome: 'Obrigado por confiares o posicionamento da tua marca a este processo. Vamos transformar a essência do negócio numa presença clara, reconhecível e consistente.',
      slogan: 'UMA MARCA FORTE COMEÇA COM UMA DIREÇÃO CLARA.',
      page3Intro: 'Vamos começar por compreender a marca, organizar a sua essência e transformar essa clareza num sistema visual com intenção.',
      steps: [
        ['Imersão', 'Leio o briefing e organizo a história, os objetivos e o posicionamento da marca.'],
        ['Direção', 'Traduzo a personalidade do negócio em caminhos visuais possíveis e bem fundamentados.'],
        ['Sistema', 'Desenvolvo os elementos que tornam a marca coerente em diferentes pontos de contacto.'],
        ['Entrega', 'Reúno os materiais finais e explico como usar a nova direção com consistência.']
      ],
      principles: [
        ['Essência', 'A marca precisa de dizer algo verdadeiro antes de procurar apenas parecer diferente.'],
        ['Coerência', 'Cada elemento deve fazer parte do mesmo sistema e reforçar a mesma percepção.'],
        ['Presença', 'O resultado deve funcionar tanto num detalhe como numa aplicação completa.']
      ],
      needs: [
        ['Contexto', 'História da marca, objetivos, público e referências do negócio.'],
        ['Materiais', 'Logótipo atual, textos, imagens, produtos e outros ficheiros existentes.'],
        ['Decisões', 'Preferências, limites e prioridades que ajudem a escolher a direção certa.'],
        ['Feedback', 'Comentários objetivos reunidos num único momento para cada apresentação.']
      ],
      closeText: 'A partir daqui, vamos dar forma àquilo que a tua marca quer dizer.'
    },
    'identidade-visual': {
      title: 'Identidade Visual',
      welcome: 'Obrigado por confiares a identidade visual do teu projeto a este processo. Vou transformar a tua visão numa linguagem visual simples, coerente e fácil de reconhecer.',
      slogan: 'UMA IDENTIDADE CLARA DÁ FORÇA A CADA PONTO DE CONTACTO.',
      page3Intro: 'A partir das tuas respostas, vamos construir uma direção visual que seja fácil de compreender, aplicar e reconhecer.',
      steps: [
        ['Revisão', 'Leio o briefing, organizo prioridades e identifico o que a identidade precisa de comunicar.'],
        ['Conceito', 'Apresento uma direção visual com escolhas explicadas e alinhadas com o projeto.'],
        ['Refinamento', 'Ajusto os elementos essenciais com base no teu feedback e nas decisões aprovadas.'],
        ['Entrega', 'Preparo os ficheiros finais para que possas usar a identidade com segurança.']
      ],
      principles: [
        ['Clareza', 'A identidade deve ser compreendida rapidamente por quem entra em contacto com ela.'],
        ['Personalidade', 'As escolhas visuais devem refletir o caráter do projeto e não apenas seguir tendências.'],
        ['Aplicação', 'O sistema deve funcionar em diferentes tamanhos, suportes e situações.']
      ],
      needs: [
        ['Logótipo', 'Versões existentes, ficheiros editáveis e aplicações onde a identidade já aparece.'],
        ['Referências', 'Imagens, marcas ou estilos que ajudam a explicar o que sentes que combina contigo.'],
        ['Conteúdo', 'Nome, assinatura, textos, imagens e informações que devam fazer parte do sistema.'],
        ['Feedback', 'Uma resposta clara sobre o que funciona, o que falta e o que deve ser ajustado.']
      ],
      closeText: 'Agora começa a transformação da tua visão numa identidade que pode crescer contigo.'
    },
    'social-media': {
      title: 'Social Media Design',
      welcome: 'Obrigado por confiares a comunicação visual das tuas redes a este processo. Vamos criar uma presença mais consistente, clara e preparada para comunicar com o teu público.',
      slogan: 'CADA PUBLICAÇÃO É UMA OPORTUNIDADE PARA SER RECONHECIDO.',
      page3Intro: 'Vamos organizar a mensagem, o ritmo e a aparência das tuas redes para que cada publicação faça parte da mesma presença.',
      steps: [
        ['Contexto', 'Analiso o briefing, o público e os objetivos da comunicação nas redes.'],
        ['Direção', 'Defino uma linha visual que possa ser reconhecida sem tornar a comunicação repetitiva.'],
        ['Conteúdo', 'Organizo formatos, textos e referências para orientar a criação das peças.'],
        ['Entrega', 'Preparo os materiais finais de forma simples para publicação e continuidade.']
      ],
      principles: [
        ['Reconhecimento', 'As peças devem ser percebidas como parte da mesma marca, mesmo quando o tema muda.'],
        ['Ritmo', 'Uma boa direção cria variedade dentro de um sistema visual fácil de manter.'],
        ['Ação', 'O design deve ajudar a mensagem a ser entendida e a provocar uma resposta.']
      ],
      needs: [
        ['Conteúdos', 'Textos, datas, temas, ofertas e informações que precisam de ser comunicados.'],
        ['Imagens', 'Fotografias, produtos, logótipo e referências que possam enriquecer as peças.'],
        ['Prioridades', 'Objetivos da campanha, público principal e ação que queres incentivar.'],
        ['Calendário', 'Disponibilidade para validar conteúdos e manter o projeto a avançar.']
      ],
      closeText: 'A partir daqui, vamos transformar informação em presença e presença em ligação.'
    },
    'design-publicitario': {
      title: 'Design Publicitário & Campanhas',
      welcome: 'Obrigado por confiares esta campanha a este processo. Vamos organizar a mensagem e criar uma peça que capte atenção sem perder clareza.',
      slogan: 'UMA BOA CAMPANHA DIZ O ESSENCIAL NO MOMENTO CERTO.',
      page3Intro: 'Começamos por clarificar a mensagem, o público e o objetivo para que o design tenha impacto e direção.',
      steps: [
        ['Briefing', 'Reúno a informação principal, o objetivo da campanha e a ação esperada.'],
        ['Mensagem', 'Organizo o conteúdo para que a ideia principal apareça com clareza.'],
        ['Criação', 'Desenvolvo a peça ou conjunto de peças com uma direção visual coerente.'],
        ['Preparação', 'Entrego os ficheiros adequados aos canais e formatos definidos.']
      ],
      principles: [
        ['Impacto', 'A primeira leitura deve captar atenção sem obrigar a pessoa a decifrar a mensagem.'],
        ['Foco', 'Cada peça precisa de uma ideia principal e de uma ação compreensível.'],
        ['Adequação', 'O formato e a linguagem devem responder ao público e ao contexto da campanha.']
      ],
      needs: [
        ['Mensagem', 'Texto final, oferta, chamada para ação e informação que não pode faltar.'],
        ['Formato', 'Medidas, plataforma, impressão ou aplicação onde a campanha será utilizada.'],
        ['Referências', 'Exemplos, imagens, produtos e materiais que ajudem a construir o caminho.'],
        ['Prazo', 'Data real de publicação ou utilização para organizar a produção.']
      ],
      closeText: 'Agora vamos transformar a mensagem da campanha numa imagem que pede atenção.'
    },
    'design-eventos': {
      title: 'Identidade Visual para Eventos',
      welcome: 'Obrigado por confiares a identidade do teu evento a este processo. Vamos criar uma direção visual que ajude o evento a ser reconhecido antes, durante e depois de acontecer.',
      slogan: 'UM EVENTO MEMORÁVEL COMEÇA ANTES DA PRIMEIRA PESSOA CHEGAR.',
      page3Intro: 'Vamos organizar a atmosfera, os momentos e os suportes do evento para construir uma experiência visual coerente.',
      steps: [
        ['Enquadramento', 'Compreendo o tipo de evento, o público, o ambiente e os momentos mais importantes.'],
        ['Conceito', 'Defino uma ideia visual capaz de orientar todas as aplicações do evento.'],
        ['Aplicações', 'Desenvolvo os materiais necessários para comunicar e acompanhar a experiência.'],
        ['Entrega', 'Organizo os ficheiros finais para produção, divulgação e utilização no local.']
      ],
      principles: [
        ['Atmosfera', 'A identidade deve transmitir o sentimento que queres que as pessoas levem do evento.'],
        ['Orientação', 'Cada peça deve ajudar as pessoas a saber onde estão e o que acontece a seguir.'],
        ['Memória', 'Uma direção coerente torna o evento mais fácil de reconhecer e recordar.']
      ],
      needs: [
        ['Programa', 'Datas, horários, momentos, convidados e informações que estruturam o evento.'],
        ['Espaço', 'Medidas, plantas, suportes disponíveis e locais onde a identidade será aplicada.'],
        ['Produção', 'Materiais, quantidades, fornecedores e limitações técnicas já conhecidas.'],
        ['Decisões', 'Validações rápidas para que a produção possa avançar sem atrasos.']
      ],
      closeText: 'Agora começa a construção da atmosfera visual que vai acompanhar o teu evento.'
    },
    'web-design': {
      title: 'Web Design',
      welcome: 'Obrigado por confiares a presença digital do teu projeto a este processo. Vamos organizar conteúdo, navegação e imagem para criar uma experiência simples e eficaz.',
      slogan: 'UM BOM WEBSITE TORNA A PRÓXIMA DECISÃO MAIS FÁCIL.',
      page3Intro: 'Antes de desenhar ecrãs, vamos compreender o conteúdo, as pessoas e as ações que o website precisa de facilitar.',
      steps: [
        ['Estrutura', 'Organizo páginas, conteúdos e prioridades para criar uma navegação compreensível.'],
        ['Direção', 'Defino uma linguagem visual digital alinhada com a marca e com o objetivo do website.'],
        ['Interface', 'Desenvolvo os ecrãs e componentes que dão forma à experiência.'],
        ['Preparação', 'Reúno os materiais finais e os detalhes necessários para a implementação.']
      ],
      principles: [
        ['Usabilidade', 'A pessoa deve encontrar o que procura sem esforço ou confusão.'],
        ['Hierarquia', 'O conteúdo importante deve ter prioridade visual e orientar a navegação.'],
        ['Confiança', 'O website deve parecer claro, cuidado e coerente em cada ponto de contacto.']
      ],
      needs: [
        ['Conteúdo', 'Textos, páginas, imagens, serviços, contactos e chamadas para ação.'],
        ['Referências', 'Websites, marcas e exemplos de experiências que fazem sentido para o projeto.'],
        ['Funcionalidades', 'Formulários, integrações, pagamentos ou comportamentos necessários.'],
        ['Acessos', 'Domínio, alojamento, ferramentas e pessoas envolvidas na implementação.']
      ],
      closeText: 'A partir daqui, vamos transformar a informação do projeto numa experiência digital clara.'
    },
    'materiais-graficos': {
      title: 'Materiais Gráficos & Impressos',
      welcome: 'Obrigado por confiares estes materiais ao processo. Vamos garantir que cada peça comunica bem e está preparada para o suporte onde será utilizada.',
      slogan: 'BONS MATERIAIS TORNAM A MENSAGEM PRESENTE NO MUNDO REAL.',
      page3Intro: 'Começamos por compreender a função de cada peça, o público e as condições reais de produção.',
      steps: [
        ['Inventário', 'Reúno os materiais, formatos, quantidades e objetivos de cada peça.'],
        ['Direção', 'Escolho uma solução visual coerente com a marca e adequada ao suporte.'],
        ['Desenvolvimento', 'Crio e ajusto as peças com atenção à leitura, escala e preparação técnica.'],
        ['Artes finais', 'Entrego os ficheiros preparados para utilização ou envio à produção.']
      ],
      principles: [
        ['Leitura', 'A informação deve continuar clara no tamanho e distância em que será vista.'],
        ['Consistência', 'As diferentes peças devem parecer parte da mesma comunicação.'],
        ['Preparação', 'O ficheiro final precisa de respeitar as exigências do suporte e da produção.']
      ],
      needs: [
        ['Conteúdo', 'Textos finais, contactos, medidas, preços e informações obrigatórias.'],
        ['Formato', 'Dimensões, material, quantidade e local onde cada peça será usada.'],
        ['Imagens', 'Fotografias, logótipo, ilustrações e referências disponíveis.'],
        ['Produção', 'Fornecedor, prazo, especificações técnicas e orçamento conhecido.']
      ],
      closeText: 'Agora vamos transformar a informação do projeto em materiais prontos para circular.'
    }
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function buildPreset(serviceType) {
    const preset = PRESETS[serviceType] || PRESETS['identidade-visual'];
    const steps = preset.steps.map((step, index) => ({
      number: String(index + 1).padStart(2, '0'),
      title: step[0],
      text: step[1]
    }));
    const principles = preset.principles.map((item, index) => ({
      number: String(index + 1).padStart(2, '0'),
      title: item[0],
      text: item[1]
    }));
    const needs = preset.needs.map((item, index) => ({
      index: String.fromCharCode(65 + index),
      title: item[0],
      text: item[1]
    }));

    return {
      serviceType,
      title: preset.title,
      welcomeMessage: preset.welcome,
      includes: needs.map(item => item.title),
      deliveryTime: 'A confirmar após análise do briefing',
      revisions: '2 rondas de revisão incluídas. Alterações adicionais são cobradas à parte.',
      paymentMethod: '50% adiantado, 50% na entrega. Pagamento por transferência bancária ou Multicaixa.',
      page1: { eyebrow: 'WELCOME PACK', slogan: preset.slogan },
      page2: {
        ...clone(SHARED.page2),
        intro: preset.welcome
      },
      page3: {
        ...clone(SHARED.page3),
        intro: preset.page3Intro,
        steps
      },
      page4: {
        ...clone(SHARED.page4),
        principles,
        timeline: clone(SHARED.page4.timeline)
      },
      page5: {
        ...clone(SHARED.page5),
        needs
      },
      page6: {
        ...clone(SHARED.page6),
        schedule: [
          { label: '01 / PRAZO ESTIMADO', title: 'A confirmar após análise', text: preset.deliveryTime, dark: true },
          { label: '02 / ALTERAÇÕES', title: 'Duas rondas incluídas', text: preset.revisions, dark: false },
          { label: '03 / PAGAMENTO', title: 'Condições combinadas', text: preset.paymentMethod, dark: false },
          { label: '04 / APROVAÇÃO', title: 'Depois de validar, avançamos', text: 'Cada etapa segue para a próxima quando a direção estiver aprovada.', dark: false }
        ],
        contactLabel: SHARED.page6.contactLabel,
        contactEmail: CONTACT.email,
        contactUrl: CONTACT.url
      },
      page7: {
        ...clone(SHARED.page7),
        closeText: preset.closeText
      },
      shared: clone(SHARED.shared)
    };
  }

  const DEFAULTS = {};
  SERVICE_TYPES.forEach(serviceType => {
    DEFAULTS[serviceType] = buildPreset(serviceType);
  });

  function merge(base, override) {
    if (!override || typeof override !== 'object') return clone(base);
    const result = clone(base);
    Object.keys(override).forEach(key => {
      const value = override[key];
      if (value && typeof value === 'object' && !Array.isArray(value) && result[key] && typeof result[key] === 'object' && !Array.isArray(result[key])) {
        result[key] = merge(result[key], value);
      } else if (value !== undefined && value !== null) {
        result[key] = clone(value);
      }
    });
    return result;
  }

  function fromDocument(documentRow, serviceType) {
    const type = serviceType || documentRow?.service_type || 'identidade-visual';
    const base = DEFAULTS[type] || DEFAULTS['identidade-visual'];
    const row = documentRow || {};
    const legacy = {};

    if (row.title) legacy.title = row.title;
    if (row.welcome_message) {
      legacy.welcomeMessage = row.welcome_message;
      legacy.page2 = { intro: row.welcome_message };
    }
    if (Array.isArray(row.next_steps) && row.next_steps.length) {
      legacy.page3 = { steps: row.next_steps.slice(0, 4).map((title, index) => ({
        number: String(index + 1).padStart(2, '0'),
        title,
        text: base.page3.steps[index]?.text || 'Etapa definida para este serviço.'
      })) };
    }
    if (row.delivery_time || row.revisions || row.payment_method) {
      legacy.deliveryTime = row.delivery_time || base.deliveryTime;
      legacy.revisions = row.revisions || base.revisions;
      legacy.paymentMethod = row.payment_method || base.paymentMethod;
      legacy.page6 = {
        schedule: [
          { ...base.page6.schedule[0], text: row.delivery_time || base.page6.schedule[0].text },
          { ...base.page6.schedule[1], text: row.revisions || base.page6.schedule[1].text },
          { ...base.page6.schedule[2], text: row.payment_method || base.page6.schedule[2].text },
          base.page6.schedule[3]
        ]
      };
    }

    const content = row.content && typeof row.content === 'object' ? row.content : {};
    return merge(merge(base, legacy), content);
  }

  window.WelcomePack = {
    serviceTypes: SERVICE_TYPES.slice(),
    defaults: DEFAULTS,
    clone,
    merge,
    fromDocument
  };
})(window);
