let textBackground = document.querySelector(".coloredtxt");
let wobble = document.querySelectorAll(`#wobble`);
let stuffText = document.querySelector(`#stuff`);
let stuffStreakText = document.querySelector(`#stuffstreak`);

let posX = 300;
let posY = 300;
let getBigger = true;

let wobbleIndex = [];
wobble.forEach((wob,i) => wobbleIndex[i]=0);

let stuffIndex = 0;
let stuffStreak = 0;
let stuffList = [
	"stuff I made",
	"stuff I do",
	"stuff I try to do?",
	"stuff I'll keep doing?",
	"stuff I <i>maybe</i> do?",
	"stuff I hopefully do more of",
	"stuff I probably do",
	"stuff I like doing",
	"stuff I don't hate doing",
	"it looks like I've ran out of things to add here",
	"well it's nice knowing ya, back to the first line"
]

function animate() {
	posX += 0.1;
	posY += 0.1;
	textBackground.style = `background-position: ${posX}px ${posY}px;`;

	animateWobble();

	requestAnimationFrame(animate);
}

function animateWobble() {
	wobble.forEach((char,i) => {
		wobbleIndex[i] += (Math.sin(new Date().getSeconds())/8) * Math.random();
		char.style = `transform: translateY(${wobbleIndex[i]}px)`;
	})
}

requestAnimationFrame(animate);

stuffText.addEventListener("click", () => {
	stuffIndex++;
	if(stuffIndex >= stuffList.length) { 
		stuffIndex = 0;
		stuffStreak++;
		stuffStreakText.innerHTML = "streak x"+stuffStreak;
	}
	stuffText.innerHTML = stuffList[stuffIndex];
})

