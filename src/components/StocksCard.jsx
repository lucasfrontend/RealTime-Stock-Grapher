const StocksCard = ({ stock }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title border-bottom pb-2">Detalles de: {stock.symbol}</h5>
        <p className="card-text"><strong>Nombre:</strong> {stock.name}</p>
        <p className="card-text"><strong>Moneda:</strong> {stock.currency}</p>
        <p className="card-text"><strong>Tipo:</strong> {stock.type}</p>
        <p className="card-text"><strong>País:</strong> {stock.country}</p>
      </div>
    </div>
  );
};

export default StocksCard;