// Alert.js
import '../assets/alert.css';

const Alert = ({ message, onClose }: {message: any, onClose: any}) => {
  return (
    <div className="alert">
      <img
          src="/Icons/About.png"
          alt="alert"
          referrerPolicy="no-referrer"
      />
      <p>{message}</p>
      <button onClick={onClose}> X</button>
    </div>
  );
};

export default Alert;
