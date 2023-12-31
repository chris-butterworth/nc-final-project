import { ModeContext } from "../context/Mode";
import { useState, useContext } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputLabel,
  
} from "@mui/material";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";
import socket from "../socket";
import toast, { Toaster } from "react-hot-toast";
import Container from "@mui/material/Container";

export const SignInAsGuest = ({ setUsername, avatars, currentAvatarIndex }) => {
  const { mode, setMode } = useContext(ModeContext);
  const [usernameInput, setUsernameInput] = useState("");

  const handleGenerateRandomUsername = () => {
    setUsernameInput(
      uniqueNamesGenerator({
        dictionaries: [starWars],
        length: 1,
      })
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUsername(usernameInput);
    socket.emit("username", usernameInput);
    socket.emit("avatar", avatars[currentAvatarIndex]);
    setUsernameInput("");
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
       
        <FormControl sx={{ width: "90%", mt: 2 }}>
          <InputLabel htmlFor="username">Username (play as guest)</InputLabel>
          <Input
            id="username"
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        </FormControl>
        <Button variant="contained" sx={{ mt: 3 }} onClick={handleSubmit}>
          Submit username
        </Button>
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={handleGenerateRandomUsername}
        >
          Generate a random username
        </Button>
        <Toaster />
      </Box>
    </Container>
  );
};
