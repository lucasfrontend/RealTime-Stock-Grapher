import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';
import Details from './routes/Details';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/details/:symbol' element={<Details />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
