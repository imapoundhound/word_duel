# WordDuel 🎯

A multiplayer Wordle game built with React Native and Expo, supporting Android, iOS, Web, and Windows platforms.

## 🎮 Features

- **Multiplayer Mode**: Up to 4 players competing simultaneously
- **Real-time Gameplay**: Live updates and competitive scoring
- **Bot Players**: AI opponents for single-player practice
- **Cross-Platform**: Play on any device or browser
- **Beautiful UI**: Modern, responsive design with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI: `npm install -g @expo/cli`

### Installation
```bash
# Clone the repository
git clone <your-repo-url>
cd wordduel

# Install dependencies
npm install

# Start development server
npm start
```

## 📱 Platform Support

### Web Browser
```bash
npm run web
```
- Opens in your default browser
- Best for testing and development
- Responsive design for all screen sizes

### Android
```bash
npm run android
```
- Requires Android Studio and Android SDK
- Physical device or emulator
- APK builds available with `npm run build:android`

### iOS
```bash
npm run ios
```
- Requires macOS and Xcode
- iOS Simulator or physical device
- Build with `npm run build:ios`

### Windows
```bash
npm run windows
```
- Requires Windows 10/11 and Visual Studio
- UWP app support
- Build with `npm run build:windows`

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication and Realtime Database
3. Update `src/config/firebase.ts` with your project credentials

### Environment Variables
Create a `.env` file in the root directory:
```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
```

## 🏗️ Project Structure

```
wordduel/
├── src/
│   ├── components/          # React components
│   │   ├── GameBoard.tsx   # Main game interface
│   │   ├── GameRow.tsx     # Individual row component
│   │   ├── Keyboard.tsx    # Virtual keyboard
│   │   └── GameLobby.tsx  # Multiplayer lobby
│   ├── store/              # State management
│   │   └── gameStore.ts    # Zustand store
│   ├── types/              # TypeScript definitions
│   │   └── game.ts         # Game interfaces
│   ├── utils/              # Utility functions
│   │   └── wordValidation.ts # Word checking logic
│   └── config/             # Configuration files
│       └── firebase.ts     # Firebase setup
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── windows/                 # Windows-specific files
├── app.json                 # Expo configuration
├── package.json             # Dependencies
└── README.md               # This file
```

## 🎯 Game Rules

1. **Word Length**: 5 letters
2. **Attempts**: 6 guesses per player
3. **Scoring**: Fewer attempts = higher score
4. **Feedback**: 
   - 🟢 Green: Correct letter, correct position
   - 🟡 Yellow: Correct letter, wrong position
   - ⚫ Gray: Letter not in word

## 🚀 Deployment

### Web Deployment
```bash
npm run build:web
# Deploy the 'web-build' folder to your hosting service
```

### Mobile App Stores
```bash
# Android
npm run build:android

# iOS
npm run build:ios
```

### Windows Store
```bash
npm run build:windows
# Use Visual Studio to create app packages
```

## 🧪 Testing

```bash
# Run tests
npm test

# Lint code
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/wordduel/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/wordduel/discussions)
- **Documentation**: [Wiki](https://github.com/yourusername/wordduel/wiki)

## 🙏 Acknowledgments

- Inspired by the original Wordle game
- Built with React Native and Expo
- Powered by Firebase for real-time features

---

**Happy Wordling! 🎉**