# AGV Fleet Calculator - Bastian Solutions

A professional-grade AGV (Automated Guided Vehicle) fleet sizing calculator built with React.

## ✨ Features

- **Vehicle Selection**: Choose from comprehensive AGV database (Toyota, M10, ML2, CB18, Oppent)
- **Advanced Calculations**: Physics-based travel time, battery consumption, and fleet sizing
- **Interactive Charts**: Bar charts, pie charts, line graphs for route analysis
- **What-If Analysis**: Compare different availability targets and traffic scenarios
- **Executive Reports**: Professional summaries with recommendations
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🚀 Live Demo

[View Live Calculator](https://kmcmillin14.github.io/AGV_Fleet_Calculator)

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Build**: Modern ES modules with optimized bundling

## 📦 Installation

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
```

## 🎯 Usage

1. **Step 1**: Select AGV vehicle types for your fleet
2. **Step 2**: Configure system parameters (hours, availability, traffic)
3. **Step 3**: Define routes with distances and throughput requirements
4. **Step 4**: View comprehensive analysis with charts and recommendations

## 🏗️ Architecture

This calculator uses a modular React architecture to handle complex calculations without browser limitations:

- `/src/components/` - Reusable UI components
- `/src/data/` - AGV specifications database
- `/src/utils/` - Calculation engines and conversions
- `/src/App.jsx` - Main application logic

## 📊 Calculations

- **Fleet Sizing**: `⌈(Throughput ÷ Vehicles/Hour) ÷ Availability⌉`
- **Battery Analysis**: Amp draw × time + accessory usage
- **Travel Time**: Physics-based acceleration/deceleration modeling

## 🤝 Contributing

This is a professional tool for AGV fleet analysis. Contact for collaboration opportunities.

## 📄 License

© 2024 Bastian Solutions. Professional AGV fleet calculator.