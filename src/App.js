import './App.css';
import {
  BrowserRouter,
  Link,
  Routes,
  Route,
  useNavigate,
  useLocation
} from "react-router-dom";
import Search from './components/Search';

export default function App() {
  let navigate = useNavigate()

  return (
    <div className="App">

      <h1> Altana Networks </h1>
      <div>
        <input type="text" id="company" style={{ "marginRight": "30px" }}></input>
        <button disabled={document.getElementById("company")?.value === ''} onClick={() => {
          navigate(`/search/${document.getElementById("company").value}`)
        }}> Search </button>
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
