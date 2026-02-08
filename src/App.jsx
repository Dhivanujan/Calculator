import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [currentOperand, setCurrentOperand] = useState('');
  const [previousOperand, setPreviousOperand] = useState('');
  const [operation, setOperation] = useState(null);
  const [overwrite, setOverwrite] = useState(false);

  const clear = () => {
    setCurrentOperand('');
    setPreviousOperand('');
    setOperation(null);
    setOverwrite(false);
  };

  const deleteDigit = () => {
    if (overwrite) {
      setCurrentOperand('');
      setOverwrite(false);
      return;
    }
    if (currentOperand === 'Error') {
      setCurrentOperand('');
      return;
    }
    if (currentOperand === '') return;
    setCurrentOperand(currentOperand.slice(0, -1));
  };

  const appendNumber = (number) => {
    if (currentOperand === 'Error') {
      setCurrentOperand(number);
      return; 
    }
    if (number === '.' && currentOperand.includes('.')) return;
    if (overwrite) {
      setCurrentOperand(number);
      setOverwrite(false);
    } else {
      setCurrentOperand(currentOperand + number);
    }
  };

  const appendConstant = (constant) => {
    if (overwrite) {
      setCurrentOperand(constant.toString());
      setOverwrite(false);
    } else {
      if (currentOperand === '0' || currentOperand === 'Error') {
        setCurrentOperand(constant.toString());
      } else {
        setCurrentOperand(currentOperand + constant.toString());
      }
    }
  };

  // Helper to compute result
  const compute = (prev, current, op) => {
    const p = parseFloat(prev);
    const c = parseFloat(current);
    if (isNaN(p) || isNaN(c)) return '';
    
    let computation = '';
    switch (op) {
      case '+': computation = p + c; break;
      case '-': computation = p - c; break;
      case '*': computation = p * c; break;
      case '÷': 
      case '/': 
        if (c === 0) return 'Error';
        computation = p / c; 
        break;
      case '^': computation = Math.pow(p, c); break;
      default: return '';
    }
    
    // rounding
    if(computation !== 'Error') {
       return (Math.round(computation * 10000000000) / 10000000000).toString();
    }
    return computation;
  };

  const unaryOperation = (operation) => {
    if (currentOperand === '' || currentOperand === 'Error') return;
    const current = parseFloat(currentOperand);
    if (isNaN(current)) return;
    
    let result = 0;
    switch (operation) {
      case '√': 
        if (current < 0) {
            setCurrentOperand('Error'); 
            return;
        }
        result = Math.sqrt(current); 
        break;
      case 'x²': result = Math.pow(current, 2); break;
      case 'log': 
        if (current <= 0) {
           setCurrentOperand('Error');
           return;
        }
        result = Math.log10(current); 
        break;
      case 'ln':
        if (current <= 0) {
            setCurrentOperand('Error');
            return;
         } 
         result = Math.log(current); 
         break;
      case '%': result = current / 100; break;
      default: return;
    }
    
    if (isNaN(result) || !isFinite(result)) {
        setCurrentOperand('Error');
    } else {
        setCurrentOperand((Math.round(result * 10000000000) / 10000000000).toString());
    }
    setOverwrite(true);
  };

  const chooseOperation = (op) => {
    if (currentOperand === '' && previousOperand === '') return;
    
    // Change operation if clicked after just selecting one
    if (currentOperand === '') {
      setOperation(op);
      return;
    }

    if (previousOperand !== '') {
      const result = compute(previousOperand, currentOperand, operation);
      setPreviousOperand(result);
      setOperation(op);
      setCurrentOperand('');
    } else {
      setOperation(op);
      setPreviousOperand(currentOperand);
      setCurrentOperand('');
    }
  };

  const evaluate = () => {
    if (operation === null || currentOperand === '' || previousOperand === '') return;
    
    const result = compute(previousOperand, currentOperand, operation);
    
    setCurrentOperand(result);
    setOperation(null);
    setPreviousOperand('');
    setOverwrite(true);
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
      } else if (e.key === '.') {
        appendNumber('.');
      } else if (['+', '-', '*', '/'].includes(e.key)) {
        chooseOperation(e.key);
      } else if (e.key === '^') {
        chooseOperation('^');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        evaluate();
      } else if (e.key === 'Backspace') {
        deleteDigit();
      } else if (e.key === 'Escape') {
        clear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentOperand, previousOperand, operation, overwrite]);

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {previousOperand} {operation}
        </div>
        <div className="current-operand">{currentOperand || '0'}</div>
      </div>
      
      {/* Row 1 */}
      <button className="scientific-btn" onClick={() => unaryOperation('√')}>√</button>
      <button className="control-btn" onClick={clear}>AC</button>
      <button className="control-btn" onClick={deleteDigit}>DEL</button>
      <button className="scientific-btn" onClick={() => unaryOperation('%')}>%</button>
      <button className="operator-btn" onClick={() => chooseOperation('/')}>÷</button>

      {/* Row 2 */}
      <button className="scientific-btn" onClick={() => unaryOperation('x²')}>x²</button>
      <button className="number-btn" onClick={() => appendNumber('7')}>7</button>
      <button className="number-btn" onClick={() => appendNumber('8')}>8</button>
      <button className="number-btn" onClick={() => appendNumber('9')}>9</button>
      <button className="operator-btn" onClick={() => chooseOperation('*')}>×</button>

      {/* Row 3 */}
      <button className="scientific-btn" onClick={() => chooseOperation('^')}>x^y</button>
      <button className="number-btn" onClick={() => appendNumber('4')}>4</button>
      <button className="number-btn" onClick={() => appendNumber('5')}>5</button>
      <button className="number-btn" onClick={() => appendNumber('6')}>6</button>
      <button className="operator-btn" onClick={() => chooseOperation('-')}>-</button>

      {/* Row 4 */}
      <button className="scientific-btn" onClick={() => unaryOperation('log')}>log</button>
      <button className="number-btn" onClick={() => appendNumber('1')}>1</button>
      <button className="number-btn" onClick={() => appendNumber('2')}>2</button>
      <button className="number-btn" onClick={() => appendNumber('3')}>3</button>
      <button className="operator-btn" onClick={() => chooseOperation('+')}>+</button>

      {/* Row 5 */}
      <button className="scientific-btn" onClick={() => unaryOperation('ln')}>ln</button>
      <button className="number-btn" onClick={() => appendNumber('.')}>.</button>
      <button className="number-btn" onClick={() => appendNumber('0')}>0</button>
      <button className="scientific-btn" onClick={() => appendConstant(Math.PI)}>π</button>
      <button className="span-two operator-btn" style={{gridColumn: 'span 1'}} onClick={evaluate}>=</button>
    </div>
  );
}

export default App;
