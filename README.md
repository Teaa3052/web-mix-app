# Web Application for Mixture Calculation

A web application for calculating optimal mixing ratios of components with different intensities to achieve a desired average intensity. Built with React and Flask.

## 📋 Overview

This application implements the **Alligation method** (mixture calculation) to determine the precise ratios needed when mixing 2-4 components of different properties (e.g., alcohol strength, metal purity, concentration) to achieve a target average value.

### Features

- **Simple Mix Calculator**: Calculate mixing ratios for 2 components
- **Complex Mix Calculator**: Calculate mixing ratios for 3-4 components
- **Multiple Solutions**: For 4 components with equal distribution (2+2 scenario), generates multiple valid solutions
- **Visual Representation**: Pie chart visualization of component proportions
- **Input Validation**: Client-side and server-side validation
- **Responsive Design**: Works on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask server will start on `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

The React app will start on `http://localhost:3000`

## 🏗️ Project Structure
```
web-mix-app/
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── routes/
│   │   ├── simple_mix.py      # Simple mixture calculation endpoint
│   │   └── complex_mix.py     # Complex mixture calculation endpoint
│   └── requirements.txt       # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx       # Landing page
│   │   │   ├── SimpleMixForm.jsx    # Form for 2 components
│   │   │   ├── ComplexMixForm.jsx   # Form for 3-4 components
│   │   │   └── HowItWorks.jsx       # Tutorial page
│   │   ├── components/
│   │   │   └── MixPieChart.jsx      # Visualization component
│   │   ├── theme/
│   │   │   └── theme.js             # Material-UI theme
│   │   └── App.jsx
│   └── package.json           # Node dependencies
```

## 💡 How It Works

### Mathematical Foundation

The application uses the schematic method for mixture calculations:

**For 2 components:**
- Component ratio = |other_component - target| : |target - this_component|
- Example: Mix 70% and 95% alcohol to get 85%
  - Ratio = |95-85| : |85-70| = 10:15 = 2:3

**For 3-4 components:**
- Components are classified as "worse" (< target) and "better" (> target)
- Different pairing scenarios:
  - **2+2 scenario**: Two pairing options (generates 2 solutions)
  - **3+1 scenario**: Three worse with one better (generates 1 solution)
  - **1+3 scenario**: One worse with three better (generates 1 solution)

### Algorithm

1. Sort components by intensity
2. Classify into "worse" and "better" groups
3. Pair components according to scenario
4. Calculate ratios using diagonal differences
5. Apply GCD simplification
6. Calculate final quantities using the division method

## 📊 Example Usage

### Simple Mix Example

**Input:**
- Component 1: 70% alcohol
- Component 2: 95% alcohol
- Target: 85% alcohol
- Total quantity: 230L

**Output:**
- Component 1: 92L (2 parts)
- Component 2: 138L (3 parts)
- Ratio: 2:3

### Complex Mix Example

**Input:**
- Component 1: 650‰ silver
- Component 2: 720‰ silver
- Component 3: 850‰ silver
- Component 4: 920‰ silver
- Target: 800‰
- Total quantity: 10kg

**Output (First choice):**
- Component 1: 3kg
- Component 2: 1.25kg
- Component 3: 2kg
- Component 4: 3.75kg
- Ratio: 12:5:8:15

## 🛠️ Technologies Used

### Frontend
- **React** - UI library
- **Material-UI (MUI)** - Component library and styling
- **Recharts** - Chart visualization
- **React Router** - Navigation

### Backend
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin resource sharing

## 📝 API Documentation

### Simple Mix Endpoint
```
POST /api/mix/simple
```

**Request Body:**
```json
{
  "a1": 70,
  "a2": 95,
  "m": 85,
  "S": 230
}
```

**Response:**
```json
{
  "quantities": [92.0, 138.0],
  "quantities_formatted": ["92.00", "138.00"],
  "simplified_ratio": "2 : 3"
}
```

### Complex Mix Endpoint
```
POST /api/mix/complex
```

**Request Body:**
```json
{
  "components": [
    {"name": "Component 1", "intensity": 650},
    {"name": "Component 2", "intensity": 720},
    {"name": "Component 3", "intensity": 850},
    {"name": "Component 4", "intensity": 920}
  ],
  "total_amount": 10,
  "desired_intensity": 800
}
```

**Response:**
```json
{
  "total_amount": 10,
  "method_details": {
    "all_solutions": [
      {
        "quantities": [3.0, 1.25, 2.0, 3.75],
        "simplified_ratio": "12 : 5 : 8 : 15",
        "combination_used": "Prvi izbor"
      }
    ],
    "valid_solutions_count": 2
  }
}
```

## 🔮 Future Enhancements

- Support for more than 4 components
- Multiple optimization criteria (cost, environmental impact)
- Export results to PDF/Excel
- Database for predefined components
- Mobile application
- Multi-language support

## 👤 Author

Tea Kirin - Final Year Project

## 📄 License

This project was created as a final year project for educational purposes.

## 🙏 Acknowledgments

- Theoretical foundation based on mixture calculation methodology from educational materials
- Schematic method implementation following standard mathematical procedures