const roomsMap = require("./roomsDatabase");

const {
  setAnagrams,
  testAllPlayersGuessedCorrectly,
  testAttempt,
  increaseRoomCurrentWord,
} = require("./controllers/anagram-controller");
const {
  startGameEmit,
  betweenWordStage,
  anagramStage,
  betweenRoundStage,
} = require("./controllers/game-controller");
const {
  updatePlayerScore,
  playerReady,
  pushPlayerlistToClients,
} = require("./controllers/player-controller");
const {
  createNewRoom,
  resetReadyStateAndCurrentWord,
  populateScoreboard,
} = require("./controllers/room-controller");
const { killTimer, startTimer } = require("./controllers/timer-controller");
const { getAnagrams } = require("./models/anagram-model");
const io = require("./server.js");
const {
  getRoomIdFromSocket,
  anagramTime,
  timeBetweenRounds,
  timeBetweenWords,
  numOfWords,
} = require("./utils");

const newSession = (socket, callback) => {
  const roomId = createNewRoom(socket, callback);
  getAnagrams().then((anagrams) => {
    setAnagrams(roomId, anagrams);
  });
};

const resetSession = (roomId) => {
  const roomData = roomsMap.get(roomId);
  io.ioObject.in(roomId).emit("endGame", roomData.anagrams);
  endGame(roomId); ///////// <<<<<<<<<<<<
  resetReadyStateAndCurrentWord(roomId);
  getAnagrams(roomId).then((anagrams) => {
    setAnagrams(roomId, anagrams);
  });
};

const handlePlayerReady = (socket) => {
  const roomId = getRoomIdFromSocket(socket);
  const roomData = roomsMap.get(roomId);
  playerReady(socket);
  pushPlayerlistToClients(roomId);

  let playerReadyStatus = [];
  roomData.players.forEach((player) => {
    playerReadyStatus.push(player.readyToStartGame);
  });
  if (playerReadyStatus.every((item) => item)) {
    populateScoreboard(roomId);
    handleStartGame(roomId);
  }
};

const handleStartGame = async (roomId) => {
  startGameEmit(roomId);
  await startTimer(timeBetweenWords, roomId);
  anagramStage(roomId);
  await startTimer(anagramTime, roomId);
  nextWord(roomId);
};
const nextWord = async (roomId) => {
  const roomData = roomsMap.get(roomId);

  if (roomData.currentWord < 2 && (roomData.currentWord + 1) % 3 === 0) {
    betweenRoundStage(roomId);
    await startTimer(timeBetweenRounds, roomId);
  } else {
    betweenWordStage(roomId);
    await startTimer(timeBetweenWords, roomId);
  }
  anagramStage(roomId);
  await startTimer(anagramTime, roomId);

  if (roomData.currentWord === numOfWords - 1) {
    resetSession(roomId);
    return;
  } else {
    increaseRoomCurrentWord(roomId);
    nextWord(roomId);
  }
};

const handleTestAttempt = (socket, attempt, time, hintCount) => {
  const roomId = getRoomIdFromSocket(socket);
  const roomData = roomsMap.get(roomId);
  const result = testAttempt(socket, attempt, time, hintCount);
  if (result) {
    updatePlayerScore(roomId, socket.data.username, result);
    pushPlayerlistToClients(roomId);
    const allPlayersCorrect = testAllPlayersGuessedCorrectly(socket, result);
    if (allPlayersCorrect && roomData.currentWord === 8) {
      killTimer(roomId);
      resetSession(roomId);
    } else if (allPlayersCorrect) {
      killTimer(roomId);
      betweenWordStage(
        roomId,
        `All players guessed correctly, you got ${result} points`
      );
    }
  }
};

module.exports = {
  newSession,
  handleTestAttempt,
  handlePlayerReady,
};
