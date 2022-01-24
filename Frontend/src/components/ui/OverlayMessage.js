import "./OverlayMessage.css";

const OverlayMessage = (props) => {
  return (
    <>
      <section className="message">{props.children}</section>
      <div className="overlay"></div>
    </>
  );
};

export default OverlayMessage;
