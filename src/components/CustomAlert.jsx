import { Alert } from 'react-bootstrap';

const CustomAlert = ({ show, message, onClose }) => {
  return (
    <Alert show={show} variant="warning" onClose={onClose} dismissible className="alert-sm">
      <span>{message}</span>
    </Alert>
  );
};

export default CustomAlert;