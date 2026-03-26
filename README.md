<div align="center">

# <img src="https://www.theodinproject.com/assets/icons/odin-icon-22b41941.svg"> <br>

# ⚓ Battleship

**A classic browser-based Battleship game, meticulously crafted with Vanilla JavaScript for The Odin Project.**

[Live Demo](https://franchuphone.github.io/battleship/)

</div>

## 📖 Overview

This project is a browser-based implementation of the classic board game Battleship. Developed as part of The Odin Project’s JavaScript course, it showcases fundamental web development concepts including modular JavaScript, DOM manipulation, and interactive game logic. Players can engage in a strategic naval battle against an AI opponent directly in their web browser.

## ✨ Features

- Classic Gameplay: Enjoy the timeless strategy of Battleship directly in your browser.
- Intelligent AI Opponent: Challenge yourself against a computer player with logical attack patterns.
- Interactive Game Boards: Visually place your ships and launch attacks on a responsive grid.
- Clear Visual Feedback: Instantly see hits, misses, and sunken ships with distinct visual cues.
- Dynamic Game Flow: Start a new game at any time with randomly generated ship placements for both players.
- Responsive Design: Play seamlessly across various devices and screen sizes.
- Modular Codebase: Well-structured and maintainable JavaScript, promoting scalability and understanding.
- Robust Testing: Comprehensive unit and integration tests ensure game logic and functionality are sound.

## 🔧 Future improvements

- 🎯 **Computer AI**: add more logical attack pattern on hunt mode
- 🎯 **Upgrade UX**: fix some minors issues on positioning ships and allow ships re positioning
- 🎯 **VS Mode**: add 2 players mode with privacy switch

## 🛠️ Tech Stack

**Frontend:**

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

**Build Tools:**

![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black) ![Babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=black) ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white) ![NPM](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) [![Prettier](https://img.shields.io/badge/Prettier-F7BA3E?style=for-the-badge&logo=prettier&logoColor=white)](https://prettier.io/) [![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)](https://jestjs.io/)

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: `^14.x.x` or higher (includes npm)

### Installation

1.  **Clone the repository**

    ```bash
    git clone https://github.com/Franchuphone/battleship.git
    cd weather-app
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Start development server**

    ```bash
    npm run dev
    ```

4.  **Open your browser**
    Visit `http://localhost:8080` (or the port indicated in your console)

## 📁 Project Structure

```
battleship/
├── src/                    # All source code for the game logic and UI
│   ├── css/                # All style sheets
│   ├── fonts/              # Fonts folder
│   ├── html/               # Html templates
│   ├── img/                # Images folder
│   ├── js/                 # Game logic and ui manipulations
│   ├── index.js            # Entry point of the application
│   └── template.hmlt       # Main html file
├── dist/                   # Output directory for production builds
├── babel.config.js         # Babel configuration for JavaScript transpilation
├── eslint.config.mjs       # ESLint configuration for code quality
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Exact dependency versions
├── webpack.common.js       # Common Webpack settings
├── webpack.dev.js          # Webpack configuration for development mode
├── webpack.prod.js         # Webpack configuration for production build
└── README.md               # This file
```

## ⚙️ Configuration

### Linting and Formatting

This project uses ESLint for code linting and Prettier for code formatting.

- `eslint.config.mjs`: Configures ESLint rules and plugins.
- `prettier`: Configured indirectly via `eslint-config-prettier` to avoid conflicts.

### Build Configuration

Webpack is used to bundle the application.

- `webpack.common.js`: Contains shared Webpack configurations for both development and production.
- `webpack.dev.js`: Extends `webpack.common.js` with development-specific settings (e.g., `webpack-dev-server`).
- `webpack.prod.js`: Extends `webpack.common.js` with production-specific optimizations.
- `babel.config.js`: Configures Babel to transpile modern JavaScript features for wider browser compatibility.

## 🚀 Deployment

### Production Build

To create a minified and optimized production build of the application:

```bash
npm run build
```

This command will compile all assets and output them into the `dist/` directory, ready for deployment.

### Deployment Options

The `dist/` directory contains all the static files required to run the application. You can deploy these files to any static hosting service, such as:

- **GitHub Pages**: Push the `dist` folder content to a `gh-pages` branch.
- **Vercel/Netlify**: These services can automatically detect the build process and deploy the `dist` folder.
- **Any Web Server**: Simply copy the contents of the `dist` folder to your web server's public directory.

## 🤝 Contributing

We welcome contributions to the Weather App! If you're interested in improving the project, please consider:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Commit your changes following a clear commit message convention.
4.  Push your branch and open a pull request.

### Development Setup for Contributors

The development setup is straightforward, as outlined in the [Quick Start](#🚀-quick-start) section. Ensure you have Node.js and npm installed, and then follow the installation steps.

## 📄 License

No particular license, just keep in mind to respect the work of others and just point to this repository for credentials.

## 🙏 Acknowledgments

- **The Odin Project**: For providing an excellent curriculum and guiding this project's development.
- **[date-fns](https://date-fns.org/)**: For providing a comprehensive and easy-to-use library for date manipulation.
- **[Webpack](https://webpack.js.org/)**: For the powerful and flexible module bundler.
- **[Babel](https://babeljs.io/)**: For enabling the use of modern JavaScript features.

## 📞 Support & Contact

- 🐛 Issues: [GitHub Issues](https://github.com/Franchuphone/battleship/issues)
- 👤 Author: [Franchuphone](https://github.com/Franchuphone)
- 📧 Contact: [LinkedIn](https://chk.me/fDTZdvK)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Franchuphone

</div>
