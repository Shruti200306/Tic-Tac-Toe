let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msgcontainer");
let msg = document.querySelector("#msg");

let turnO = true; // player O starts

// Reliable free sound URLs
const moveSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");
const winSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
const drawSound = new Audio("https://actions.google.com/sounds/v1/cartoon/concussive_drum_hit.ogg");

// Preload sounds
moveSound.preload = "auto";
winSound.preload = "auto";
drawSound.preload = "auto";

// Helper: play safely (avoids errors if browser blocks autoplay)
function playSound(sound) {
    sound.currentTime = 0; // restart if already playing
    sound.play().catch(err => {
        console.log("Sound blocked:", err);
    });
}

const winpatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
];

const resetGame = () => {
    turnO = true;
    enableBoxes();
    msgContainer.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turnO) { 
            box.innerText = "O";   
            turnO = false;
        } else { 
            box.innerText = "X";
            turnO = true;
        }
        box.disabled = true;

        playSound(moveSound); // ✅ safe play
        checkWinner();
    });
});

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.style.backgroundColor = ""; // reset highlight if added
    }
};

const showWinner = (winner, pattern) => {
    msg.innerText = `🎉 Congratulations, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    // highlight winning boxes
    pattern.forEach(i => {
        boxes[i].style.backgroundColor = "#90ee90"; // light green highlight
    });

    // delay sound a bit so UI updates first
    setTimeout(() => {   
        playSound(winSound);
    }, 150);
};

const checkWinner = () => {
    for (let pattern of winpatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;
      
        if (pos1Val !== "" && pos2Val !== "" && pos3Val !== "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {  
                showWinner(pos1Val, pattern);
                return;
            }
        }
    }

    // check for draw only if no winner
    let filled = [...boxes].every(box => box.innerText !== "");
    if (filled) {
        msg.innerText = "😅 It's a Draw!";
        msgContainer.classList.remove("hide");
        disableBoxes();
        setTimeout(() => playSound(drawSound), 150);
    }
};

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);
