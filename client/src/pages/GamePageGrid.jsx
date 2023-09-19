import { styled } from "@mui/material/styles";
import { Box, Paper, Grid, Typography } from "@mui/material";
import { Timer } from "../components/Timer";
import { PlayerList } from "../components/PlayerList";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  margin: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  minHeight: "50vh",
  maxHeight: "50vh"
}));

const GamePageGrid = ({ players, room }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            minWidth: "25vw",
            minHeight: "5vh",
            maxHeight: "auto",
            margin: "2em",
            padding: "1em",
            textAlign: "center",
            variant: "h3",
          }}
        >
          <Timer sx={{ maxHeight: "25px" }} />
        </Paper>
        <Paper
          elevation={3}
          sx={{
            minWidth: "25vw",
            minHeight: "5vh",
            maxHeight: "auto",
            margin: "2em",
            padding: "1em",
            textAlign: "center",
            variant: "h3",
          }}
        >
          <Typography sx={{ maxHeight: "25px" }}>Game Room ID: {room}</Typography>
        </Paper>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            order={{ xs: 3, md: 1 }}
            md={3}
         
          >
            <Item sx={{overflow:"auto"}}>
              <PlayerList players={players} />
            </Item>
          </Grid>
          <Grid item xs={12} order={{ xs: 1, md: 2 }} md={6}>
            <Item>
              <Typography variant="h4">Play Box</Typography>
            </Item>
          </Grid>

          <Grid item xs={12} order={{ xs: 2, md: 3 }} md={3}>
            <Item>
              <Typography variant="h4">Winners List</Typography>
            </Item>
          </Grid>
        </Grid>
      </Box>

      <Box
        sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
      >
        <Paper
          elevation={3}
          sx={{
            minWidth: "25vw",
            minHeight: "5vh",
            margin: "2em",
            padding: "1em",
            textAlign: "center",
          }}
        >
          <Typography variant="span">Player Controls</Typography>
        </Paper>
        <Paper
          elevation={3}
          sx={{
            minWidth: "25vw",
            minHeight: "5vh",
            margin: "2em",
            padding: "1em",
            textAlign: "center",
          }}
        >
          <Typography variant="span">Chat Box</Typography>
        </Paper>
      </Box>
    </Box>

    // <Box sx={{ display: "flex", flexDirection: "column" }}>
    //   <Box
    //     sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}
    //   >
    //     <Paper
    //       elevation={3}
    //       sx={{
    //         minWidth: "25vw",
    //         minHeight: "5vh",
    //         margin: "2em",
    //         padding: "1em",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Typography variant="span">i identify as a timer</Typography>
    //     </Paper>
    //   </Box>
    //   <Box sx={{ display: "flex", flexDirection: "row" }}>
    //     <Paper
    //       elevation={3}
    //       sx={{
    //         minWidth: "10%",
    //         minHeight: "50vh",
    //         margin: "2em",
    //         padding: "1em",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Typography variant="span">player list</Typography>
    //     </Paper>
    //     <Paper
    //       elevation={3}
    //       sx={{
    //         minWidth: "60%",
    //         minHeight: "50vh",
    //         margin: "2em",
    //         padding: "1em",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Typography variant="span">play box</Typography>
    //     </Paper>
    //     <Paper
    //       elevation={3}
    //       sx={{
    //         minWidth: "10%",
    //         minHeight: "50vh",
    //         margin: "2em",
    //         padding: "1em",
    //         textAlign: "center",
    //       }}
    //     >
    //       <Typography variant="span">winners list</Typography>
    //     </Paper>
    //   </Box>
    //   <Box sx={{ display: "flex", flexDirection: "row" }}></Box>
    // </Box>
  );
};

export default GamePageGrid;
