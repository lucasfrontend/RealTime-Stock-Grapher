const CustomDateInput = ({ label, value, onChange, disabled }) => {
  return (
    <div className="form-group">
      <label>{label}:</label>
      <input 
        className="form-control" 
        type="date"
        value={value} 
        onChange={(e) => {
          onChange(e.target.value);
        }} 
        disabled={disabled} 
      />
    </div>
  );
};

export default CustomDateInput;
