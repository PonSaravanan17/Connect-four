Connect 4 Game 🎮

A classic Connect 4 game built using modern web technologies. Players take turns dropping colored discs into a vertical grid, aiming to connect four of their pieces horizontally, vertically, or diagonally before their opponent.

📌 Overview

Connect 4 is a two-player strategy game where players compete to form a line of four consecutive discs. This project recreates the classic board game with an interactive user interface, real-time game logic, and win detection.

✨ Features
🎯 Two-player gameplay
🔄 Alternate player turns
🏆 Automatic win detection
🤝 Draw/Tie game detection
🔄 Restart/New Game functionality
📱 Responsive design for desktop and mobile devices
🎨 Clean and user-friendly interface
🛠️ Technologies Used
HTML5
CSS3
JavaScript (ES6+)

(Update this section according to your project stack if you used React, TypeScript, Python, etc.)

🚀 Getting Started
Prerequisites
A modern web browser
Node.js and npm (if applicable)
Installation
Clone the repository:
git clone https://github.com/your-username/connect4-game.git
Navigate to the project folder:
cd connect4-game
Install dependencies (if applicable):
npm install
Start the application:
npm start
Open your browser and visit:
http://localhost:3000
🎮 How to Play
The game board consists of a 7-column × 6-row grid.
Players take turns selecting a column.
A disc will drop to the lowest available position in the chosen column.
The first player to connect four discs in a row (horizontal, vertical, or diagonal) wins.
If the board fills completely without a winner, the game ends in a draw.
📂 Project Structure
connect4-game/
│
├── src/
│   ├── components/
│   ├── assets/
│   ├── styles/
│   └── gameLogic/
│
├── public/
├── package.json
└── README.md
🧠 Game Logic

The game continuously checks for:

Horizontal connections
Vertical connections
Diagonal (left-to-right) connections
Diagonal (right-to-left) connections

When four matching pieces are found consecutively, the game declares the winner and prevents further moves.

📸 Screenshots

Add screenshots of your game here:

![Game Board](screenshots/game-board.png)
🔮 Future Enhancements
🤖 Single-player mode with AI
🌐 Online multiplayer support
🎵 Sound effects and animations
🏅 Score tracking and leaderboard
🌙 Dark mode support
🤝 Contributing

Contributions are welcome!

Fork the repository
Create a new feature branch
Commit your changes
Push to your branch
Open a Pull Request
📄 License

This project is licensed under the MIT License. Feel free to use, modify, and distribute it.

👨‍💻 Author

Pon Saravanan

GitHub: https://github.com/your-username
LinkedIn: https://linkedin.com/in/your-profile
