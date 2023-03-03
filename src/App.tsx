import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { LoginScreen } from "./Pages/login/LoginScreen";
import { MainScreen } from "./Pages/main/MainScreen";
import { useStore } from "./store";
import "./App.css";

// function ProtectedRoute({
//   path,
//   element,
// }: {
//   path: string;
//   element: React.ReactNode;
// }) {
//   const isLoggedIn = useStore((state) => state.isLoggedIn);
//   if (isLoggedIn) {
//     return <Route path={path} element={element} />;
//   } else {
//     return <Navigate to="/" />;
//   }
// }

function App() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const server = useStore((state) => state.server);
  const setUser = useStore((state) => state.setUser);
  const setUsertype = useStore((state) => state.setUsertype);
  const setIsLoggedIn = useStore((state) => state.setIsLoggedIn);

  useEffect(() => {
    try {
      fetch(`${server}/api/user`, {
        credentials: "include",
      })
        .then((response) => response.json())
        .then((user) => {
          console.log(user);
          setUser(user);
          setIsLoggedIn(true);
          if (user.adminid) {
            setUsertype("admin");
          } else if (user.childid) {
            setUsertype("child");
          } else if (user.guideid) {
            setUsertype("guide");
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.error(error);
    }
  }, [setUser, setUsertype, setIsLoggedIn, server, isLoggedIn]);

  const handleLogout = () => {
    fetch(`${server}/api/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then(() => {
        setUser({});
        setIsLoggedIn(false);
        setUsertype(null);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        {/* <ProtectedRoute */}
        <Route path="/main" element={<MainScreen onLogout={handleLogout} />} />
      </Routes>
    </Router>
  );
}

export default App;
