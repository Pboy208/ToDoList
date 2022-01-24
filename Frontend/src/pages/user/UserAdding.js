import { getUserRequestConfig } from "../../utils/HttpRequestConfig";
import { useTranslation } from "react-i18next";
import { useHttpClient } from "../../hooks/http-hook";
import Card from "../../components/ui/Card";
import "./UserAdding.css";
import { useForm } from "../../hooks/form-hook";
import InputField from "../../components/InputField";
const UserAdding = () => {
  const [translation] = useTranslation();

  const sendRequest = useHttpClient();
  const { formInputs, error, onChangeHandler, validateInputs } = useForm({
    fullname: "",
    username: "",
    password: "",
    passwordConfirm: "",
    address: "",
    email: "",
  });

  const isAllFieldsFilled =
    !!formInputs.username &&
    !!formInputs.password &&
    !!formInputs.passwordConfirm &&
    !!formInputs.fullname &&
    !!formInputs.email &&
    !!formInputs.address;

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    // const requestConfig = getUserRequestConfig.addUser(user, localStorage.getItem("token"));
    const requestConfig = getUserRequestConfig.signup(formInputs);
    const res = await sendRequest(requestConfig);
    if (!res) return;
    alert(translation("ACCOUNT_CREATED"));
  };

  return (
    <>
      <Card>
        <form className='user-register' onSubmit={onSubmitHandler}>
          <div className='user-register__header'>{translation("registing_required")}</div>
          {/* <div className='user-register__field'>
            <label>{translation("username")}</label>
            <input id='username' value={formInputs.username} onChange={onChangeHandler} />
            <p>{error.username}</p>
          </div> */}
          <InputField
            className='user-register__field'
            label='username'
            inputId='username'
            inputType='text'
            value={formInputs.username}
            inputOnChange={onChangeHandler}
            inputError={error.username}
          />
          <div className='user-register__field'>
            <label>{translation("password")}</label>
            <input
              type='password'
              id='password'
              value={formInputs.password}
              onChange={onChangeHandler}
            />
            <p>{error.password}</p>
          </div>

          <div className='user-register__field'>
            <label>{translation("password")}</label>
            <input
              type='password'
              id='passwordConfirm'
              value={formInputs.passwordConfirm}
              onChange={onChangeHandler}
            />
            <p>{error.passwordConfirm}</p>
          </div>

          <div className='user-register__field'>
            <label>{translation("full_name")}</label>
            <input id='fullname' value={formInputs.fullname} onChange={onChangeHandler} />
            <p>{error.fullname}</p>
          </div>

          <div className='user-register__field'>
            <label>{translation("email")}</label>
            <input id='email' value={formInputs.email} onChange={onChangeHandler} />
            <p>{error.email}</p>
          </div>

          <div className='user-register__field'>
            <label>{translation("address")}</label>
            <input id='address' value={formInputs.address} onChange={onChangeHandler} />
            <p>{error.address}</p>
          </div>

          <button
            className='user-register__submit-btn save-btn btn'
            disabled={isAllFieldsFilled ? null : true}
          >
            {translation("signup")}
          </button>
        </form>
      </Card>
    </>
  );
};

export default UserAdding;
