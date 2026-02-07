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
      case '/': 
        if (c === 0) return 'Error';
        computation = p / c; 
        break;
      default: return '';
    }
    
    // rounding
    if(computation !== 'Error') {
       return (Math.round(computation * 100000000) / 100000000).toString();
    }
    return computation;
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
      <button className="span-two" onClick={clear}>AC</button>
      <button onClick={deleteDigit}>DEL</button>
      <button onClick={() => chooseOperation('/')}>/</button>
      <button onClick={() => appendNumber('1')}>1</button>
      <button onClick={() => appendNumber('2')}>2</button>
      <button onClick={() => appendNumber('3')}>3</button>
      <button onClick={() => chooseOperation('*')}>*</button>
      <button onClick={() => appendNumber('4')}>4</button>
      <button onClick={() => appendNumber('5')}>5</button>
      <button onClick={() => appendNumber('6')}>6</button>
      <button onClick={() => chooseOperation('+')}>+</button>
      <button onClick={() => appendNumber('7')}>7</button>
      <button onClick={() => appendNumber('8')}>8</button>
      <button onClick={() => appendNumber('9')}>9</button>
      <button onClick={() => chooseOperation('-')}>-</button>
      <button onClick={() => appendNumber('.')}>.</button>
      <button onClick={() => appendNumber('0')}>0</button>
      <button className="span-two" onClick={evaluate}>=</button>
    </div>
  );
}

export default App;
