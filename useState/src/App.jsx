import { useState } from 'react'

// Component AlertButton
function AlertButton() {
  
  // 1. This is the new local function returning a NUMBER
  function getLuckyNumber() {
    // Math.random returns a number, so this function returns a number
    return Math.floor(Math.random() * 100); 
  }

  // Logic xử lý sự kiện
  function handleClick() {
    // We call the function to get the number
    const luckyNumber = getLuckyNumber();
    
    // We display the number in the alert
    alert("Xin chào! Số may mắn của bạn là: " + luckyNumber);
  }

  // JSX trả về
  return (
    <button onClick={handleClick}>
      Bấm vào đây để lấy số may mắn
    </button>
  );
}

function App() {
  const [count, setCount] = useState(0)

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1>My First Counter</h1>
      <button
        onClick={handleClick}
        style={{ fontSize: '20px', padding: '10px 20px' }}
      >
        Clicked {count} times
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h2>Alert Button Demo</h2>
      <AlertButton />
    </div>
  )
}

export default App
