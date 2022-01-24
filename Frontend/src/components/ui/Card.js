import "./Card.css";

const Card = (props) => {
  return <div className="card centered">{props.children}</div>;
};

export default Card;
