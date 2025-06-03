# AboutMePlus

> A modern, interactive personal profile and real-time quiz web application

**GitHub:** [@Jackksonns](https://github.com/Jackksonns)

## 🌟 Project Overview
AboutMePlus is an open-source web application that combines a beautiful personal homepage, a detailed self-introduction, and a real-time online quiz game. It is designed for students, developers, and anyone who wants to showcase themselves and have fun with friends through knowledge challenges.

- **Personal Introduction**: Brief and detailed self-introduction pages.
- **Real-time Quiz Game**: Challenge online users in a fast-paced quiz battle.
- **Modern UI**: Responsive, mobile-friendly, and visually appealing.

## 🚀 Features
- **Home Page**: Showcases education background and major courses.
- **About Me Page**: Deeper insight into academic interests, achievements, and personal growth.
- **Quiz Game**: Multiplayer, real-time quiz with live score updates and challenge system.
- **Socket.io Integration**: Real-time communication for seamless gameplay.
- **Express + EJS**: Server-side rendering and routing.
- **Responsive Design**: Works on both desktop and mobile devices.

## 🏗️ Project Structure
```
├── assets/
│   └── figure-1-logical-diagram.png   # System architecture diagram
├── node_modules/
├── public/
│   ├── about.html                     # Detailed introduction page
│   ├── index.html                     # Personal introduction page
│   ├── photo.png                      # Profile photo
│   └── project.css                    # Main stylesheet
├── views/
│   └── welcomeQuiz.ejs                # Quiz game page (EJS template)
├── quiz.js                            # Main server logic (Express + Socket.io)
├── package.json                       # Project dependencies
├── package-lock.json
├── README.md                          # This file
└── ProjectReport.md                   # Original course report
```

## 🛠️ Tech Stack
- **Backend**: Node.js, Express, Socket.io
- **Frontend**: HTML, CSS (Bootstrap), EJS, JavaScript
- **Templating**: EJS
- **Real-time**: Socket.io

## ⚡ Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/Jackksonns/AboutMePlus.git
   cd AboutMePlus
   ```
2. **Install dependencies**
   
   Make sure you have [Node.js](https://nodejs.org/) installed. Then install the required packages:
   ```bash
   npm install express ejs socket.io
   ```
   Or simply run:
   ```bash
   npm install
   ```
   (All dependencies are listed in package.json)
3. **Start the server**
   You can use either of the following commands:
   ```bash
   node quiz.js
   # or
   npm start
   ```
4. **Open your browser**
   Visit [http://localhost:8080](http://localhost:8080)

## 📄 Main Pages & Usage
- **/index.html**: Brief personal introduction
- **/about.html**: Detailed self-introduction
- **/welcomeQuiz**: Real-time quiz game (enter your name, challenge online users, answer questions, see live scores)

## 🖼️ System Architecture
See `assets/figure-1-logical-diagram.png` for a visual overview of the application's logic and data flow.

## 🤝 Contributing
Contributions are welcome! Feel free to fork the repo, submit issues, or open pull requests.

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## 📜 License
This project is licensed under the MIT License.

## 🙏 Acknowledgements
- Inspired by modern web design and real-time multiplayer quiz games.
- Thanks to all contributors and users!

---
For any questions or suggestions, feel free to open an issue or contact the maintainer. 