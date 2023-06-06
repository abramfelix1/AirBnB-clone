import React, { useState } from "react";
import * as sessionActions from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import "./form.css";

export default function LoginForm({ closeModal }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => {
    return state.session.user;
  });
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) return <Redirect to="/" />;

  const submitHandler = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const demoHandler = (e) => {
    e.preventDefault();
    const credential = "Demo-lition";
    const password = "password";
    closeModal();
    return dispatch(sessionActions.login({ credential, password }));
  };

  return (
    <div className="form-container cred">
      <div className="form-header">
        <i
          className="fa-solid fa-x"
          onClick={() => {
            closeModal();
          }}
        ></i>
        <h1>Log In</h1>
      </div>
      {errors.credential && (
        <div className="form-errors">
          <p>{errors.credential}</p>
        </div>
      )}
      <form onSubmit={submitHandler}>
        <input
          placeholder="Username or Email"
          type="text"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="form-buttons-container">
          <button className="form-button" type="submit">
            Log In
          </button>
        </div>
      </form>
      <p className="break-line"></p>
      <div className="demo-button-container">
        <button className="demo-button" onClick={demoHandler}>
          Demo User
        </button>
      </div>
    </div>
  );
}
