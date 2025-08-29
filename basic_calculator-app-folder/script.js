document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display-text');
    const buttons = document.querySelectorAll('.button');
    const messageBox = document.getElementById('message-box');

    let currentExpression = '0';
    let expectingNewNumber = false; // Flag to clear display after an operation or equals

    // Function to show a temporary message
    function showMessage(message, duration = 2000) {
        messageBox.textContent = message;
        messageBox.classList.add('show');
        setTimeout(() => {
            messageBox.classList.remove('show');
        }, duration);
    }

    // Update display content
    function updateDisplay() {
        display.textContent = currentExpression;
    }

    // Evaluate the expression
    function calculateResult() {
        try {
            // Replace ÷ with / and × with * for eval()
            let expressionToEvaluate = currentExpression.replace(/÷/g, '/').replace(/×/g, '*').replace(/−/g, '-');

            // Handle expressions starting with an operator (e.g., "+5")
            // This prevents errors from `eval` if the user types '+5' without a leading number
            if (['+', '-', '*', '/'].includes(expressionToEvaluate[0])) {
                expressionToEvaluate = '0' + expressionToEvaluate;
            }

            // Basic check for consecutive operators
            if (/[+\-*/÷×−]{2,}/.test(expressionToEvaluate)) {
                 showMessage("Syntax Error: Consecutive operators", 3000);
                 currentExpression = '0';
                 expectingNewNumber = false;
                 updateDisplay();
                 return;
            }

            // Check for expressions ending with an operator
            if (['+', '-', '*', '/'].includes(expressionToEvaluate[expressionToEvaluate.length - 1])) {
                showMessage("Syntax Error: Expression ends with operator", 3000);
                currentExpression = '0';
                expectingNewNumber = false;
                updateDisplay();
                return;
            }

            const result = eval(expressionToEvaluate);
            if (isNaN(result) || !isFinite(result)) {
                showMessage("Error: Invalid calculation", 3000);
                currentExpression = '0';
            } else {
                currentExpression = result.toString();
            }
        } catch (error) {
            showMessage("Error: " + error.message, 3000);
            currentExpression = '0';
        } finally {
            expectingNewNumber = true; // Ready for a new number after calculation
            updateDisplay();
        }
    }

    // Handle button clicks
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.dataset.value;

            if (value === 'C') {
                currentExpression = '0';
                expectingNewNumber = false;
            } else if (value === '=') {
                calculateResult();
            } else if (['+', '−', '×', '÷'].includes(value)) {
                // If previous input was an operator or equals, and the current display is a result,
                // simply replace the last operator if consecutive operator is pressed
                if (expectingNewNumber && currentExpression !== '0' && !['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                    currentExpression += value;
                    expectingNewNumber = false; // Expecting a new number now
                } else if (['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                     // Replace the last operator if a new one is pressed
                    currentExpression = currentExpression.slice(0, -1) + value;
                } else {
                    currentExpression += value;
                    expectingNewNumber = false;
                }
            } else if (value === '.') {
                // Prevent multiple decimals in a single number
                const lastNumber = currentExpression.split(/[\+\−×÷]/).pop();
                if (!lastNumber.includes('.')) {
                    currentExpression += value;
                }
            } else { // Numbers
                if (currentExpression === '0' || expectingNewNumber) {
                    currentExpression = value;
                    expectingNewNumber = false;
                } else {
                    currentExpression += value;
                }
            }
            updateDisplay();
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key >= '0' && key <= '9') {
            if (currentExpression === '0' || expectingNewNumber) {
                currentExpression = key;
                expectingNewNumber = false;
            } else {
                currentExpression += key;
            }
        } else if (key === '.') {
            const lastNumber = currentExpression.split(/[\+\−×÷]/).pop();
            if (!lastNumber.includes('.')) {
                currentExpression += key;
            }
        } else if (key === '+' || key === '-') {
            if (expectingNewNumber && currentExpression !== '0' && !['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                currentExpression += key;
                expectingNewNumber = false;
            } else if (['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                 currentExpression = currentExpression.slice(0, -1) + key;
            } else {
                currentExpression += key;
                expectingNewNumber = false;
            }
        } else if (key === '*' || key === 'x') {
            if (expectingNewNumber && currentExpression !== '0' && !['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                currentExpression += '×'; // Use the multiplication symbol
                expectingNewNumber = false;
            } else if (['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                 currentExpression = currentExpression.slice(0, -1) + '×';
            } else {
                currentExpression += '×';
                expectingNewNumber = false;
            }
        } else if (key === '/') {
            if (expectingNewNumber && currentExpression !== '0' && !['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                currentExpression += '÷'; // Use the division symbol
                expectingNewNumber = false;
            } else if (['+', '−', '×', '÷'].includes(currentExpression.slice(-1))) {
                 currentExpression = currentExpression.slice(0, -1) + '÷';
            } else {
                currentExpression += '÷';
                expectingNewNumber = false;
            }
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
            calculateResult();
        } else if (key === 'Backspace') {
            if (currentExpression.length === 1 || expectingNewNumber) {
                currentExpression = '0';
                expectingNewNumber = false;
            } else {
                currentExpression = currentExpression.slice(0, -1);
            }
        } else if (key === 'Escape' || key === 'Delete') {
            currentExpression = '0';
            expectingNewNumber = false;
        }
        updateDisplay();
    });
});
