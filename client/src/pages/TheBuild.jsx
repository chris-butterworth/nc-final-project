import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import { Paper } from "@mui/material";

const theTeam = [
  {
    name: "Charlotte",
    img: "https://media.licdn.com/dms/image/D4E03AQFBzTkbC70hMw/profile-displayphoto-shrink_800_800/0/1690316681956?e=1701302400&v=beta&t=oBjPFPPUW5d5q-RQusOHVeHCabUmd9c11otZ4cDByis",
    github: "https://github.com/cCody34",
    linkedIn: "https://www.linkedin.com/in/charlotte-cody-1b9894172/",
  },
  {
    name: "Chris",
    img: "https://media.licdn.com/dms/image/D4E35AQHi_A8O3s0xag/profile-framedphoto-shrink_800_800/0/1693294639294?e=1696410000&v=beta&t=D3B-GDl6Tb2gqOneh8p9HHb3O9mCpjg-kwfLKbU0U8M",
    github: "https://github.com/chris-butterworth",
    linkedIn: "https://www.linkedin.com/in/chris-butterworth-74b77a25a/",
  },
  {
    name: "Lex",
    img: "https://media.licdn.com/dms/image/D4D03AQFWZSmgOi8F5A/profile-displayphoto-shrink_800_800/0/1691162112518?e=1701302400&v=beta&t=CaiaZJKV43deYIPTItG66o4_t_qCDzHjKnfMGmGkZOs",
    github: "https://github.com/Lex5mith",
    linkedIn: "https://www.linkedin.com/in/lex-smith-084a6a42/",
  },
  {
    name: "Phil",
    img: "https://scontent-man2-1.xx.fbcdn.net/v/t1.6435-9/44392243_10215917139093997_4234685840862740480_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=rFGc5kd3TTQAX-67svc&_nc_ht=scontent-man2-1.xx&oh=00_AfChL70XyxfJbKm3SqwvTY6blvNAmuWZbvd3mux97uybBw&oe=653B57AF",
    github: "https://github.com/PGallagher93",
    linkedIn: "https://www.linkedin.com/in/philip-gallagher-a24048285/",
  },
  {
    name: "Simon",
    img: "https://pbs.twimg.com/profile_images/1366092575560581120/3xBexFDs_400x400.jpg",
    github: "https://github.com/TypeError92",
    linkedIn: "https://www.linkedin.com/in/simon-walgenbach-b06960142/",
  },
];

const TeamMember = ({ name, img, linkedIn, github }) => {
  return (
    <Grid
      item
      xs={6}
      sm={4}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        alignContent: "center",
      }}
    >
      <Avatar alt={name} src={img} sx={{ width: 100, height: 100 }}>
        M1
      </Avatar>
      <Typography variant="subtitle1">{name}</Typography>
      <div>
        <IconButton
          color="primary"
          aria-label="GitHub"
          href={github}
          target="_blank"
        >
          <GitHubIcon />
        </IconButton>
        <IconButton
          color="primary"
          aria-label="LinkedIn"
          href={linkedIn}
          target="_blank"
        >
          <LinkedInIcon />
        </IconButton>
      </div>
    </Grid>
  );
};

export const TheBuild = () => {
  return (
    <Container>
      <Paper sx={{ marginTop: "3em", padding: "2em", textAlign: "center" }}>
        <Typography variant="h3" gutterBottom>
          This project was created as a portfolio piece to showcase the culmination 
        </Typography>

        <TextField
          id="project-details"
          label="Enter project details"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
        />

        <Typography variant="h4" gutterBottom>
          Team Members
        </Typography>

        <Grid container spacing={2}>
          {theTeam.map((teamMember) => (
            <TeamMember
              key={teamMember.name}
              name={teamMember.name}
              img={teamMember.img}
              linkedIn={teamMember.linkedIn}
              github={teamMember.github}
            />
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};
