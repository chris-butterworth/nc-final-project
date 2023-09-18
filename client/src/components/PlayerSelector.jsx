import * as React from 'react'
import { Link } from 'react-router-dom'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import PersonIcon from '@mui/icons-material/Person'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import { Typography } from '@mui/material'
import socket from '../socket'

const PlayerSelector = ({ numberofPlayers, room, setRoom }) => {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: 'row' }}>
					<Link
						to={`/`}
						style={{ textDecoration: 'none' }}
						onClick={() => {
							socket.emit('createSinglePlayerRoom', (room) => {
								setRoom(room)
								console.log('joined room', room)
							})
						}}
					>
						<Paper
							sx={{
								minWidth: '25vw',
								minHeight: '30vh',
								margin: '2em',
								padding: '1em',
								textAlign: 'center',
							}}
						>
							<PersonIcon fontSize="large" />
							<Typography variant="h3">Single Player</Typography>
						</Paper>
					</Link>
					<Link to={`/`} style={{ textDecoration: 'none' }}
					onClick={() => {
						socket.emit('createMultiPlayerRoom', (room) => {
							setRoom(room)
							console.log('joined room', room)
						})
					}}>
						
						<Paper
							sx={{
								minWidth: '25vw',
								minHeight: '30vh',
								margin: '2em',
								padding: '1em',
								textAlign: 'center',
							}}
						>
							<GroupIcon fontSize="large" />
							<Typography variant="h3">New Multi-Player</Typography>
						</Paper>
					</Link>
				</Box>
				<Link to={`/tutorial`} style={{ textDecoration: 'none' }}>
					<Paper
						sx={{
							minWidth: '20vw',
							minHeight: '30vh',
							margin: '2em',
							padding: '1em',
							textAlign: 'center',
						}}
					>
						<SchoolIcon fontSize="large" />
						<Typography variant="h3">Tutorial</Typography>
					</Paper>
				</Link>
			</Box>
		</>
	)
}

export default PlayerSelector
