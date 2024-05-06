import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StocksCard from '../components/StocksCard';
import CustomDateInput from '../components/CustomDateInput';
import CustomChart from '../components/CustomChart';
import Spinner from '../components/Spinner'
import CustomAlert from '../components/CustomAlert';
import CustomSelect from '../components/CustomSelect';
import CustomCheckbox from '../components/CustomCheckbox';
import CustomButton from '../components/CustomButton';

const apiKey = '510e59febfe347058a391718ee90c2b6'

const Details = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);

  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  const [realTime, setRealTime] = useState(false);
  const [historicalSearch, setHistoricalSearch] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('1min');

  const [seriesData, setSeriesData] = useState([]);

  const selectOptions = [
    { value: '1min', label: '1 minuto' },
    { value: '5min', label: '5 minutos' },
    { value: '15min', label: '15 minutos' }
  ];

  //llamado a la api
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`https://api.twelvedata.com/stocks?symbol=${symbol}&source=docs&apikey=${apiKey}`);
        setStock(response.data.data[0]);
      } catch (error) {
        console.error('Error fetching stock:', error);
        setAlertMessage('Error al conectarse con el servidor');
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, [symbol]);
 
  const handleIntervalChange = (e) => {
    setSelectedInterval(e.target.value);
  };

  const handleRealTimeChange = (e) => {
    const isChecked = e.target.checked;
    setRealTime(isChecked);
    setHistoricalSearch(!isChecked);
  };

  const handleHistoricalSearchChange = (e) => {
    const isChecked = e.target.checked;
    setHistoricalSearch(isChecked);
    setRealTime(!isChecked);
  };

  const showAlertWithError = errorMessage => {
    setAlertMessage(errorMessage);
    setShowAlert(true);
    setSeriesData([]);
  };

  const clearAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  const handleShowChart = useCallback(async () => {
    try {
      setLoading(true);
      let url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${selectedInterval}`;

      // condicional para mostrar alert indicando que las fechas son obligatorias o incorrectas
      if (historicalSearch) {
        if (!startDate || !endDate) {
          showAlertWithError('Por favor, ingrese correctamente ambas fechas para realizar una búsqueda histórica');
          return;
        } else {
          clearAlert();
        }
        url += `&start_date=${startDate}&end_date=${endDate}`;
      } else {
        clearAlert();
      }
      // Agregar la fecha actual si es una búsqueda en tiempo real
      if (realTime) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0];
        url += `&start_date=${formattedDate}`;
      }
      url += `&apikey=${apiKey}`;  

      const response = await axios.get(url);
      const responseData = response.data;

      if (responseData && responseData.status === 'error') {
        const errorMessage = responseData.code === 404
          ? 'La acción solicitada no está disponible con este plan.'
          : 'Error al obtener los datos. Por favor, intenta de nuevo más tarde.';
        showAlertWithError(errorMessage);
      } else if (responseData && responseData.status === 'ok' && responseData.values) {
        setSeriesData(responseData.values);
      }
    } catch (error) {
        showAlertWithError('Error al obtener los datos. Por favor, intenta de nuevo más tarde.');
        setShowAlert(true);
    } finally {
      setLoading(false);
    }
  }, [symbol, selectedInterval, startDate, endDate, realTime, setSeriesData, historicalSearch]);

  const getIntervalMilliseconds = useCallback(() => {
    switch (selectedInterval) {
      case '1min':
        return 60000;
      case '5min':
        return 300000;
      case '15min':
        return 900000;
      default:
        return 60000;
    }
  }, [selectedInterval]);
  
  // Inicio y detención del intervalo de recarga del gráfico según el valor de realTime
  useEffect(() => {
    let intervalId;
    const intervalMs = getIntervalMilliseconds();
  
    const updateChart = () => {
      handleShowChart();
    };
  
    if (realTime) {
      intervalId = setInterval(updateChart, intervalMs);
    }
  
    return () => {
      clearInterval(intervalId);
    };
  }, [realTime, getIntervalMilliseconds, handleShowChart]);

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner />
        </div>
      ) : stock ? (
        <div>
          <StocksCard stock={stock} />
  
          <CustomCheckbox 
            label="Tiempo real"
            checked={realTime}
            onChange={handleRealTimeChange}
          />
  
          <div className="row pt-4">
            <div className="col-md-2 d-flex align-items-center">
              <CustomCheckbox 
                label="Búsqueda histórica"
                checked={historicalSearch}
                onChange={handleHistoricalSearchChange}
              />
            </div>
            <div className="col-md-5">
              <CustomDateInput
                label="Desde"
                value={startDate}
                onChange={setStartDate}
                disabled={!historicalSearch}
              />
            </div>
            <div className="col-md-5">
              <CustomDateInput
                label="Hasta"
                value={endDate}
                onChange={setEndDate}
                disabled={!historicalSearch}
              />
            </div>
          </div>
  
          <CustomSelect 
            label="Intervalo"
            selectedInterval={selectedInterval} 
            handleIntervalChange={handleIntervalChange} 
            options={selectOptions}
          />
  
          <div className="pt-4">
            <CustomAlert 
              show={showAlert} 
              message={alertMessage} 
              onClose={() => setShowAlert(false)}
            />
          </div>
  
          <div className="pt-4 pb-2 d-flex justify-content-end">
            <CustomButton label="Gráficar" onClick={handleShowChart}/>
          </div>
  
          {!showAlert && seriesData.length > 0 && (
            <CustomChart 
              title="Acciones" 
              seriesData={seriesData} 
              historicalSearch={historicalSearch}
            />
          )}
        </div>
      ) : (
        <div className="align-items-center vh-100">
          <CustomAlert 
            show={showAlert} 
            message={alertMessage} 
            onClose={() => setShowAlert(false)}
          />
        </div>
      )}
    </div>
  );
  
};

export default Details;