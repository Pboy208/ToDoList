import { useTranslation } from "react-i18next";
import React from "react";

const InputField = React.memo((props) => {
  const [translation] = useTranslation();

  return (
    <div className={props.className}>
      <label>{translation(props.label)}</label>
      <input
        id={props.inputId}
        type={props.inputType}
        value={props.inputValue}
        onChange={props.inputOnChange}
      />
      <p>{props.inputError}</p>
    </div>
  );
});

export default InputField;
