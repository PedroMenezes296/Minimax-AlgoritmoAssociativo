# Minimax Visualizer

Aplicativo web educacional que demonstra visualmente o algoritmo **Minimax** aplicado ao Jogo da Velha, com suporte à otimização por **Poda Alfa-Beta**.

Criado para a disciplina de Teoria da Computação (Profa. Alice Finger) — Engenharia da Computação.

---

## O que é

O Minimax é um algoritmo de busca em árvore usado em jogos de dois jogadores de soma zero. Ele simula todas as jogadas possíveis até o fim da partida, assumindo que ambos os jogadores jogam de forma ótima:

- O jogador **MAX** (IA) tenta maximizar o resultado
- O jogador **MIN** (humano) tenta minimizá-lo

A **Poda Alfa-Beta** é uma otimização que elimina ramos da árvore que não podem influenciar o resultado final, reduzindo significativamente o número de nós avaliados sem alterar a decisão.

---

## Funcionalidades

- Jogo da Velha completo contra uma IA que nunca perde
- Visualização animada da árvore de decisão nó a nó (~80ms de delay)
- Toggle entre Minimax puro e Minimax com Poda Alfa-Beta
- Contador em tempo real de nós avaliados, nós podados e profundidade máxima
- Painel de log com explicações passo a passo das decisões da IA
- Exibição dos valores α e β atuais (modo Alfa-Beta)
- Destaque visual do caminho ótimo escolhido ao final da animação
- Nós podados exibidos com estilo apagado e ícone ✂

### Código de cores da árvore

| Tipo de nó              | Cor                          |
|-------------------------|------------------------------|
| Nó MAX ativo            | Azul elétrico `#00BFFF`      |
| Nó MIN ativo            | Laranja `#FF6B35`            |
| Folha — vitória da IA   | Verde neon `#00FF88`         |
| Folha — vitória humana  | Vermelho `#FF3355`           |
| Folha — empate          | Dourado `#FFD700`            |
| Nó podado               | Cinza apagado `#2A2A35`      |
| Caminho escolhido       | Branco brilhante `#FFFFFF`   |

---

## Stack

- **React 18** — interface reativa
- **Vite** — bundler e dev server
- **Tailwind CSS v4** — utilitários de estilo
- **SVG puro** — renderização da árvore de decisão
- Sem bibliotecas externas de gráficos

---

## Estrutura do projeto

```
src/
├── algorithms/
│   └── minimax.js              # Implementação do Minimax e Alfa-Beta
├── components/
│   ├── Header/                 # Título e toggle de algoritmo
│   ├── GamePanel/              # Tabuleiro, status e controles
│   ├── TreePanel/              # Árvore SVG, estatísticas e legenda
│   └── InfoPanel/              # Log de passos e display α/β
├── hooks/
│   ├── useGameState.js         # Estado global da partida
│   ├── useTreeAnimation.js     # Animação incremental da árvore
│   └── useTreeLayout.js        # Cálculo de posições dos nós
├── utils/
│   ├── boardHelpers.js         # Verificação de vitória/empate
│   └── treeLayout.js           # Algoritmo de layout da árvore
├── constants/
│   └── colors.js               # Paleta de cores centralizada
├── App.jsx
├── main.jsx
└── index.css
```

---

## Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) v18 ou superior
- npm (incluído com o Node.js)

### Instalação e execução

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

### Build para produção

```bash
npm run build
npm run preview
```

Os arquivos compilados ficam em `dist/`.

---

## Como usar

1. Escolha seu lado (**X** joga primeiro, **O** é a IA por padrão) em "Controls"
2. Selecione o modo de algoritmo no toggle do topo: **Minimax** ou **Alfa-Beta**
3. Faça sua jogada clicando em uma célula do tabuleiro
4. Acompanhe a IA construindo a árvore de decisão em tempo real no painel direito
5. Observe no painel inferior o log de decisões e os valores α/β
6. Compare os contadores de nós entre os dois modos para ver o ganho de eficiência da poda
7. Clique em **Reiniciar** para uma nova partida

---

## Garantias do algoritmo

- A IA **nunca perde** — o Minimax com tabuleiro 3×3 é matematicamente ótimo
- Com Alfa-Beta ativado, a **jogada escolhida é idêntica** ao Minimax puro
- O número de nós avaliados com Alfa-Beta é **sempre menor ou igual** ao Minimax puro
