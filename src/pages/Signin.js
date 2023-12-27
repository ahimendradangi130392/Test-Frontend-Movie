import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [btnDisable, setBtnDisable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
    // Clear error when user starts typing in a field
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setBtnDisable(true);
    setLoading(true);
    // Check if fields are empty
    const newErrors = {};
    if (!credentials.username) {
      newErrors.username = "Email is required";
    }
    if (!credentials.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      setBtnDisable(false);
      return;
    }

    axios
      .post("http://103.186.184.179:3003/api/auth/login", credentials)
      .then((response) => {
        localStorage.setItem("token", JSON.stringify(response.data.token));
        navigate("/");
        setLoading(false);
        setBtnDisable(false);
      })
      .catch((error) => {
        alert("Unable to login");
        setBtnDisable(false);
        setLoading(false);
      });
  };

  return (
    <div className="signincontainer">
      <div className="loginform">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-field">
            <input
              className="inputtext"
              type="email"
              name="username"
              placeholder="Email"
              value={credentials.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="error-message" style={{ color: "red" }}>
                {errors.username}
              </p>
            )}
          </div>
          <div className="input-field">
            <input
              className="inputtext"
              type="password"
              name="password"
              placeholder="Password"
              value={credentials.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="error-message" style={{ color: "red" }}>
                {errors.password}
              </p>
            )}
          </div>
          <div className="remember">
            <div className="custom-checkbox">
              <input type="checkbox" id="myCustomCheckbox" />
              <label htmlFor="myCustomCheckbox"></label>
            </div>
            Remember me
          </div>
          <Button
            className={`successbtn ${btnDisable && "o-20"}`}
            type="submit"
            disabled={btnDisable}
            loading={loading}
          >
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
