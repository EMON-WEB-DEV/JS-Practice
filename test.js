const readline = require('readline');

//#!/usr/bin/env node
'use strict';


const rl = readline.createInterface({
     input: process.stdin,
     output: process.stdout
});

const WIN_COMBOS = [
     [0,1,2],[3,4,5],[6,7,8],
     [0,3,6],[1,4,7],[2,5,8],
     [0,4,8],[2,4,6]
];

function newGame() {
     return Array.from({length:9}, () => ' ');
}

function drawBoard(board) {
     console.clear();
     console.log('');
     console.log(` ${board[0]} | ${board[1]} | ${board[2]} `);
     console.log('---+---+---');
     console.log(` ${board[3]} | ${board[4]} | ${board[5]} `);
     console.log('---+---+---');
     console.log(` ${board[6]} | ${board[7]} | ${board[8]} `);
     console.log('');
     console.log('Cells: 1 2 3');
     console.log('       4 5 6');
     console.log('       7 8 9');
     console.log('');
}

function checkWin(board) {
     for (const [a,b,c] of WIN_COMBOS) {
          if (board[a] !== ' ' && board[a] === board[b] && board[b] === board[c]) {
               return board[a];
          }
     }
     return null;
}

function isDraw(board) {
     return board.every(cell => cell !== ' ');
}

async function ask(question) {
     return new Promise(resolve => rl.question(question, ans => resolve(ans.trim())));
}

async function play() {
     let board = newGame();
     let current = 'X';
     while (true) {
          drawBoard(board);
          const ans = await ask(`Player ${current}, enter cell (1-9) or "q" to quit: `);
          if (ans.toLowerCase() === 'q') {
               console.log('Goodbye.');
               break;
          }
          const n = parseInt(ans, 10);
          if (!Number.isInteger(n) || n < 1 || n > 9) {
               console.log('Invalid input. Use a number 1-9.');
               continue;
          }
          const idx = n - 1;
          if (board[idx] !== ' ') {
               console.log('Cell already taken.');
               continue;
          }
          board[idx] = current;
          const winner = checkWin(board);
          if (winner) {
               drawBoard(board);
               console.log(`Player ${winner} wins!`);
               const again = (await ask('Play again? (y/n): ')).toLowerCase();
               if (again === 'y') {
                    board = newGame();
                    current = 'X';
                    continue;
               } else break;
          }
          if (isDraw(board)) {
               drawBoard(board);
               console.log('Draw!');
               const again = (await ask('Play again? (y/n): ')).toLowerCase();
               if (again === 'y') {
                    board = newGame();
                    current = 'X';
                    continue;
               } else break;
          }
          current = current === 'X' ? 'O' : 'X';
     }
     rl.close();
}

play().catch(err => {
     console.error(err);
     rl.close();
});