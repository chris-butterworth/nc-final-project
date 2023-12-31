import React from "react";
import { Button, Box, Paper, Typography, Avatar, useTheme } from "@mui/material";
import socket from "../socket";

export const Scoreboard = ({ gameScores, players, setPlayerReady }) => {
  const theme = useTheme();
  const sortedPlayers = players.slice().sort((a, b) => b.score - a.score);
  
  return (
    <Box sx={{height:'95%'}}>
      <Paper
        elevation={3}
        sx={{
          // minWidth: "25vw",
          // minHeight: "8em",
          // height: "50em", 
          margin: "auto",
          padding: "1em",
          textAlign: "center",
          backgroundColor:
            theme.palette.mode === "light" ? "#e4dfda" : "#252b32",
          borderRadius: "0.5em",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          overflow: "auto", 
        }}
      >
        <Typography variant="h5">Scores</Typography>
        <Button
          onClick={() => {
            socket.emit("playerReady");
            setPlayerReady(true);
          }}
          variant="contained"
          sx={{
            backgroundColor:
              theme.palette.mode === "light" ? "#06d6a0" : "#ff0000",
            color: theme.palette.mode === "light" ? "#ef476f" : "#fff",
            marginTop: "1em",
          }}
        >
          Ready for the next game
        </Button>
        {gameScores.map((anagram, index) => (
          
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "1em",
            }}
          >
            <Typography variant="h6" sx={{color: theme.palette.mode === "light" ? "#ef476f" : "#fff"}}>
              {anagram.question.join(' ')} = {anagram.answer}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "0.5em",
                overflow: "auto",
              }}
            >
              {sortedPlayers.map((player) => {
                const playerScore = anagram.scores.find(
                  (score) => score.username === player.username
                );

                if (playerScore && playerScore.score > 0) {
                  return (
                    <Box
                      key={player.username}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "0.2em",
                      }}
                    >
                      <Avatar
                        src={player.avatar}
                        sx={{ width: 24, height: 24, marginRight: "0.5em" }}
                      />
                      <Typography>
                        {player.username}: {playerScore.score} points
                      </Typography>
                    </Box>
                  );
                }

                return null;
              })}
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
};
