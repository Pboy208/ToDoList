import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useState } from "react";
import UserSection from "./UserSection";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const MainNavigation = () => {
  const userLang = navigator.language;
  const [lang, setLang] = useState(userLang);
  const [translation, i18n] = useTranslation();

  useEffect(() => {
    i18n.changeLanguage(lang);
  }, [lang, i18n]);

  const changeLanguageHandler = (event) => {
    const language = event.target.value;
    setLang(language);
  };

  return (
    <header>
      <div className="logo">{translation("logo")}</div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink to="/todolist" exact activeClassName="active">
              {translation("nav.first")}
            </NavLink>
          </li>
          <li>
            <NavLink to="/todolist/add" activeClassName="active">
              {translation("nav.second")}
            </NavLink>
          </li>
        </ul>
      </nav>
      <UserSection />
      <select className="language-selector" value={lang} onChange={changeLanguageHandler}>
        <option value="en">English</option>
        <option value="vi">Vietnamese</option>
      </select>
    </header>
  );
};
export default MainNavigation;
