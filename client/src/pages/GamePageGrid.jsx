import { useContext } from 'react'
import { ModeContext } from '../context/Mode'
import { styled } from '@mui/material/styles'
import {
	Box,
	Paper,
	Grid,
	Typography,
	Button,
	Container,
	useMediaQuery,
	TableContainer,
	TableRow,
	TableCell,
	Divider,
} from '@mui/material'
import { Timer } from '../components/Timer'
import { PlayerList } from '../components/PlayerList'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { PlayBox } from '../components/PlayBox'
import { useState, useEffect, useRef } from 'react'
import socket from '../socket'
import CustomDialog from '../components/CustomDialog'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { Scoreboard } from '../components/Scoreboard'
import ChatInput from '../components/ChatInput'
import { FastForward, Close } from '@mui/icons-material'
import PlayerControls from '../components/PlayerControls'

import { auth } from '../../firebase'
import { Toaster } from 'react-hot-toast'
import toast from 'react-hot-toast'

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#E4DFDA',
	...theme.typography.body2,
	padding: theme.spacing(1),
	margin: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
	minHeight: '50vh',
	maxHeight: 'auto',
	maxWidth: '100vw',
}))

const GamePageGrid = ({ players, room, setRoom }) => {
	const { mode } = useContext(ModeContext)
	const [playerReady, setPlayerReady] = useState(false)
	const [timer, setTimer] = useState(0)
	const [score, setScore] = useState(0) // if truthy then means you've guessed correctly
	const [anagramNumber, setAnagramNumber] = useState(1)
	const [roundNumber, setRoundNumber] = useState(1)
	const [betweenWords, setBetweenWords] = useState(false)
	const [betweenRounds, setBetweenRounds] = useState(false)
	const [gameOver, setGameOver] = useState(false)
	const [anagramWords, setAnagramWords] = useState([])
	const [disabledButtons, setDisabledButtons] = useState([])
	const [formattedAnswerArray, setFormattedAnswerArray] = useState([])
	const [hint, setHint] = useState('')
	const [hintCount, setHintCount] = useState(0)
	const [skippedOrCorrect, setSkippedOrCorrect] = useState(false)
	const [hints, setHints] = useState([])

	const [gameMessage, setGameMessage] = useState('')
	const [gameScores, setGameScores] = useState('')
	const [gameScroll, setGameScroll] = useState([])
	const [fullScreenCustomDialog, setFullScreenCustomDialog] = useState('')
	const [lastPlayedAnswer, setLastPlayedAnswer] = useState('')
	const [lastRoundScores, setLastRoundScores] = useState([])
	const [category, setCategory] = useState('')
	const [subcategory, setSubcategory] = useState('')

	const Ref = useRef(null)
	const isMobile = useMediaQuery('(max-width: 600px)')

	useEffect(() => {
		socket.on(
			'fullScreenCustomDialog',
			(message, lastPlayedAnswer, scores = '') => {
				setFullScreenCustomDialog(message)
				setLastRoundScores(scores)
				setLastPlayedAnswer(lastPlayedAnswer)
			}
		)
	}, [])

	useEffect(() => {
		socket.on('gameScroll', (username, message) => {
			setGameScroll((current) => {
				return [{ username, message }, ...current]
			})
		})
	}, [])

	useEffect(() => {
		socket.on('betweenWordsCountdown', (time) => {
			setAnagramWords([])
			setFormattedAnswerArray([])
			setBetweenWords(true)
			timerFunction(time)
		})
	}, [])

	useEffect(() => {
		socket.on('betweenRoundsCountdown', (time) => {
			setAnagramWords([])
			setFormattedAnswerArray([])
			setBetweenRounds(true)
			timerFunction(time)
		})
	}, [])

	useEffect(() => {
		socket.on(
			'anagram',
			(time, anagram, answer, round, category, subcategory) => {
				setSkippedOrCorrect(false)
				setRoundNumber(round.round)
				setAnagramNumber(round.anagram)
				setBetweenRounds(false)
				setBetweenWords(false)
				setDisabledButtons([])
				setAnagramWords(anagram)
				setCategory(category)
				setSubcategory(subcategory)
				setFormattedAnswerArray(
					answer
						.split(' ')
						.map((word) => Array.from({ length: word.length }, () => ''))
				)
				setHint(answer.toUpperCase())
				timerFunction(time)
				setHintCount(0)
				setHints([])
			}
		)
	}, [])
	useEffect(() => {
		socket.on('endGame', (scores) => {
			if (auth.currentUser) {
				socket.emit('updateScore', auth.currentUser.uid)
			}
			timerFunction(0)
			setAnagramWords([])
			setFormattedAnswerArray([])
			setBetweenWords(false)
			setBetweenRounds(false)
			setGameOver(true)
			setGameScores(scores)
			setGameMessage('Game over!')
			setFullScreenCustomDialog('')
		})
	}, [])

	useEffect(() => {
		socket.on('newGame', () => {
			setGameOver(false)
			setAnagramWords([])
			setFormattedAnswerArray([])
			setBetweenWords(false)
			setBetweenRounds(false)
			setGameScores('')
			setGameMessage('')
			setFullScreenCustomDialog('')
		})
	}, [])

	useEffect(() => {
		// Tests answer validity
		if (
			disabledButtons.length > 0 &&
			disabledButtons.length === formattedAnswerArray.flat().length
		) {
			socket.emit('anagramAttempt', formattedAnswerArray, timer, hintCount)
		}
	}, [disabledButtons])

	useEffect(() => {
		socket.on('correctAttempt', (score) => {
			setSkippedOrCorrect(true)
			setScore(score)
		})
	}, [])

	useEffect(() => {
		socket.on('incorrectAttempt', () => {
			setDisabledButtons(() => {
				return hints.map((hint) => {
					return {
						wordIndex: hint.questionWordIndex,
						letterIndex: hint.questionLetterIndex,
						letter: hint.letter,
					}
				})
			})
			setFormattedAnswerArray((current) => {
				const hintsOnly = current.map((word) => {
					return word.map(() => {
						return ''
					})
				})
				hints.forEach((hint) => {
					hintsOnly[hint.answerWordIndex][hint.answerLetterIndex] = hint.letter
				})
				return hintsOnly
			})
		})
	}, [])

	const timerFunction = (time) => {
		const clearTimer = (e) => {
			setTimer(time)
			if (Ref.current) clearInterval(Ref.current)
			const id = setInterval(() => {
				startTimer(e)
			}, 1000)
			Ref.current = id
		}

		const getDeadline = () => {
			let deadline = new Date()
			deadline.setSeconds(deadline.getSeconds() + time)
			return deadline
		}

		const startTimer = (e) => {
			let { total, seconds } = getTimeRemaining(e)
			if (total >= 0) {
				setTimer(seconds)
			}
		}

		const getTimeRemaining = (e) => {
			const total = Date.parse(e) - Date.parse(new Date())
			const seconds = Math.floor(total / 1000)
			return {
				total,
				seconds,
			}
		}

		clearTimer(getDeadline())
	}

	const handleQuitButtonClick = () => {
		setRoom('')
		socket.emit('leaveRoom')
		setPlayerReady(false)
		setTimer(0)
		setScore(0)
		setAnagramNumber(1)
		setRoundNumber(1)
		setBetweenWords(false)
		setBetweenRounds(false)
		setGameOver(false)
		setAnagramWords([])
		setDisabledButtons([])
		setFormattedAnswerArray([])
		setHint('')
		setHintCount(0)
		setGameMessage('')
		setGameScores('')
		setGameScroll([])
		setFullScreenCustomDialog('')
		setLastPlayedAnswer('')
		setLastRoundScores([])
	}

	const handleSkipButtonClick = () => {
		if (!skippedOrCorrect) {
			setSkippedOrCorrect(true)
			socket.emit('playerSkip')
		}
	}

	const createRoomURL = () => {
		return `${window.location.origin}?room=${room}`
	}

	return (
		<Paper sx={{ minWidth: '80vw' }}>
			<Grid container>
				<Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
					<Paper
						elevation={3}
						sx={{
							maxWidth: isMobile ? '100vw' : '25',
							minHeight: isMobile ? '' : '6em',
							margin: isMobile ? '0' : '2em',
							marginTop: isMobile ? '1em' : '',
							padding: '1em',
							textAlign: 'center',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Timer
							timer={timer}
							playerReady={playerReady}
							setPlayerReady={setPlayerReady}
						/>
					</Paper>
				</Grid>
				<Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
					<Paper
						elevation={3}
						sx={{
							maxWidth: isMobile ? '100vw' : '25',
							minHeight: isMobile ? '' : '6em',
							margin: isMobile ? '0' : '2em',
							padding: '1em',
							textAlign: 'center',
							flexDirection: 'column',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography variant="h3">NC-Anagrams</Typography>
					</Paper>
				</Grid>
				{isMobile ? (
					''
				) : (
					<Grid item xs={12} sm={12} md={4} order={{ xs: 1, md: 3 }}>
						<Paper
							elevation={3}
							sx={{
								maxWidth: isMobile ? '100vw' : '50vw',
								minHeight: isMobile ? '' : '6em',
								margin: isMobile ? '0' : '2em',
								padding: '1em',
								textAlign: 'right',
								flexDirection: 'column',
								alignItems: 'flex-end',
								justifyContent: 'flex-end',
								align: 'center',
							}}
						>
							<Container
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
								}}
							>
								<Typography
									variant="h6"
									sx={{
										maxHeight: '25px',
										paddingRight: '1em',
									}}
									onClick={() => {
										navigator.clipboard.writeText(room)
									}}
								>
									Room ID: {room}
								</Typography>
								<Button
									sx={{
										'&hover': { cursor: 'pointer' },
										padding: '0',
										margin: '0',
									}}
									onClick={() => {
										navigator.clipboard.writeText(room)
									}}
								>
									<ContentCopyIcon fontSize="medium" />
								</Button>
							</Container>
							<Container
								sx={{
									display: 'flex',
									flexDirection: 'row',
									justifyContent: 'flex-end',
								}}
							>
								<Typography
									variant="h6"
									sx={{
										maxHeight: '25px',
										maxWidth: 'calc(100%-1em)',
										paddingRight: '1em',
										whiteSpace: 'nowrap',
										overflow: 'hidden',
									}}
									onClick={() => {
										navigator.clipboard.writeText(createRoomURL())
									}}
								>
									Copy Room Link
								</Typography>
								<Button
									sx={{
										'&hover': { cursor: 'pointer' },
										padding: '0',
										margin: '0',
									}}
									onClick={() => {
										navigator.clipboard.writeText(createRoomURL())
									}}
								>
									<ContentCopyIcon fontSize="medium" />
								</Button>
							</Container>
						</Paper>
					</Grid>
				)}
			</Grid>

			<CustomDialog
				open={betweenWords}
				title={gameMessage}
				contentText={fullScreenCustomDialog}
				secondaryText={lastPlayedAnswer}
			>
				<Timer
					timer={timer}
					setTimer={setTimer}
					playerReady={playerReady}
					setPlayerReady={setPlayerReady}
					sx={{ maxHeight: '25px' }}
				/>
			</CustomDialog>
			<CustomDialog
				open={betweenRounds}
				title={gameMessage}
				contentText={fullScreenCustomDialog}
				roundScores={lastRoundScores}
			>
				<Timer
					timer={timer}
					setTimer={setTimer}
					playerReady={playerReady}
					setPlayerReady={setPlayerReady}
					sx={{ maxHeight: '25px' }}
				/>
				{lastRoundScores && (
					<Paper sx={{ padding: '1em' }}>
						<Typography variant="h5" sx={{ paddingBottom: '0.2em' }}>
							Results from the last round
						</Typography>
						<TableContainer>
							{lastRoundScores.map((anagram) => {
								return (
									<TableRow>
										<TableCell>{anagram.question.join(' ')}</TableCell>
										<TableCell>{anagram.answer}</TableCell>
										{anagram.scores[0].score > 0 && (
											<div>
												<TableCell sx={{ margin: 'auto' }}>
													<EmojiEventsIcon />
												</TableCell>
												<TableCell>{anagram.scores[0].username}</TableCell>
											</div>
										)}
									</TableRow>
								)
							})}
						</TableContainer>
					</Paper>
				)}
			</CustomDialog>

			<Paper sx={{ flexGrow: 1, height: 'auto', maxWidth: '95vw' }}>
				<Grid container spacing={2}>
					<Grid item xs={12} order={{ xs: 3, md: 1 }} md={3}>
						<Item sx={{ overflow: 'auto', minHeight: isMobile ? '' : '97%' }}>
							<PlayerList players={players} />
						</Item>
					</Grid>

					<Grid item xs={12} order={{ xs: 1, md: 2 }} md={6}>
						<Item
							sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'space-between',
								minHeight: '50vh',
							}}
						>
							{gameOver ? (
								<Scoreboard
									gameScores={gameScores}
									players={players}
									setPlayerReady={setPlayerReady}
								/>
							) : anagramWords.length === 0 &&
							  !betweenRounds &&
							  !betweenWords ? (
								<div>
									{' '}
									<Typography variant="h5" sx={{ marginTop: '1em' }}>
										Welcome to the game!
									</Typography>{' '}
									<Typography variant="h6" sx={{marginBottom:'1em'}}>
										When all players are ready the round will begin
									</Typography>
									<Typography>3 words per round, 3 rounds per game</Typography>
									<Typography>
										Faster you guess, the more points you get
									</Typography>
									<Typography sx={{marginBottom:'2em'}}>Click for a more detailed tutorial</Typography> 
									<Paper sx={{margin:'auto', padding:'1em', width:'30em'}}>
										<Typography >

										An anagram is a word or phrase formed by rearranging the
										letters of a different word or phrase, typically using all
										the original letters exactly once.
										</Typography>
									<Typography sx={{color:'black'}}>
									Wikipedia
										</Typography>	

								

									</Paper>
								</div>
							) : (
								<div
									sx={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'space-between',
										alignItems: 'space-between',
									}}
								>
									<PlayBox
										sx={{ height: 'auto' }}
										anagramWords={anagramWords}
										setAnagramWords={setAnagramWords}
										formattedAnswerArray={formattedAnswerArray}
										setFormattedAnswerArray={setFormattedAnswerArray}
										disabledButtons={disabledButtons}
										setDisabledButtons={setDisabledButtons}
										roundNumber={roundNumber}
										anagramNumber={anagramNumber}
										category={category}
										skippedOrCorrect={skippedOrCorrect}
										setSkippedOrCorrect={setSkippedOrCorrect}
										mode={mode}
										hint={hint}
										setHint={setHint}
										hints={hints}
										setHints={setHints}
										hintCount={hintCount}
										setHintCount={setHintCount}
										subcategory={subcategory}
									/>
									<PlayerControls
										sx={{ minWidth: '100%', flex: 1, justifySelf: 'flex-end' }}
										handleQuitButtonClick={handleQuitButtonClick}
										handleSkipButtonClick={handleSkipButtonClick}
										skippedOrCorrect={skippedOrCorrect}
										anagramWords={anagramWords}
										setAnagramWords={setAnagramWords}
										mode={mode}
									/>
								</div>
							)}
						</Item>
					</Grid>

					<Grid
						item
						xs={12}
						order={{ xs: 2, md: 3 }}
						md={3}
						sx={{ flexDirection: 'column', alignItems: 'baseline' }}
					>
						<Item>
							<Typography variant="h4">Messages</Typography>
							<Grid item xs={12} md={12}>
								<Box
									textAlign={'left'}
									sx={{
										height: '30em',
										overflow: 'auto',
										display: 'flex',
										flexDirection: 'column-reverse',
									}}
								>
									{gameScroll.map((item, index) => {
										return (
											<div key={index}>
												{item.username !== 'system' && (
													<Typography
														sx={{
															display: 'inline',
															color:
																mode.palette.mode === 'light'
																	? '#ef476f'
																	: '#00FF41',
														}}
													>
														{item.username}
														{' - '}
													</Typography>
												)}
												<Typography sx={{ display: 'inline' }}>
													{item.message}
												</Typography>
											</div>
										)
									})}
								</Box>
							</Grid>
						</Item>
					</Grid>
				</Grid>
				<Grid container spacing={2}>
					<Grid item xs={3} order={{ xs: 3, md: 1 }}></Grid>
					<Grid item xs={6} order={{ xs: 1, md: 2 }}></Grid>
					<Grid
						item
						sx={{
							maxWidth: 'auto',
							height: isMobile ? '' : '95%',
							width: 'auto',
							marginBottom: '1em',
						}}
						order={{ xs: 2, md: 2 }}
						xs={3}
					>
						{players.length > 1 && (
							<Paper
								sx={{
									display: 'flex',
									justifyContent: 'center',
									alignItems: 'center',
									height: '100%',
									marginLeft: '0.5em',
									marginRight: '0.5em',
									backgroundColor:
										mode.palette.mode === 'dark' ? '#1A2027' : '#E4DFDA',
								}}
							>
								<ChatInput sx={{ maxWidth: 'auto', maxHeight: '30em' }} />
							</Paper>
						)}
					</Grid>
				</Grid>
			</Paper>
		</Paper>
	)
}

export default GamePageGrid
