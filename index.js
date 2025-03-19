let textBackground = document.querySelector(".coloredtxt");
let wobble = document.querySelectorAll(`#wobble`);
let stuffText = document.querySelector(`#stuff`);
let stuffStreakText = document.querySelector(`#stuffstreak`);
let discord = document.querySelector(`#discord`);
let secretSpace = document.querySelector(`.secret`);

let posX = 300;
let posY = 300;
let getBigger = true;

let wobbleIndex = [];
wobble.forEach((wob,i) => wobbleIndex[i]=0);

let stuffIndex = 0;
let stuffStreak = 0;
let stuffList = [
	"stuff I made",
	"stuff I did",
	"stuff I do",
	"stuff I'll keep doing",
	"stuff I'll not stop doing",
	"stuff I hopefully do more of",
	"stuff I hopefully not do less of",
	"stuff I like doing",
	"stuff I don't hate doing",
	"looks like I've ran out of things to add here",
	"thank you, back to the first line"
]

function animate() {
	posX += 0.2;
	posY += 0.2;
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
	secretSpace.innerHTML = "secret for a secret"
})

discord.addEventListener("click", () => {
	alert("just namefix");
})

secretSpace.addEventListener("click", () => {
	alert("don't touch me!")
})

textBackground.addEventListener("mouseover", () => {
	document.body.classList.add("bg-active");
	textBackground.classList.add("coloredtxt-active");
	secretSpace.classList.add("begone");
})

textBackground.addEventListener("mouseout", () => {
	document.body.classList.remove("bg-active");
	textBackground.classList.remove("coloredtxt-active");
	secretSpace.classList.remove("begone");
})

