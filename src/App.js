import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Search from './components/Search';

export default function App() {
  return (
    <div className="App">
      <h2 style={{ "alignSelf": "center" }}> Altana Networks </h2>
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
