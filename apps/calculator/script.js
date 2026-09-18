const displayExpression = document.getElementById('display-expression');
const displayResult = document.getElementById('display-result');
const keys = document.querySelectorAll('.key');
const closeBtn = document.querySelector('.close-btn');

let current = '0';
let previous = null;
let operator = null;
let overwrite = true;

const operatorSymbols = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
};

closeBtn.addEventListener('click', () => {
  window.parent.postMessage({ appName: 'calculator', action: 'close' }, window.location.origin);
  window.close();
});

function trimResult(num) {
  return parseFloat(num.toFixed(8)).toString();
}

function updateDisplay() {
  displayResult.textContent = current;
  displayExpression.textContent =
    previous !== null && operator ? `${previous} ${operatorSymbols[operator]}` : '';
}

function inputDigit(digit) {
  if (overwrite) {
    current = digit === '.' ? '0.' : digit;
    overwrite = false;
    return;
  }
  if (digit === '.' && current.includes('.')) return;
  current = current === '0' && digit !== '.' ? digit : current + digit;
}

function chooseOperator(op) {
  if (operator && !overwrite) {
    calculate();
  }
  previous = current;
  operator = op;
  overwrite = true;
}

function calculate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case 'add':
      result = a + b;
      break;
    case 'subtract':
      result = a - b;
      break;
    case 'multiply':
      result = a * b;
      break;
    case 'divide':
      result = b === 0 ? NaN : a / b;
      break;
    default:
      return;
  }

  current = Number.isFinite(result) ? trimResult(result) : 'Error';
  operator = null;
  previous = null;
  overwrite = true;
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  overwrite = true;
}

function toggleSign() {
  if (current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : `-${current}`;
}

function inputPercent() {
  current = trimResult(parseFloat(current) / 100);
}

keys.forEach((key) => {
  key.addEventListener('click', () => {
    const { action, value } = key.dataset;

    if (value !== undefined) {
      inputDigit(value);
    } else if (action) {
      switch (action) {
        case 'clear':
          clearAll();
          break;
        case 'negate':
          toggleSign();
          break;
        case 'percent':
          inputPercent();
          break;
        case 'equals':
          calculate();
          break;
        default:
          chooseOperator(action);
      }
    }

    updateDisplay();
  });
});

window.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) {
    inputDigit(event.key);
  } else if (event.key === '.') {
    inputDigit('.');
  } else if (event.key === '+') {
    chooseOperator('add');
  } else if (event.key === '-') {
    chooseOperator('subtract');
  } else if (event.key === '*') {
    chooseOperator('multiply');
  } else if (event.key === '/') {
    event.preventDefault();
    chooseOperator('divide');
  } else if (event.key === 'Enter' || event.key === '=') {
    calculate();
  } else if (event.key === 'Escape') {
    clearAll();
  } else if (event.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    overwrite = current === '0';
  } else {
    return;
  }
  updateDisplay();
});

updateDisplay();