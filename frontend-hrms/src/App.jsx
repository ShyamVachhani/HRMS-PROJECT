// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App


// -----------------hrms---------------------------------

import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupPage from "./SignupPage";
import ForgetPassword from "./ForgetPassword";

function App() {
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("login"); 

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F8FAFC",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!role ? (
        page === "login" ? (
          <LoginPage
            setRole={setRole}
            goToSignup={() => setPage("signup")}
            goToForgot={() => setPage("forgot")}
          />
        ) : page === "signup" ? (
          <SignupPage
            setRole={setRole}
            goToLogin={() => setPage("login")}
          />
        ) : (
          <ForgetPassword goToLogin={() => setPage("login")} />
        )
      ) : (
        <div
          style={{
            backgroundColor: "white",
            padding: "50px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            textAlign: "center",
            width: "400px",
          }}
        >
          <h1 style={{ color: "#1E3A8A" }}>Welcome, {role} 🎉</h1>
          <p style={{ color: "#3B82F6" }}>
            You have successfully logged into HRMS.
          </p>

          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#1E3A8A",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => setRole(null)}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default App;