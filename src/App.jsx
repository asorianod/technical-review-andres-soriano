import { Routes, Route, Outlet, Link } from "react-router-dom";
import Exercise1 from "./Exercise1";
import Exercise2 from "./Exercise2";
import "./App.css";

export default function App() {
  return (
    <div>
      <Link to="/">
        <h2 className="title">Technical Review MCA - Andrés Soriano</h2>
      </Link>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="exercise1" element={<Exercise1 />} />
          <Route path="exercise2" element={<Exercise2 />} />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  );
}

function Layout() {
  return (
    <div>
      <nav className="navigation">
        <Link to="/exercise1">Exercise 1</Link>
        <Link to="/exercise2">Exercise 2</Link>
      </nav>
      <hr />
      <Outlet />
    </div>
  );
}

function Home() {
  return (
    <div>
      <ul
        style={{
          maxWidth: "700px",
          textAlign: "left",
          fontSize: "0.9rem",
          fontStyle: "italic",
        }}
      >
        <li>{`You have to create the following component: <Range />`}</li>
        <li>You have to use React to create the solution.</li>
        <li>
          You do not have to use any CLI to create structure and architecture of
          your application.
        </li>
      </ul>
      <p>
        This component has <b>two use modes:</b>
      </p>
      <p>
        <b>1. Normal range</b> from min to max number -
        <Link to="/exercise1"> Exercise 1</Link>
      </p>
      <p>
        <b>2. Fixed number</b> of options range -
        <Link to="/exercise2"> Exercise 2</Link>
      </p>
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
