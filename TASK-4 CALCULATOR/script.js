// Basic calculator logic: supports chaining, keyboard, +/- toggle, percent, clear, delete (Backspace)
const currentEl = document.getElementById('current');
const previousEl = document.getElementById('previous');
const keys = document.querySelectorAll('.btn');

let current = '0';
let previous = null;
let operation = null;
let overwrite = false;

function updateDisplay(){
  currentEl.textContent = current;
  previousEl.textContent = previous !== null && operation ? `${previous} ${operation}` : '';
}

function appendNumber(num){
  if (overwrite) {
    current = '0';
    overwrite = false;
  }
  if (num === '.' && current.includes('.')) return;
  if (current === '0' && num !== '.') current = num;
  else current = current + num;
}

function chooseOperation(op){
  if (operation !== null && !overwrite) {
    compute();
  }
  previous = current;
  operation = op;
  overwrite = true;
}

function compute(){
  if (operation === null || previous === null) return;
  const prev = parseFloat(previous);
  const curr = parseFloat(current);
  if (Number.isNaN(prev) || Number.isNaN(curr)) return;
  let result = 0;
  switch(operation){
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = curr === 0 ? 'Error' : prev / curr; break;
    default: return;
  }
  current = (result === 'Error') ? 'Error' : String(Number(result.toPrecision(12))).replace(/\.0+$|(\.\d*[1-9])0+$/,'$1');
  operation = null;
  previous = null;
  overwrite = true;
}

function clearAll(){
  current = '0';
  previous = null;
  operation = null;
  overwrite = false;
}

function del(){
  if (overwrite || current === 'Error') { current = '0'; overwrite = false; return; }
  if (current.length === 1) current = '0';
  else current = current.slice(0,-1);
}

function toggleSign(){
  if (current === '0' || current === 'Error') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
}

function percent(){
  if (current === 'Error') return;
  current = String(parseFloat(current) / 100);
  overwrite = true;
}

// Button clicks
keys.forEach(button => {
  if (button.hasAttribute('data-number')) {
    button.addEventListener('click', () => {
      appendNumber(button.getAttribute('data-number'));
      updateDisplay();
    });
  } else if (button.classList.contains('operator')) {
    button.addEventListener('click', () => {
      chooseOperation(button.getAttribute('data-action'));
      updateDisplay();
    });
  } else if (button.classList.contains('equals')) {
    button.addEventListener('click', () => {
      compute();
      updateDisplay();
    });
  } else if (button.dataset.action) {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      if (action === 'clear') clearAll();
      else if (action === 'toggle-sign') toggleSign();
      else if (action === 'percent') percent();
      else if (action === '/') { chooseOperation('/'); }
      updateDisplay();
    });
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') {
    appendNumber(e.key);
    updateDisplay();
    return;
  }
  if (e.key === '.') { appendNumber('.'); updateDisplay(); return; }
  if (e.key === 'Enter' || e.key === '=') { compute(); updateDisplay(); e.preventDefault(); return; }
  if (['+', '-', '*', '/'].includes(e.key)) {
    chooseOperation(e.key);
    updateDisplay();
    return;
  }
  if (e.key === 'Backspace') { del(); updateDisplay(); return; }
  if (e.key === 'Escape') { clearAll(); updateDisplay(); return; }
  if (e.key === '%') { percent(); updateDisplay(); return; }
});

// Initialize
updateDisplay();