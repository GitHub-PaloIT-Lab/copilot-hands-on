# Calculator App

A simple, responsive calculator application built with HTML, CSS, and JavaScript.

## Features

- ✅ Basic arithmetic operations (+, -, ×, ÷)
- ✅ Clear (C) and Clear Entry (CE) functions
- ✅ Backspace functionality
- ✅ Decimal point support
- ✅ Keyboard support
- ✅ Responsive design
- ✅ Color-coded buttons:
  - **Number buttons**: White color
  - **Action buttons**: Blue color
  - **Equals button**: Orange color

## How to Use

### Mouse/Touch:
- Click on number buttons (0-9) to input numbers
- Click on operator buttons (+, -, ×, ÷) to perform operations
- Click the equals button (=) to calculate the result
- Use C to clear everything, CE to clear current entry
- Use ⌫ to delete the last entered digit

### Keyboard:
- Use number keys (0-9) to input numbers
- Use +, -, *, / for operations
- Press Enter or = to calculate
- Press Escape to clear everything
- Press Backspace to delete last digit
- Use . or , for decimal point

## Running the Calculator

Simply open the `index.html` file in any modern web browser. No build process or server required!

```bash
# Option 1: Double-click the index.html file
# Option 2: Open with your browser directly
# Option 3: Use a local server (optional)
python -m http.server 8000
# Then open http://localhost:8000
```

## File Structure

```
calculator-app/
├── index.html    # Main HTML structure
├── style.css     # Styling and layout
├── script.js     # Calculator functionality
└── README.md     # This file
```

## Technical Details

- **HTML**: Semantic structure with accessibility in mind
- **CSS**: Grid layout for buttons, responsive design, smooth animations
- **JavaScript**: Class-based calculator logic with error handling
- **No Dependencies**: Pure vanilla JavaScript, no frameworks required

## Color Scheme

- **Number Buttons (0-9, .)**: White background with dark text
- **Action Buttons (C, CE, ⌫, +, -, ×, ÷)**: Blue background with white text  
- **Equals Button (=)**: Orange background with white text
- **Display**: Dark background with white text

## Browser Compatibility

Works on all modern browsers including:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Created for

GitHub Copilot Hands-on Workshop - Demonstrating AI-assisted development