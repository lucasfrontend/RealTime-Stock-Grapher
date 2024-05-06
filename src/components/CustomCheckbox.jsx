const CustomCheckbox = ({ label, checked, onChange }) => {
  return (
    <div className="form-check pt-4">
      <input
        className="form-check-input"
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <label className="form-check-label">{label}</label>
    </div>
  );
};

export default CustomCheckbox;
