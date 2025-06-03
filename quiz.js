/* jshint esversion: 6 */
 /* jshint node: true */
const express = require('express');
const app = express();
const http=require('http');
const socket=require('socket.io');
const bodyParser=require('body-parser');
const server=http.createServer(app);
const io=socket(server);
const path = require('path');

app.use(express.static('public'));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.set('views', path.join(__dirname, 'views'));

let onlinePlayers=[];
let gameStates = {};

let questions = [
    {
      question: "What do elephants use to drink water?",
      options: ["Mouth", "Trunk", "Tongue", "Ears"],
      answer: "Trunk",
    },
    {
      question: "10 - 4 × 2 = ?",
      options: ["2", "12", "6", "8"],
      answer: "2",
    },
    {
      question: "Which planet is closest to the Sun?",
      options: ["Earth", "Venus", "Mercury", "Mars"],
      answer: "Mercury",
    },
    {
      question: "What is the boiling point of water at standard atmospheric pressure (in °C)?",
      options: ["0°C (Zero degrees)", "100°C (One hundred degrees)", "50°C (Fifty degrees)", "200°C (Two hundred degrees)"],
      answer: "100°C (One hundred degrees)",
    },
    {
      question: "On which side of the body is the human heart located?",
      options: ["Right side", "Left side", "Middle", "Upper side"],
      answer: "Left side",
    },
    {
      question: "In the fairy tale 'Little Red Riding Hood',who is Little Red Riding Hood going to visit?",
      options: ["Mother", "Father", "Grandmother", "Friend"],
      answer: "Grandmother",
      }

  ];

app.get('/welcomeQuiz',(req,res)=>{
    res.render('welcomeQuiz',{questions});
});

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new player', (playerName) => {
        onlinePlayers.push({ id: socket.id, name: playerName });
        io.emit('update players', onlinePlayers);
    });

    
    socket.on('challenge request', (targetId) => {
        const challenger = onlinePlayers.find(p => p.id === socket.id);
        console.log('challenge request from', socket.id, 'to', targetId);
        if (challenger) {
            io.to(targetId).emit('challenge received', { id: socket.id, name: challenger.name });
        }
    });

    
    socket.on('challenge response', (data) => {
        console.log('challenge response:', data, 'Target socket.id:', data.from);
        if (data.accepted) {
            const gameId = `${socket.id}-${data.from}`;
            gameStates[gameId] = {
                players: [socket.id, data.from],
                currentQuestionIndex: 0,
                scores: { [socket.id]: 0, [data.from]: 0 },
                answeredQuestions: { [socket.id]: [], [data.from]: [] }
            };
            
            io.to(socket.id).emit('game start', { gameId, opponentId: data.from });
            io.to(data.from).emit('game start', { gameId, opponentId: socket.id });
        }
        io.to(data.from).emit('challenge result', { accepted: data.accepted });
    });

    socket.on('answer selected', (data) => {
        const { gameId, questionIndex, selectedOption, scoreA, scoreB } = data;
        const gameState = gameStates[gameId];
        
        if (gameState && gameState.players.includes(socket.id)) {
            if (!gameState.answeredQuestions[socket.id].includes(questionIndex)) {
                gameState.answeredQuestions[socket.id].push(questionIndex);
                
                gameState.scores[socket.id] = scoreA;
                const opponentId = gameState.players.find(id => id !== socket.id);
                gameState.scores[opponentId] = scoreB;
                
                gameState.currentQuestionIndex = questionIndex + 1;
                
                if (gameState.currentQuestionIndex >= 6) {
                    gameState.players.forEach(playerId => {
                        const opponentId = gameState.players.find(id => id !== playerId);
                        const playerScore = gameState.scores[playerId];
                        const opponentScore = gameState.scores[opponentId];
                        const isDraw = playerScore === opponentScore;
                        const isWinner = !isDraw && playerScore > opponentScore;
                        
                        console.log('Sending game end data to player:', playerId, {
                            playerScore,
                            opponentScore,
                            isDraw,
                            isWinner
                        });
                        
                        io.to(playerId).emit('game end', {
                            scores: gameState.scores,
                            currentPlayerScore: playerScore,
                            opponentScore: opponentScore,
                            isWinner: isWinner,
                            isDraw: isDraw,
                            opponentName: onlinePlayers.find(p => p.id === opponentId).name
                        });
                    });
                } else {
                    gameState.players.forEach(playerId => {
                        io.to(playerId).emit('next question', {
                            questionIndex: gameState.currentQuestionIndex,
                            scores: gameState.scores,
                            currentPlayerScore: gameState.scores[playerId],
                            opponentScore: gameState.scores[playerId === socket.id ? opponentId : socket.id]
                        });
                    });
                }
                
                io.to(opponentId).emit('opponent answered', {
                    questionIndex,
                    selectedOption,
                    currentScore: gameState.scores[socket.id],
                    opponentScore: gameState.scores[opponentId],
                    opponentName: onlinePlayers.find(p => p.id === opponentId).name
                });
            }
        }
    });

    socket.on('disconnect', () => {
        onlinePlayers = onlinePlayers.filter(player => player.id !== socket.id);
        Object.keys(gameStates).forEach(gameId => {
            if (gameStates[gameId].players.includes(socket.id)) {
                delete gameStates[gameId];
            }
        });
        io.emit('update players', onlinePlayers);
        console.log('A user disconnected:', socket.id);
    });
});

const port = 8080;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
