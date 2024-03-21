import React from 'react';
import '../assets/alert.css';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

const Alert: React.FC<AlertProps> = ({ message, type }) => {
  const alertClass = `alert ${type}`;

  return (
    <div className={alertClass}>
      <p>{message}</p>
    </div>
  );
};

export default Alert;