import { useDispatch, useSelector } from "react-redux";
import { overlayMessageActions } from "../../store/overlay-message-slice";
import { useTranslation } from "react-i18next";
import OverlayMessage from "../ui/OverlayMessage";
import "./UserInputAlert.css";

const UserInputAlert = () => {
  const [translation] = useTranslation();
  const dispatch = useDispatch();
  const overlayMessageState = useSelector((state) => state.overlayMessage);
  const overlayMessage = overlayMessageState.message;
  return (
    <>
      <OverlayMessage>
        <div className='label'>{translation(overlayMessage)}</div>
        <button className='confirm-btn btn' onClick={() => dispatch(overlayMessageActions.clearOverlayMessage())}>
          {translation("confirm")}
        </button>
      </OverlayMessage>
    </>
  );
};

export default UserInputAlert;
