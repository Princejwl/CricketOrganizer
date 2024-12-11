// Match variables and DOM Elements
const landingScreen = document.getElementById("landing-screen");
const inputScreen = document.getElementById("input-screen");
const scoreboard = document.getElementById("scoreboard");
const matchResult = document.getElementById("match-result");

const createScorecardBtn = document.getElementById("create-scorecard-btn");
const startMatchBtn = document.getElementById("start-match-btn");

const teamANameInput = document.getElementById("team-a-name");
const teamBNameInput = document.getElementById("team-b-name");
const oversInput = document.getElementById("overs");
const teamAPlayersInput = document.getElementById("team-a-players");
const teamBPlayersInput = document.getElementById("team-b-players");

const scoreDisplay = document.getElementById("score");
const matchInfo = document.getElementById("teams");
const batsmenDisplay = document.getElementById("batsmen");

const strikerSelect = document.getElementById("striker");
const nonStrikerSelect = document.getElementById("non-striker");

const actionButtons = document.querySelectorAll("#actions button");

let teamA = { name: "", score: 0, wickets: 0, balls: 0, players: [] };
let teamB = { name: "", score: 0, wickets: 0, balls: 0, players: [] };

// Toss Screen Elements
const tossScreen = document.getElementById("toss-screen");
const teamATossBtn = document.getElementById("team-a-toss-btn");
const teamBTossBtn = document.getElementById("team-b-toss-btn");
const batBtn = document.getElementById("bat-btn");
const bowlBtn = document.getElementById("bowl-btn");
const tossWinnerText = document.getElementById("toss-winner");

let tossWinner = ""; // Toss winner's team name
let currentTeam = teamA;

let striker = "";
let nonStriker = "";
let matchOvers = 0;
let teamACompleted = false; // Track if Team A's innings are completed
let teamBCompleted = false; // Track if Team B's innings are completed

// Screen Navigation
createScorecardBtn.addEventListener("click", () => {
  landingScreen.style.display = "none";
  inputScreen.style.display = "block";
});

startMatchBtn.addEventListener("click", () => {
  const teamAName = teamANameInput.value.trim();
  const teamBName = teamBNameInput.value.trim();
  const overs = parseInt(oversInput.value);
  const teamAPlayers = teamAPlayersInput.value.split(",").map((p) => p.trim());
  const teamBPlayers = teamBPlayersInput.value.split(",").map((p) => p.trim());

  if (!teamAName || !teamBName || isNaN(overs) || overs <= 0 || teamAPlayers.length < 2 || teamBPlayers.length < 2) {
    alert("Please provide valid inputs!");
    return;
  }

  teamA = { name: teamAName, score: 0, wickets: 0, balls: 0, players: teamAPlayers };
  teamB = { name: teamBName, score: 0, wickets: 0, balls: 0, players: teamBPlayers };
  matchOvers = overs;

  inputScreen.style.display = "none";
  tossScreen.style.display = "block";

  teamATossBtn.textContent = teamA.name;
  teamBTossBtn.textContent = teamB.name;
});

// Select toss winner
teamATossBtn.addEventListener("click", () => {
  tossWinner = teamA.name;
  tossWinnerText.textContent = `${teamA.name} wins the toss!`;
});

teamBTossBtn.addEventListener("click", () => {
  tossWinner = teamB.name;
  tossWinnerText.textContent = `${teamB.name} wins the toss!`;
});

// Choose Bat or Bowl
batBtn.addEventListener("click", () => {
  currentTeam = tossWinner === teamA.name ? teamA : teamB;
  startMatch();
});

bowlBtn.addEventListener("click", () => {
  currentTeam = tossWinner === teamA.name ? teamB : teamA;
  startMatch();
});

// Start Match Function
function startMatch() {
  tossScreen.style.display = "none";
  scoreboard.style.display = "block";

  batsmenDisplay.textContent = "";
  scoreDisplay.textContent = `${currentTeam.name}: 0/0 (0.0 Overs)`;
  populateDropdowns(currentTeam.players);
}

// Populate player dropdowns
function populateDropdowns(players) {
  const options = players.map((p) => `<option value="${p}">${p}</option>`).join("");
  strikerSelect.innerHTML = options;
  nonStrikerSelect.innerHTML = options;
}

function updateScore(runs, isExtra = false) {
  currentTeam.score += runs;
  if (!isExtra) {
    currentTeam.balls++;
  }

  const oversCompleted = Math.floor(currentTeam.balls / 6);
  const ballsInCurrentOver = currentTeam.balls % 6;

  scoreDisplay.textContent = `${currentTeam.name}: ${currentTeam.score}/${currentTeam.wickets} (${oversCompleted}.${ballsInCurrentOver} Overs)`;

  if (currentTeam.wickets >= currentTeam.players.length || oversCompleted >= matchOvers) {
    currentTeam === teamA ? (teamACompleted = true) : (teamBCompleted = true);
    displayResult(currentTeam);
    if (!teamACompleted || !teamBCompleted) {
      switchTeam();
    } else {
      showFinalResult();
    }
  }
}

function switchTeam() {
  currentTeam = currentTeam === teamA ? teamB : teamA;
  currentTeam.balls = 0;
  batsmenDisplay.textContent = "";
  scoreDisplay.textContent = `${currentTeam.name}: 0/0 (0.0 Overs)`;
  populateDropdowns(currentTeam.players);
}

function displayResult(team) {
  const resultText = `${team.name}: ${team.score}/${team.wickets} (${Math.floor(team.balls / 6)}.${team.balls % 6} Overs)`;
  document.getElementById(team === teamA ? "team-a-result" : "team-b-result").textContent = resultText;
  matchResult.style.display = "block";
}

function showFinalResult() {
  const winnerText = teamA.score > teamB.score
    ? `${teamA.name} Wins!`
    : teamA.score < teamB.score
      ? `${teamB.name} Wins!`
      : "It's a Tie!";
  document.getElementById("winner").textContent = winnerText;
}

// Add button actions for scoring and wickets
actionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    switch (action) {
      case "addRun":
        updateScore(1);
        break;
      case "twoRuns":
        updateScore(2);
        break;
      case "threeRuns":
        updateScore(3);
        break;
      case "four":
        updateScore(4);
        break;
      case "six":
        updateScore(6);
        break;
      case "noBall":
        updateScore(1, true);
        break;
      case "wide":
        updateScore(1, true);
        break;
      case "out":
        currentTeam.wickets++;
        updateScore(0);
        break;
      default:
        break;
    }
  });
});

const backToInputBtn = document.getElementById("back-to-input");

backToInputBtn.addEventListener("click", () => {
  scoreboard.style.display = "none";
  inputScreen.style.display = "block";
});
