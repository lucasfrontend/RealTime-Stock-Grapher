import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import CustomSearchInput from '../components/CustomSearchInput';
import CustomAlert from '../components/CustomAlert';
import CustomPaginator from '../components/CustomPaginator';

const Home = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [perPage] = useState(10);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [searchTermName, setSearchTermName] = useState('');
  const [searchTermSymbol, setSearchTermSymbol] = useState('');

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await axios.get('https://api.twelvedata.com/stocks?source=docs&amp;exchange=NYSE');
        setStocks(response.data.data);
      } catch (error) {
        setShowAlert(true);
        console.error('Error al obtener las acciones:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchStocks();
  }, []);

  useEffect(() => {
    setFilteredStocks(stocks);
  }, [stocks]);

  const handleSearchByName = () => {
    const filtered = stocks.filter((stock) => {
      return stock.name.toLowerCase().includes(searchTermName.toLowerCase());
    });
    setShowAlert(filtered.length === 0);
    setFilteredStocks(filtered);
    setSearchTermSymbol('');
  };

  const handleSearchBySymbol = () => {
    const filtered = stocks.filter((stock) => {
      return stock.symbol.toLowerCase().includes(searchTermSymbol.toLowerCase());
    });
    setShowAlert(filtered.length === 0);
    setFilteredStocks(filtered);
    setSearchTermName('');
  };
  
  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Acciones</h2>
      <p className="text-muted">Buscar 'NFLX' para la visualización correcta de la performance. Para el resto de acciones, la API key utilizada presenta limitaciones.</p>
      <CustomSearchInput
        value={searchTermName}
        onChange={(e) => setSearchTermName(e.target.value)}
        onSearch={handleSearchByName}
        searchBy="name"
        stocks={stocks.map(stock => stock.name)} 
      />

      <CustomSearchInput
        value={searchTermSymbol}
        onChange={(e) => setSearchTermSymbol(e.target.value)}
        onSearch={handleSearchBySymbol}
        searchBy="symbol"
        stocks={stocks.map(stock => stock.symbol)}
      />
      
      {showAlert && ( <CustomAlert message="No se encontraron resultados."/> )}

      <table className="table">
        <thead>
          <tr>
            <th>Símbolo</th>
            <th>Nombre</th>
            <th>Moneda</th>
            <th>Tipo</th>
          </tr>
        </thead>
        <tbody>
        {filteredStocks
        .slice(currentPage * perPage, (currentPage + 1) * perPage)
        .map((stock, index) => (
          <tr key={index}>
            <td><Link to={`/details/${stock.symbol}`}>{stock.symbol}</Link></td>
            <td>{stock.name}</td>
            <td>{stock.currency}</td>
            <td>{stock.type}</td>
          </tr>
        ))}
        </tbody>
      </table>
      
      <CustomPaginator 
        pageCount={Math.ceil(filteredStocks.length / perPage)} 
        handlePageClick={handlePageClick} 
      />
    </div>
  );
};

export default Home;
