/*
     Simple running & jumping game
     Save as /Users/emon/Desktop/JS Practice/game.js
     Controls: Space or Click/Tap to jump. Press Space to restart after game over.
*/

(() => {
     const W = 800, H = 200;
     const gravity = 0.8;
     const jumpVel = -14;
     const groundY = H - 30;

     let canvas = document.createElement('canvas');
     canvas.width = W; canvas.height = H;
     canvas.style.display = 'block';
     canvas.style.margin = '20px auto';
     canvas.style.background = '#87CEEB';
     document.body.appendChild(canvas);
     let ctx = canvas.getContext('2d');

     // Game state
     let player = { x: 60, y: groundY - 40, w: 34, h: 40, vy: 0, onGround: true, runPhase: 0 };
     let obstacles = [];
     let spawnTimer = 0;
     let speed = 3;
     let score = 0;
     let best = parseInt(localStorage.getItem('simple_run_best') || '0', 10);
     let running = true;
     let gameOver = false;

     function reset() {
          obstacles = [];
          spawnTimer = 0;
          speed = 5;
          score = 0;
          player.y = groundY - player.h; player.vy = 0; player.onGround = true;
          running = true; gameOver = false;
     }

     function spawnObstacle() {
          const h = 20 + Math.random() * 40;
          const w = 12 + Math.random() * 30;
          obstacles.push({ x: W + 10, y: groundY - h, w, h });
     }

     function update() {
          if (!running) return;
          // physics
          player.vy += gravity;
          player.y += player.vy;
          if (player.y >= groundY - player.h) {
               player.y = groundY - player.h;
               player.vy = 0;
               player.onGround = true;
          } else {
               player.onGround = false;
          }

          // run animation phase
          if (player.onGround) player.runPhase = (player.runPhase + 0.25 * (speed / 5)) % 4; else player.runPhase = 0;

          // spawn obstacles
          spawnTimer -= 1;
          if (spawnTimer <= 0) {
               spawnTimer = 60 + Math.floor(Math.random() * 80) - Math.floor(score / 100); // faster spawn later
               spawnObstacle();
          }

          // move obstacles
          for (let i = obstacles.length - 1; i >= 0; i--) {
               obstacles[i].x -= speed;
               if (obstacles[i].x + obstacles[i].w < 0) {
                    obstacles.splice(i, 1);
                    score += 10;
                    if (score % 100 === 0) speed += 0.5; // increase speed occasionally
               }
          }

          // collisions
          for (let ob of obstacles) {
               if (rectIntersect(player, ob)) {
                    running = false;
                    gameOver = true;
                    if (score > best) { best = score; localStorage.setItem('simple_run_best', String(best)); }
               }
          }
     }

     function rectIntersect(a, b) {
          return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
     }

     function draw() {
          // sky already set by canvas background; draw ground
          ctx.clearRect(0, 0, W, H);

          // background hills (parallax)
          drawHills();

          // ground
          ctx.fillStyle = '#654321';
          ctx.fillRect(0, groundY, W, H - groundY);

          // draw player (simple runner)
          ctx.save();
          ctx.translate(player.x, player.y);
          // body
          ctx.fillStyle = '#ff5252';
          ctx.fillRect(0, 0, player.w, player.h);
          // eye
          ctx.fillStyle = '#fff';
          ctx.fillRect(player.w - 12, 6, 6, 6);
          ctx.fillStyle = '#000';
          ctx.fillRect(player.w - 10, 8, 2, 2);
          // legs (simple animation)
          ctx.fillStyle = '#222';
          const phase = Math.floor(player.runPhase);
          if (player.onGround) {
               if (phase % 2 === 0) {
                    ctx.fillRect(6, player.h, 6, 12);
                    ctx.fillRect(player.w - 12, player.h, 6, 8);
               } else {
                    ctx.fillRect(6, player.h, 6, 8);
                    ctx.fillRect(player.w - 12, player.h, 6, 12);
               }
          } else {
               // tucked legs when jumping
               ctx.fillRect(8, player.h - 4, 6, 10);
               ctx.fillRect(player.w - 14, player.h - 4, 6, 10);
          }
          ctx.restore();

          // obstacles
          ctx.fillStyle = '#333';
          for (let ob of obstacles) {
               ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
          }

          // HUD
          ctx.fillStyle = '#000';
          ctx.font = '14px sans-serif';
          ctx.fillText('Score: ' + score, 10, 20);
          ctx.fillText('Best: ' + best, 10, 38);

          if (!running) {
               ctx.fillStyle = 'rgba(0,0,0,0.5)';
               ctx.fillRect(0, 0, W, H);
               ctx.fillStyle = '#fff';
               ctx.font = '24px sans-serif';
               ctx.textAlign = 'center';
               ctx.fillText(gameOver ? 'Game Over' : 'Paused', W / 2, H / 2 - 10);
               ctx.font = '16px sans-serif';
               ctx.fillText('Press Space or Tap to ' + (gameOver ? 'Restart' : 'Resume'), W / 2, H / 2 + 20);
               ctx.textAlign = 'left';
          }
     }

     function drawHills() {
          // simple parallax hills
          ctx.fillStyle = '#6bbf59';
          ctx.beginPath();
          ctx.moveTo(0, groundY);
          ctx.quadraticCurveTo(W * 0.25, groundY - 40, W * 0.5, groundY - 10);
          ctx.quadraticCurveTo(W * 0.75, groundY + 20, W, groundY - 20);
          ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
          ctx.fill();

          ctx.fillStyle = '#57a44a';
          ctx.beginPath();
          ctx.moveTo(0, groundY);
          ctx.quadraticCurveTo(W * 0.35, groundY - 30, W * 0.7, groundY - 5);
          ctx.quadraticCurveTo(W * 0.9, groundY + 10, W, groundY);
          ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
          ctx.fill();
     }

     function loop() {
          update();
          draw();
          requestAnimationFrame(loop);
     }

     // Input
     function jump() {
          if (gameOver) { reset(); return; }
          if (!running) { running = true; return; }
          if (player.onGround) {
               player.vy = jumpVel;
               player.onGround = false;
          }
     }

     window.addEventListener('keydown', (e) => {
          if (e.code === 'Space') { e.preventDefault(); jump(); }
          if (e.code === 'KeyR' && gameOver) reset();
     });
     canvas.addEventListener('mousedown', (e) => { e.preventDefault(); jump(); });
     canvas.addEventListener('touchstart', (e) => { e.preventDefault(); jump(); }, { passive: false });

     // Start
     reset();
     loop();
})();