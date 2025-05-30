import { useState } from "react"
import { TextField, Button } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"
import "./SignUp.css"

function Signup() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Validation functions
  const isAlpha = (str) => /^[A-Za-z]+$/.test(str)
  const isValidEmail = (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)
  const isStrongPassword = (str) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(str)

  const handleSignUp = async () => {
    setError("")
    if (!isAlpha(firstName)) {
      setError("First name must contain only letters")
      alert("First name must contain only letters")
      return
    }
    if (!isAlpha(lastName)) {
      setError("Last name must contain only letters")
      alert("Last name must contain only letters")
      return
    }
    if (!isValidEmail(email)) {
      setError("Invalid email address")
      alert("Invalid email address")
      return
    }
    if (!isStrongPassword(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      alert(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character"
      )
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      alert("Passwords do not match")
      return
    }
    try {
      const res = await fetch("http://localhost:1337/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now().toString(),
          username,
          email,
          password,
          firstname: firstName,
          lastname: lastName,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        navigate("/login")
      } else {
        setError(data.error || "Sign up failed")
      }
    } catch (err) {
      setError("Network error")
    }
  }

  return (
    <div className="signup-bg">
      <div className="signup-container">
        <div className="signup-form">
          <div className="signup-form-content">
            <div className="logo-container">
              {/* Optionally add logo here */}
            </div>
            <h2 style={{ textAlign: "center", color: "#433628", marginBottom: 10 }}>SIGN UP</h2>
            <TextField
              variant="outlined"
              placeholder="FIRST NAME"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="LAST NAME"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="USERNAME"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="EMAIL"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="PASSWORD"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
            <TextField
              variant="outlined"
              placeholder="CONFIRM PASSWORD"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              className="signup-input"
              InputProps={{
                classes: { notchedOutline: "input-outline" },
              }}
            />
        
            <div className="signup-links">
              <Button
                className="signup-link"
                variant="text"
                fullWidth={false}
                component={Link}
                to="/login"
              >
                ALREADY HAVE AN ACCOUNT? LOGIN
              </Button>
            </div>
            <Button
              variant="contained"
              className="signup-btn"
              fullWidth
              onClick={handleSignUp}
              disabled={
                !firstName || !lastName || !username || !email || !password || !confirmPassword
              }
            >
              SIGN UP
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup;