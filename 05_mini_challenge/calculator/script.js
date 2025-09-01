// Calculator functionality
let display = document.getElementById('result');
let currentInput = '';
let operator = '';
let previousInput = '';

// Append number or operator to display
function appendToDisplay(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

// Clear the entire display
function clearDisplay() {
    display.value = '';
    currentInput = '';
    operator = '';
    previousInput = '';
}

// Delete the last character
function deleteLast() {
    display.value = display.value.slice(0, -1);
}

// Calculate the result
function calculate() {
    try {
        // Check if display has content
        if (!display.value || display.value.trim() === '') {
            return;
        }
        
        // Basic security check - only allow numbers, operators, and decimal points
        if (/^[0-9+\-*/.() ]+$/.test(display.value)) {
            let result = eval(display.value);
            
            // Handle division by zero and invalid results
            if (!isFinite(result)) {
                display.value = 'Error';
                return;
            }
            
            // Round to avoid floating point precision issues
            display.value = Math.round(result * 100000000) / 100000000;
        } else {
            display.value = 'Error';
        }
    } catch (error) {
        display.value = 'Error';
    }
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers and decimal point
    if (key >= '0' && key <= '9' || key === '.') {
        appendToDisplay(key);
    }
    
    // Operators
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    }
    
    // Enter or equals for calculation
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    }
    
    // Escape or 'c' for clear
    else if (key === 'Escape' || key.toLowerCase() === 'c') {
        clearDisplay();
    }
    
    // Backspace for delete
    else if (key === 'Backspace') {
        deleteLast();
    }
});

// Initialize display
window.onload = function() {
    display.value = '';
};