import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { ParentScreen } from "./ParentScreen";
import { AdminScreen } from "./AdminScreen";
import { GuideScreen } from "./GuideScreen";
import { useStore } from "../../store";
import {
  Box,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import "./mainscreen.css";

// interface Props {
//   onLogout: () => void;
// }

export const MainScreen: React.FC = () => {
  const user = useStore((state) => state.user);
  const usertype = useStore((state) => state.usertype);
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

  const PageDisplay: React.FC = () => {
    if (usertype === "child") {
      return <ParentScreen />;
    } else if (usertype === "guide") {
      return <GuideScreen />;
    } else if (usertype === "admin") {
      return <AdminScreen />;
    } else {
      return <Navigate to="/" />;
    }
  };

  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box>
      <div className="chip">
        <Chip
          icon={<FaceIcon />}
          label={`signed in as ${user.username}`}
          variant="outlined"
        />
        <Button onClick={handleClickOpen}>Change Password</Button>
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={handleClose}
          aria-labelledby="responsive-dialog-title"
        >
          <DialogTitle id="responsive-dialog-title">
            {"Change Password"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              Cancel
            </Button>
            <Button onClick={handleClose} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        <Button onClick={handleLogout}>SIGN OUT</Button>
      </div>
      <PageDisplay />
    </Box>
  );
};
