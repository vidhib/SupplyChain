import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Search from './components/Search';

export default function App() {
  return (
    <div className="App">
      <div>
        <h2> Altana Networks </h2>
      </div>
      <Routes>
        <Route path="/search" element={<Search />}>
          <Route path=":company/*" element={<Search />}>
          </Route>
        </Route>
        <Route path="*" element={<Search />} />
      </Routes>
    </div>
  );

}
