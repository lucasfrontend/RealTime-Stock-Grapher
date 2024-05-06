const CustomSelect = ({ label, selectedInterval, handleIntervalChange, options }) => {
  return (
    <div className="form-group pt-4">
      <label>{label}:</label>
      <select className="form-control" value={selectedInterval} onChange={handleIntervalChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default CustomSelect;