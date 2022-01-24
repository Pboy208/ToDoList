import OverlayMessage from "../ui/OverlayMessage";
import { useState } from "react";
import "./PasswordRequire.css";

const PasswordRequire = (props) => {
  const [password, setPassword] = useState("");
  const isPasswordFilled = !!password;

  const inputChangeHandler = (event) => {
    const value = event.target.value;
    setPassword(value);
  };

  const cancelSubmit = (event) => {
    event.preventDefault();
    props.cancelPasswordRequire();
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (password.length > 10 || password.length < 8) {
      return alert("Password should have length between 8 and 10 characters");
    }
    props.submitPassword(password);
  };

  return (
    <OverlayMessage>
      <form onSubmit={submitHandler} className='password-require-form'>
        <label>Your password is required for futher action</label>
        <input type='password' value={password} onChange={inputChangeHandler} />
        <button className='cancel-btn btn' onClick={cancelSubmit}>
          CANCEL
        </button>
        <button className='save-btn btn' disabled={isPasswordFilled ? null : true}>
          CONFIRM
        </button>
      </form>
    </OverlayMessage>
  );
};

export default PasswordRequire;
