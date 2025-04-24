# HabitEvolver

A modern habit tracking application that helps users build and maintain productive habits through gamification and progress visualization.

## Live Demo
Visit [HabitEvolver](https://habitevolver.netlify.app/) to see the application in action.

## Features

- 🎯 Goal Setting & Tracking
- 📊 Visual Progress Tracking with Charts
- 🏆 Achievement System & Rewards
- 📅 Calendar Integration
- 📝 Notes & Reflections
- 🔔 Smart Notifications
- 📱 Responsive Design

## Tech Stack

- **Frontend Framework**: React.js (Functional Components + Hooks)
- **Routing**: React Router v6
- **State Management**: React Context + Local Storage
- **UI Components**: Custom CSS with responsive design
- **API Integration**: REST API (JSONPlaceholder for demo)
- **Charts**: Recharts
- **Authentication**: Firebase Auth (planned)

## Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/nate769/habitEvolver23-0.git
cd habit-evolution
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_API_URL=your_api_url
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
habit-evolution/
├── src/
│   ├── assets/         # Images and static assets
│   ├── components/     # React components
│   ├── firebase.js     # Firebase configuration
│   └── App.jsx         # Main application component
├── public/             # Public assets
└── package.json        # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

The application is deployed on Netlify. Visit [HabitEvolver](https://habitevolver.netlify.app/) to see it in action.

## Screenshots

### Dashboard
![Dashboard](./src/assets/screenshots/dashboard.png)
Shows the main dashboard with goal tracking, progress visualization, and daily achievements.

### Calendar View
![Calendar](./src/assets/screenshots/calendar.png)
Monthly view of habit completion and streaks.

### Rewards Shop
![Rewards](./src/assets/screenshots/rewards.png)
Gamification elements where users can spend their earned points.
