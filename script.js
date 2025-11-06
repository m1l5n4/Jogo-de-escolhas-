  // Estado do jogo
        const gameState = {
            fuel: 100,
            integrity: 100,
            crew: 5,
            scene: 0,
            gameOver: false,
            scenes: [
                {
                    text: "Sua nave, a Voyager VII, sofreu uma colisão com detritos espaciais enquanto realizava uma missão de pesquisa no cinturão de asteroides. Agora, com sistemas danificados e suprimentos limitados, você e sua tripulação de 5 membros precisam voltar para a Terra antes que seja tarde demais.\n\nO caminho mais rápido passa perto de uma estrela instável, enquanto a rota mais longa exigiria mais combustível. O que você decide?",
                    choices: [
                        "Tomar a rota mais curta perto da estrela instável",
                        "Seguir pela rota mais longa para evitar perigos",
                        "Tentar reparos na nave antes de decidir a rota"
                    ],
                    consequences: [
                        () => { nextScene(1); },
                        () => { gameState.fuel -= 30; nextScene(2); },
                        () => { 
                            gameState.fuel -= 10; 
                            gameState.integrity += 15; 
                            if(gameState.integrity > 100) gameState.integrity = 100;
                            nextScene(3); 
                        }
                    ]
                },
                // Cena 1: Rota perto da estrela
                {
                    text: "Você decide arriscar a rota perto da estrela instável. Enquanto se aproximam, os sensores detectam uma intensa atividade solar. O escudo da nave está sofrendo danos, mas o caminho é realmente mais rápido.\n\nDe repente, um alerta soa: uma ejeção de massa coronal está vindo em sua direção. Você tem alguns minutos para decidir como reagir.",
                    choices: [
                        "Tentar desviar usando os propulsores de emergência",
                        "Redirecionar energia para os escudos e continuar",
                        "Ativar o protocolo de hibernação e esperar passar"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 25; 
                            if(Math.random() > 0.4) {
                                nextScene(4); // Sucesso
                            } else {
                                gameState.integrity -= 40;
                                gameState.crew -= 1;
                                nextScene(5); // Falha
                            }
                        },
                        () => { 
                            gameState.integrity -= 20;
                            if(gameState.integrity <= 0) {
                                gameOver("A nave não resistiu à tempestade solar. Todos pereceram.");
                            } else {
                                nextScene(4);
                            }
                        },
                        () => {
                            if(Math.random() > 0.3) {
                                gameState.crew -= 2;
                                nextScene(5);
                            } else {
                                nextScene(4);
                            }
                        }
                    ]
                },
                // Cena 2: Rota longa
                {
                    text: "Você opta pela rota mais longa para evitar perigos. Dias passam e o combustível continua diminuindo. A tripulação começa a ficar ansiosa com a jornada prolongada.\n\nNo terceiro dia, um alarme soa: há uma falha no sistema de suporte de vida. O oxigênio está vazando lentamente.",
                    choices: [
                        "Desviar para uma estação espacial abandonada próxima para tentar reparos",
                        "Consertar com os recursos disponíveis a bordo",
                        "Reduzir o consumo de oxigênio colocando parte da tripulação em hibernação"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 15;
                            if(Math.random() > 0.5) {
                                gameState.integrity += 20;
                                if(gameState.integrity > 100) gameState.integrity = 100;
                                nextScene(6);
                            } else {
                                gameState.crew -= 1;
                                nextScene(7);
                            }
                        },
                        () => {
                            if(gameState.integrity > 50) {
                                gameState.integrity -= 15;
                                nextScene(6);
                            } else {
                                gameState.crew -= 2;
                                nextScene(7);
                            }
                        },
                        () => {
                            gameState.crew -= 1;
                            nextScene(6);
                        }
                    ]
                },
                // Cena 3: Tentar reparos
                {
                    text: "Você decide que é melhor tentar consertar alguns sistemas antes de partir. A tripulação trabalha por horas e consegue melhorar a integridade da nave, mas isso custou combustível precioso.\n\nAgora com a nave em melhores condições, você precisa decidir a rota.",
                    choices: [
                        "Tomar a rota mais curta perto da estrela instável",
                        "Seguir pela rota mais longa para evitar perigos",
                        "Tentar uma rota alternativa através de um campo de asteroides"
                    ],
                    consequences: [
                        () => { nextScene(1); },
                        () => { gameState.fuel -= 25; nextScene(2); },
                        () => {
                            if(Math.random() > 0.6) {
                                gameState.fuel -= 15;
                                nextScene(8);
                            } else {
                                gameState.integrity -= 30;
                                gameState.crew -= 1;
                                nextScene(9);
                            }
                        }
                    ]
                },
                // Cena 4: Sucesso ao passar pela estrela
                {
                    text: "Sua decisão foi acertada! A nave consegue passar pela tempestade solar com danos mínimos. Agora vocês estão no caminho direto para a Terra.\n\nCom os sistemas estabilizados, resta apenas cruzar o espaço profundo até chegar em casa.",
                    choices: [
                        "Acelerar para chegar mais rápido",
                        "Manter velocidade de cruzeiro para economizar combustível",
                        "Realizar uma verificação completa dos sistemas"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 35;
                            if(gameState.fuel <= 0) {
                                gameOver("Você ficou sem combustível no espaço profundo. A tripulação entrou em hibernação indefinida.");
                            } else {
                                checkFinal();
                            }
                        },
                        () => { checkFinal(); },
                        () => { 
                            if(Math.random() > 0.7) {
                                gameState.integrity += 10;
                                if(gameState.integrity > 100) gameState.integrity = 100;
                            }
                            checkFinal();
                        }
                    ]
                },
                // Cena 5: Danos ao passar pela estrela
                {
                    text: "A nave sofreu danos significativos ao passar pela estrela. Alguns sistemas estão offline e há vítimas entre a tripulação.\n\nVocê precisa estabilizar a situação antes de continuar a jornada.",
                    choices: [
                        "Priorizar reparos nos sistemas de navegação",
                        "Cuidar dos feridos primeiro",
                        "Tentar um pedido de socorro"
                    ],
                    consequences: [
                        () => { 
                            gameState.integrity += 20;
                            gameState.crew -= 1;
                            checkFinal();
                        },
                        () => {
                            if(gameState.crew > 1) {
                                gameState.crew += 1;
                            }
                            gameState.fuel -= 10;
                            checkFinal();
                        },
                        () => {
                            if(Math.random() > 0.8) {
                                gameOver("Uma nave de resgate chegou a tempo! Vocês foram salvos!");
                            } else {
                                gameState.crew -= 2;
                                checkFinal();
                            }
                        }
                    ]
                },
                // Cena 6: Sucesso na rota longa
                {
                    text: "Você consegue resolver o problema do oxigênio e continuar a jornada. A rota está tranquila, mas longa. A tripulação está cansada e o combustível continua diminuindo.\n\nUm sinal fraco é detectado: pode ser uma nave ou apenas interferência.",
                    choices: [
                        "Investigar o sinal",
                        "Ignorar e continuar para a Terra",
                        "Tentar enviar um sinal de socorro"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 10;
                            if(Math.random() > 0.5) {
                                gameState.fuel += 20;
                                if(gameState.fuel > 100) gameState.fuel = 100;
                                nextScene(10);
                            } else {
                                gameState.crew -= 1;
                                nextScene(11);
                            }
                        },
                        () => { checkFinal(); },
                        () => {
                            if(Math.random() > 0.7) {
                                gameOver("Uma nave mercante ouviu seu sinal e está vindo para ajudar!");
                            } else {
                                gameState.fuel -= 5;
                                checkFinal();
                            }
                        }
                    ]
                },
                // Cena 7: Problemas na rota longa
                {
                    text: "A situação na nave está crítica. O oxigênio está acabando e o moral da tripulação está baixo. Vocês estão perdendo tempo e recursos preciosos.\n\nUm planeta deserto está relativamente próximo. Pode haver recursos lá, mas o desvio consumirá mais combustível.",
                    choices: [
                        "Tentar chegar ao planeta para buscar recursos",
                        "Continuar direto para a Terra e rezar",
                        "Sacrificar parte do equipamento para ganhar velocidade"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 20;
                            if(Math.random() > 0.4) {
                                gameState.fuel += 10;
                                gameState.integrity += 15;
                                nextScene(10);
                            } else {
                                gameState.crew -= 2;
                                gameOver("O planeta era inóspito. Sem recursos e com pouco combustível, a tripulação não conseguiu continuar.");
                            }
                        },
                        () => {
                            if(gameState.integrity > 30 && gameState.fuel > 20) {
                                checkFinal();
                            } else {
                                gameOver("A nave não aguentou a jornada. Vocês ficaram à deriva no espaço.");
                            }
                        },
                        () => {
                            gameState.integrity -= 25;
                            gameState.fuel += 15;
                            checkFinal();
                        }
                    ]
                },
                // Cena 8: Rota alternativa bem-sucedida
                {
                    text: "A rota através do campo de asteroides foi arriscada, mas valeu a pena! Vocês economizaram tempo e combustível.\n\nAgora estão em uma posição privilegiada para retornar à Terra com recursos suficientes.",
                    choices: [
                        "Comemorar com a tripulação",
                        "Manter o foco e continuar a viagem",
                        "Aproveitar para coletar dados científicos"
                    ],
                    consequences: [
                        () => { 
                            if(Math.random() > 0.5) {
                                gameState.crew += 1;
                            }
                            checkFinal();
                        },
                        () => { checkFinal(); },
                        () => {
                            gameState.fuel -= 5;
                            checkFinal();
                        }
                    ]
                },
                // Cena 9: Rota alternativa falha
                {
                    text: "O campo de asteroides foi mais perigoso do que você imaginava. A nave sofreu danos e vocês perderam um membro da tripulação.\n\nAgora precisam decidir como continuar com recursos reduzidos.",
                    choices: [
                        "Tentar reparos emergenciais",
                        "Seguir em frente com os danos",
                        "Reduzir velocidade para minimizar riscos"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 10;
                            gameState.integrity += 20;
                            checkFinal();
                        },
                        () => {
                            if(gameState.integrity > 40) {
                                checkFinal();
                            } else {
                                gameState.crew -= 1;
                                gameOver("Os sistemas falharam completamente durante a viagem. A nave se tornou um caixão de metal.");
                            }
                        },
                        () => {
                            gameState.fuel -= 20;
                            checkFinal();
                        }
                    ]
                },
                // Cena 10: Encontro positivo
                {
                    text: "O sinal era de uma estação de pesquisa abandonada! Vocês encontram suprimentos valiosos e até algum combustível extra.\n\nCom os recursos adicionais, o retorno à Terra parece mais seguro agora.",
                    choices: [
                        "Levar tudo que puderem",
                        "Pegar apenas o essencial para não sobrecarregar a nave",
                        "Tentar reativar os sistemas da estação"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel += 30;
                            gameState.integrity -= 10;
                            checkFinal();
                        },
                        () => {
                            gameState.fuel += 15;
                            checkFinal();
                        },
                        () => {
                            if(Math.random() > 0.6) {
                                gameOver("Vocês conseguiram reativar o transmissor da estação! O resgate está a caminho!");
                            } else {
                                gameState.fuel += 10;
                                checkFinal();
                            }
                        }
                    ]
                },
                // Cena 11: Encontro negativo
                {
                    text: "O sinal era de uma nave pirata! Eles estão se aproximando rapidamente e não parecem amigáveis.\n\nVocê precisa decidir como proteger sua nave e tripulação.",
                    choices: [
                        "Tentar fugir a toda velocidade",
                        "Preparar armas defensivas (se houver)",
                        "Tentar negociar"
                    ],
                    consequences: [
                        () => { 
                            gameState.fuel -= 30;
                            if(gameState.fuel <= 0) {
                                gameOver("Vocês ficaram sem combustível durante a fuga e foram capturados pelos piratas.");
                            } else if(Math.random() > 0.5) {
                                checkFinal();
                            } else {
                                gameState.crew -= 2;
                                gameState.integrity -= 25;
                                checkFinal();
                            }
                        },
                        () => {
                            if(gameState.integrity > 60) {
                                gameState.integrity -= 20;
                                checkFinal();
                            } else {
                                gameState.crew -= 3;
                                gameOver("Sua nave não estava em condições de lutar. Os piratas invadiram e tomaram o controle.");
                            }
                        },
                        () => {
                            if(Math.random() > 0.7) {
                                gameState.fuel -= 10;
                                checkFinal();
                            } else {
                                gameState.crew -= 2;
                                gameState.integrity -= 15;
                                checkFinal();
                            }
                        }
                    ]
                }
            ]
        };

        // Inicializar o jogo
        function initGame() {
            updateStatus();
            createStars();
        }

        // Atualizar a interface com o estado atual
        function updateStatus() {
            document.getElementById('fuel').textContent = Math.max(0, gameState.fuel) + '%';
            document.getElementById('integrity').textContent = Math.max(0, gameState.integrity) + '%';
            
            const crewElement = document.getElementById('crew');
            crewElement.innerHTML = '';
            
            for(let i = 0; i < gameState.crew; i++) {
                const member = document.createElement('div');
                member.className = 'crew-member alive';
                crewElement.appendChild(member);
            }
            
            for(let i = 0; i < (5 - gameState.crew); i++) {
                const member = document.createElement('div');
                member.className = 'crew-member dead';
                crewElement.appendChild(member);
            }
        }

        // Criar estrelas de fundo
        function createStars() {
            const animationDiv = document.getElementById('animation');
            animationDiv.innerHTML = '';
            
            for(let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                
                // Posição aleatória
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                
                // Tamanho aleatório
                const size = Math.random() * 3;
                
                // Duração da animação aleatória
                const duration = 2 + Math.random() * 3;
                
                star.style.left = `${x}%`;
                star.style.top = `${y}%`;
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                star.style.setProperty('--duration', `${duration}s`);
                
                animationDiv.appendChild(star);
            }
        }

        // Fazer uma escolha
        function makeChoice(choiceIndex) {
            if(gameState.gameOver) return;
            
            const currentScene = gameState.scenes[gameState.scene];
            currentScene.consequences[choiceIndex - 1]();
            
            updateStatus();
            
            // Verificar condições de derrota
            if(gameState.crew <= 0) {
                gameOver("Todos os membros da tripulação morreram. A nave continua à deriva no espaço, agora um caixão de metal.");
                return;
            }
            
            if(gameState.integrity <= 0) {
                gameOver("A nave sofreu danos catastróficos e se desintegrou no espaço.");
                return;
            }
        }

        // Ir para próxima cena
        function nextScene(sceneIndex) {
            gameState.scene = sceneIndex;
            const scene = gameState.scenes[sceneIndex];
            
            document.getElementById('scene').textContent = scene.text;
            
            const choicesDiv = document.getElementById('choices');
            choicesDiv.innerHTML = '';
            
            scene.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.textContent = choice;
                button.onclick = function() { makeChoice(index + 1); };
                choicesDiv.appendChild(button);
            });
        }

        // Verificar condições de vitória
        function checkFinal() {
            if(gameState.fuel <= 0) {
                gameOver("Você ficou sem combustível no espaço profundo. A tripulação entrou em hibernação indefinida.");
                return;
            }
            
            if(gameState.integrity <= 0) {
                gameOver("A nave sofreu danos catastróficos e se desintegrou no espaço.");
                return;
            }
            
            if(gameState.crew <= 0) {
                gameOver("Todos os membros da tripulação morreram. A nave continua à deriva no espaço, agora um caixão de metal.");
                return;
            }
            
            // Chance aleatória de eventos finais
            const rand = Math.random();
            
            if(rand > 0.7) {
                // Final bom
                gameOver(`Parabéns! A nave Voyager VII retornou à Terra com ${gameState.crew} membros da tripulação vivos!`);
            } else if(rand > 0.3) {
                // Final regular
                gameOver(`A nave chegou à Terra, mas com danos significativos. ${gameState.crew} sobreviveram.`);
            } else {
                // Final ruim
                gameOver("A nave chegou ao sistema solar, mas sem combustível para entrar em órbita. O resgate pode chegar a tempo... ou não.");
            }
        }

        // Game over
        function gameOver(message) {
            gameState.gameOver = true;
            
            document.getElementById('scene').style.display = 'none';
            document.getElementById('choices').style.display = 'none';
            
            const gameOverDiv = document.getElementById('gameOver');
            document.getElementById('gameOverText').textContent = message;
            gameOverDiv.style.display = 'block';
        }

        // Reiniciar o jogo
        function restartGame() {
            gameState.fuel = 100;
            gameState.integrity = 100;
            gameState.crew = 5;
            gameState.scene = 0;
            gameState.gameOver = false;
            
            document.getElementById('scene').style.display = 'block';
            document.getElementById('choices').style.display = 'flex';
            document.getElementById('gameOver').style.display = 'none';
            
            // Resetar para a primeira cena
            const scene = gameState.scenes[0];
            document.getElementById('scene').textContent = scene.text;
            
            const choicesDiv = document.getElementById('choices');
            choicesDiv.innerHTML = '';
            
            scene.choices.forEach((choice, index) => {
                const button = document.createElement('button');
                button.textContent = choice;
                button.onclick = function() { makeChoice(index + 1); };
                choicesDiv.appendChild(button);
            });
            
            updateStatus();
        }

        // Iniciar o jogo quando a página carregar
        window.onload = initGame;