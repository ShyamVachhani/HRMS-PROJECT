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
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import EmployeeListPage from "./pages/EmployeeListPage";

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
        <EmployeeListPage role={role}/>
      )}
    </div>
  );
}

export default App;