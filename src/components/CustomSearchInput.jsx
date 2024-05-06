import CustomButton from './CustomButton';

const CustomSearchInput = ({ value, onChange, onSearch, searchBy }) => {

  const placeholderText = searchBy === 'name' ? 'Buscar por Nombre, ej Netflix' : 'Buscar por Símbolo, ej NFLX';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="form-control"
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
      />

      <CustomButton 
        label="Buscar" 
        onClick={onSearch}
      />
    </div>
  );
};

export default CustomSearchInput;
