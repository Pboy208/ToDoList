import { useTranslation } from "react-i18next";
import OverlayMessage from "../ui/OverlayMessage";
import "./DeletePrompt.css";

const DeletePrompt = (props) => {
  const [translation] = useTranslation();
  return (
    <>
      <OverlayMessage>
        <div className="label">{translation("delete.message")}</div>
        <button className="cancel-btn btn" onClick={(e) => props.choiceHandler(false)}>
          {translation("delete.cancel-btn")}
        </button>
        <button className="confirm-btn btn" onClick={(e) => props.choiceHandler(true)}>
          {translation("delete.delete-btn")}
        </button>
      </OverlayMessage>
    </>
  );
};

export default DeletePrompt;
