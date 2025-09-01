class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
        this.waitingForNewInput = false;
    }

    updateDisplay() {
        this.display.value = this.currentInput;
    }

    clear() {
        this.currentInput = '0';
        this.operator = null;
        this.previousInput = null;
        this.waitingForNewInput = false;
        this.updateDisplay();
    }

    clearEntry() {
        this.currentInput = '0';
        this.waitingForNewInput = false;
        this.updateDisplay();
    }

    deleteLast() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.waitingForNewInput) {
            this.currentInput = number;
            this.waitingForNewInput = false;
        } else {
            this.currentInput = this.currentInput === '0' ? number : this.currentInput + number;
        }
        this.updateDisplay();
    }

    appendDecimal() {
        if (this.waitingForNewInput) {
            this.currentInput = '0.';
            this.waitingForNewInput = false;
        } else if (this.currentInput.indexOf('.') === -1) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }

    appendOperator(nextOperator) {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput === null) {
            this.previousInput = inputValue;
        } else if (this.operator) {
            const currentValue = this.previousInput || 0;
            const newValue = this.calculate(currentValue, inputValue, this.operator);

            this.currentInput = String(newValue);
            this.previousInput = newValue;
            this.updateDisplay();
        }

        this.waitingForNewInput = true;
        this.operator = nextOperator;
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case '+':
                return firstOperand + secondOperand;
            case '-':
                return firstOperand - secondOperand;
            case '*':
                return firstOperand * secondOperand;
            case '/':
                return secondOperand !== 0 ? firstOperand / secondOperand : 0;
            default:
                return secondOperand;
        }
    }

    performCalculation() {
        const inputValue = parseFloat(this.currentInput);

        if (this.previousInput !== null && this.operator) {
            const newValue = this.calculate(this.previousInput, inputValue, this.operator);
            
            this.currentInput = String(newValue);
            this.previousInput = null;
            this.operator = null;
            this.waitingForNewInput = true;
            this.updateDisplay();
        }
    }
}

// Initialize calculator
const calculator = new Calculator();

// Global functions for button onclick events
function clearDisplay() {
    calculator.clear();
}

function clearEntry() {
    calculator.clearEntry();
}

function deleteLast() {
    calculator.deleteLast();
}

function appendNumber(number) {
    calculator.appendNumber(number);
}

function appendDecimal() {
    calculator.appendDecimal();
}

function appendOperator(operator) {
    calculator.appendOperator(operator);
}

function calculate() {
    calculator.performCalculation();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Numbers
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    }
    // Operators
    else if (key === '+') {
        appendOperator('+');
    }
    else if (key === '-') {
        appendOperator('-');
    }
    else if (key === '*') {
        appendOperator('*');
    }
    else if (key === '/') {
        event.preventDefault(); // Prevent browser search
        appendOperator('/');
    }
    // Other keys
    else if (key === '.' || key === ',') {
        appendDecimal();
    }
    else if (key === 'Enter' || key === '=') {
        calculate();
    }
    else if (key === 'Escape') {
        clearDisplay();
    }
    else if (key === 'Backspace') {
        deleteLast();
    }
});