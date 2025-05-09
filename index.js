let sinAnimation = [];
let lastTimestamp = 0;
let elapsedTime = 0;
let speedMul = 1;

const logoDescs = document.querySelectorAll('.logo-desc-container .logo-desc');

let minigameStatus = false;
let hideClasses = [".logo-desc-container", ".title-projects", ".projects-box", ".socials-box", ".footer-text"];
const logo = document.querySelector(".logo");

function startup() {
    if (logoDescs) {
        logoDescs.forEach(logoDesc => {
            const textArray = logoDesc.textContent.trim().split('');
            logoDesc.textContent = '';
        
            textArray.forEach(char => {
                const charSpan = document.createElement('span');
                if(char === " ") {
                    charSpan.innerHTML = "&nbsp;";
                    charSpan.style.display = "inline";
                }
                else {
                    charSpan.textContent = char;
                }
                charSpan.classList.add('sinChar');
                charSpan.style.transform = "translateY(10px)";
                logoDesc.appendChild(charSpan);
                if(char !== " ") sinAnimation.push(charSpan);
            });

            logoDesc.addEventListener("click", () => {
                speedMul = Math.random()*4;
            });
        });
    }
};
startup();

function draw(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = (timestamp - lastTimestamp) / 1000; // seconds
    lastTimestamp = timestamp;
    
    elapsedTime += delta;
    
    sinAnimation.forEach((sin, index) => {
        let newY = Math.sin(elapsedTime*speedMul + index/2) * 10 *speedMul;
        if(index < 9) newY = -newY;
        sin.style.transform = `translateY(${newY}px)`;
    });
    
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

logo.addEventListener("click", e => {
    minigameStatus = !minigameStatus;

    hideClasses.forEach(cls => {
        console.log(cls)
        document.querySelectorAll(cls).forEach(i => minigameStatus ? i.classList.add("hide") : i.classList.remove("hide"));
    })
});