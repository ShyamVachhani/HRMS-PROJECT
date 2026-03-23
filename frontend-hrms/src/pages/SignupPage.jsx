// import React, { useState } from "react";
// import {
//   Box,
//   TextField,
//   Button,
//   Typography,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   Alert
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import api from "../services/api";

// const roles = ["admin", "manager", "hr", "developer", "intern"];

// const SignupPage = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSignup = async () => {
//     if (!name || !email || !password || !selectedRole) {
//       setError("Please fill in all fields!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       await api.post("/auth/signup", {
//         name,
//         email,
//         password,
//         role: selectedRole,
//       });

//       alert("Signup successful! Please login.");
//       navigate("/login");

//     } catch (error) {
//       console.error(error);
//       setError(error.response?.data?.message || "Connection error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSignup();
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "#F8FAFC",
//       }}
//     >
//       <Box
//         sx={{
//           backgroundColor: "white",
//           p: 4,
//           borderRadius: 3,
//           boxShadow: 5,
//           textAlign: "center",
//           width: "100%",
//           maxWidth: "400px",
//           mx: 2,
//         }}
//       >
//         <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold", mb: 1 }}>
//           Create Your Account 
//         </Typography>

//         <Typography sx={{ color: "#3B82F6", mb: 3 }}>
//           Sign up for HRMS Dashboard
//         </Typography>

//         {error && (
//           <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
//             {error}
//           </Alert>
//         )}

//         <TextField
//           label="Name"
//           fullWidth
//           margin="normal"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />

//         <TextField
//           label="Email"
//           fullWidth
//           margin="normal"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />

//         <TextField
//           label="Password"
//           type="password"
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           onKeyPress={handleKeyPress}
//         />

//         <FormControl fullWidth margin="normal">
//           <InputLabel>Role</InputLabel>
//           <Select
//             value={selectedRole}
//             onChange={(e) => setSelectedRole(e.target.value)}
//             label="Role"
//           >
//             {roles.map((role) => (
//               <MenuItem key={role} value={role}>
//                 {role.charAt(0).toUpperCase() + role.slice(1)}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <Button
//           variant="contained"
//           fullWidth
//           sx={{
//             mt: 2,
//             backgroundColor: "#1E3A8A",
//             "&:hover": { backgroundColor: "#3B82F6" },
//           }}
//           onClick={handleSignup}
//           disabled={loading}
//         >
//           {loading ? "Signing up..." : "Sign Up"}
//         </Button>

//         <Typography sx={{ mt: 3 }}>
//           Already have an account?
//           <Button
//             onClick={() => navigate("/login")}
//             sx={{ color: "#3B82F6", fontWeight: "bold" }}
//           >
//             Login Here
//           </Button>
//         </Typography>
//       </Box>
//     </Box>
//   );
// };

// export default SignupPage;

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "@mui/material";

import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const roles = ["admin", "manager", "hr", "developer", "intern"];

const SignupPage = ({ toggleColorMode }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !selectedRole) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role: selectedRole,
      });

      alert("Signup successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
<<<<<<< HEAD
        backgroundColor: theme.palette.background.default,
        position: "relative"
=======
        backgroundColor: "background.default",
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
      }}
    >

      {/* 🔥 Theme Toggle Button */}
      <IconButton
        onClick={toggleColorMode}
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          backgroundColor: theme.palette.background.paper
        }}
      >
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      <Box
        sx={{
<<<<<<< HEAD
          backgroundColor: theme.palette.background.paper,
=======
          backgroundColor: "background.paper",
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
          mx: 2,
        }}
      >
<<<<<<< HEAD
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Create Your Account
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
=======
        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
          Create Your Account 
        </Typography>

        <Typography sx={{ color: "primary.main", mb: 3, opacity: 0.8 }}>
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
          Sign up for HRMS Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            label="Role"
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
<<<<<<< HEAD
            backgroundColor: isDark ? "#3B82F6" : "#1E3A8A",
            "&:hover": {
              backgroundColor: isDark ? "#60A5FA" : "#3B82F6"
            },
=======
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
>>>>>>> cbc90cecb66eea5371434e1f34ac2dc50f9bffdb
          }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <Typography sx={{ mt: 3 }}>
          Already have an account?
          <Button
            onClick={() => navigate("/login")}
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            Login Here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupPage;