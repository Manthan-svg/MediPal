# MediPal Frontend

A modern React-based frontend application for the MediPal health management system. Built with Vite, React 19, and Tailwind CSS, this frontend provides an intuitive user interface for managing health routines, medications, and wellness tracking.

---

## Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [Component Overview](#component-overview)
- [Key Features](#key-features)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview
MediPal Frontend is designed to provide users with:
- **Health Dashboard**: Visual overview of daily health metrics
- **Medication Management**: Track and manage medication schedules
- **Health Routine Tracking**: Monitor water intake, exercise, sleep, steps, and meditation
- **Responsive Design**: Mobile-first approach for accessibility across devices
- **Real-time Updates**: Dynamic data visualization and progress tracking

---

## Tech Stack
- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React & React Icons
- **Charts**: Recharts for data visualization
- **Carousel**: Swiper for interactive components
- **Build Tool**: Vite for fast development and optimized builds
- **Linting**: ESLint with React-specific rules

---

## Folder Structure
```
Frontend/
  ├── public/                 # Static assets
  ├── src/
  │   ├── components/         # Reusable UI components
  │   │   ├── HomeComponent.jsx      # Main dashboard component
  │   │   └── MedicationComponent.jsx # Medication management
  │   ├── pages/              # Page-level components
  │   │   ├── HealthCard.jsx         # Health metrics card
  │   │   └── Navbar.jsx             # Navigation component
  │   ├── App.jsx             # Main application component
  │   ├── main.jsx            # Application entry point
  │   └── index.css           # Global styles
  ├── package.json            # Dependencies and scripts
  ├── vite.config.js          # Vite configuration
  ├── eslint.config.js        # ESLint configuration
  └── index.html              # HTML template
```

---

## Installation & Setup
1. **Navigate to the Frontend directory:**
   ```bash
   cd MediPal/Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   - Ensure the Backend server is running on port 5000
   - The frontend will automatically connect to the backend API

---

## Running the Application

### Development Mode
```bash
npm run dev
```
The application will start on `http://localhost:5173` by default.

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

---

## Component Overview

### Core Components

#### `HomeComponent.jsx`
- **Purpose**: Main dashboard displaying health metrics and overview
- **Features**:
  - Health routine tracking cards
  - Progress visualization
  - Quick action buttons
  - Responsive layout

#### `MedicationComponent.jsx`
- **Purpose**: Medication management interface
- **Features**:
  - Add new medications
  - View medication schedule
  - Mark medications as taken
  - Medication history tracking

### Page Components

#### `HealthCard.jsx`
- **Purpose**: Individual health metric display
- **Usage**: Reusable card component for health data

#### `Navbar.jsx`
- **Purpose**: Navigation header
- **Features**: User navigation and app branding

---

## Key Features

### 1. **Responsive Design**
- Mobile-first approach using Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements

### 2. **Health Dashboard**
- Visual progress indicators
- Real-time health metric tracking
- Interactive charts and graphs
- Quick access to daily routines

### 3. **Medication Management**
- Intuitive medication scheduling
- Reminder system integration
- Medication history and logs
- Easy medication status updates

### 4. **Modern UI/UX**
- Clean, minimalist design
- Smooth animations and transitions
- Consistent color scheme and typography
- Accessibility considerations

### 5. **Performance Optimized**
- Vite for fast development builds
- Code splitting and lazy loading
- Optimized bundle sizes
- Efficient re-rendering with React 19

---

## Development

### Code Style
- ESLint configuration for consistent code quality
- React Hooks best practices
- Component-based architecture
- Semantic HTML structure

### Adding New Components
1. Create component in `src/components/`
2. Follow naming convention: `ComponentName.jsx`
3. Export as default export
4. Import and use in `App.jsx` or other components

### Styling Guidelines
- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Maintain consistent spacing and typography
- Use semantic color variables

---

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Follow the existing code style and patterns
4. Test your changes thoroughly
5. Commit your changes with descriptive messages
6. Push to your branch and open a Pull Request

### Development Checklist
- [ ] Code follows ESLint rules
- [ ] Components are responsive
- [ ] No console errors or warnings
- [ ] Accessibility standards met
- [ ] Performance optimized

---

## License
This project is licensed under the ISC License.
