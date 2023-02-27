import { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LoginScreen } from "./Pages/login/LoginScreen";
import { MainScreen } from "./Pages/main/MainScreen";
import { useStore } from "./store";
import "./App.css";

function App() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);

  useEffect(() => {
    if (localStorage.getItem("user")) {
      useStore.setState({ isLoggedIn: true });
    }
    const checkUser = () => {
      if (isLoggedIn && window.location.pathname === "/") {
        window.location.href = "/main";
      }
    };
    checkUser();
  }, [isLoggedIn]);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/main" element={<MainScreen />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
