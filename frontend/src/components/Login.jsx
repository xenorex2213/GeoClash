import { useState } from "react";

function Login({ setPlayerId }) {
  const [input, setInput] = useState("");

  const handleLogin = () => {
    if (!input) return alert("Enter Player ID");
    setPlayerId(input.trim().toLowerCase());
  };

  return (
    <div>
      <h2>Enter Player ID</h2>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleLogin}>Continue</button>
    </div>
  );
}

export default Login;