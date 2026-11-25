# ⚔️ Arena Clash

**Arena Clash** é um jogo de batalha em arena para navegador, desenvolvido com **HTML5 Canvas, CSS e JavaScript puro**. Entre em combate contra bots inteligentes, escolha entre sete lutadores únicos e lute em três arenas temáticas com seis modos de jogo.

![Tecnologias](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Tecnologias](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Tecnologias](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)

## 🎮 Como jogar

Abra o arquivo `index.html` em um navegador ou acesse a versão publicada pelo **GitHub Pages**.

Na tela inicial, selecione seu lutador, configure suas engrenagens e escolha um modo de batalha. O jogo irá sortear aleatoriamente uma das três arenas disponíveis.

## 🕹️ Modos de batalha

| Modo | Objetivo |
|---|---|
| ⚔️ **Equipe 3v3** | Alcance 10 eliminações ou vença pelo maior placar ao fim de 2 minutos. |
| 👑 **Sobrevivência** | Enfrente oito lutadores sem respawn; o último sobrevivente vence. |
| 🔥 **Batalha Livre** | Todos contra todos. A primeira lutador a chegar a 8 eliminações vence. |
| 🎯 **Zona Estratégica** | Dispute a zona central com sua equipe e acumule até 100 pontos. |
| ⚽ **Futbrawl** | Marque 3 gols empurrando e chutando a bola em uma arena 3v3. |
| 💎 **Pique-Gema** | Colete gemas e mantenha 10 ou mais por 10 segundos para vencer. |

## 🧑‍🚀 Lutadores

O elenco possui sete personagens com atributos e estilos próprios:

- **Ana** — investida sombria e dano em área
- **José** — rajadas rápidas e ataques de precisão
- **Gustavo** — disparos aleatórios com efeitos elementais
- **Jorge** — projéteis que explodem em estilhaços
- **Davi** — franco-atirador de longo alcance
- **Gabriela** — bombas que atravessam obstáculos
- **Iarly** — piloto veloz com foguetes duplos

Cada lutador possui vida, velocidade, dano, alcance, ataque básico, habilidade especial e munição próprios.

## ⚙️ Engrenagens

Configure até duas engrenagens por lutador:

- 👟 **Velocidade** — aumenta a movimentação
- ⚔️ **Força** — aumenta o dano
- 🛡️ **Resistência** — reduz o dano recebido
- 🎯 **Precisão** — acelera projéteis e reduz dispersão
- 💚 **Recuperação** — restaura vida ao longo do tempo
- ⚡ **Recarga** — acelera o carregamento dos ataques

Cada engrenagem pode ser equipada nos níveis **Comum, Rara, Épica ou Lendária**, com bônus e duração diferentes.

## 🗺️ Arenas

- ☀️ **Templo Solar** — ruínas douradas e simétricas
- 💙 **Laboratório Neon** — corredores tecnológicos em azul
- 🌋 **Cânion Vulcânico** — passagens rochosas e ambiente vermelho

Os mapas possuem obstáculos destrutíveis e não destrutíveis, além de geometria própria.

## ⌨️ Controles

### Teclado e mouse

| Ação | Controle |
|---|---|
| Mover | `W` `A` `S` `D` ou setas |
| Mirar | Mouse |
| Ataque básico | Segurar e soltar o botão esquerdo |
| Habilidade especial | Clique direito ou `Espaço` |
| Engrenagem 1 | `1` ou `Q` |
| Engrenagem 2 | `2` ou `E` |

### Dispositivo móvel

- **Analógico esquerdo** — movimentação
- **Botão de ataque** — segure para mirar e solte para disparar
- **Botão especial** — ativa a habilidade do personagem
- **Botões de engrenagem** — ativam os bônus equipados

> Para a melhor experiência em celular, gire o dispositivo para o modo paisagem.

## 🎨 Personalização

O jogo oferece:

- Seleção de personagem
- Configuração de duas engrenagens por personagem
- Escolha do modo de batalha
- Editor visual do HUD para controles de toque
- Ajuste de tamanho dos controles
- Configuração automática, sempre visível ou oculta dos controles
- Ativação ou desativação dos efeitos sonoros
- Salvamento automático no `localStorage` do navegador
- Modo tela cheia

## 🔊 Áudio

Os efeitos sonoros são sintetizados diretamente pela **Web Audio API**, sem arquivos ou bibliotecas externas.

## 🧱 Tecnologias

- HTML5
- CSS3
- JavaScript
- Canvas 2D
- Web Audio API
- WebStorage / `localStorage`
- Fullscreen API
- Pointer Events

## 📂 Estrutura

```text
projeto-arena-2/
├── index.html   # Estrutura das telas e elementos do jogo
├── style.css    # Visual, animações e layout responsivo
└── script.js    # Mecânicas, personagens, bots, modos e renderização
