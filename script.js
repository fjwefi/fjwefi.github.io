import { updateGround, setupGround} from "./ground.js";
import { updateDino, setupDino, setDinoLose, getDinoRect } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const WORLD_WIDTH = 100
const World_Heigt = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, {once: true})

let lastTime
let speedScale
let score

function update(time){
    if(lastTime == null){
        lastTime = time
        window.requestAnimationFrame(update)
        return
    }
    const delta = time -lastTime

    updateGround(delta, speedScale)
    updateDino(delta, speedScale)
    updateCactus(delta, speedScale)
    updateSpeedScale(delta)
    updateScore(delta)
    if(checkLose()) return handleLose()
    lastTime = time
    window.requestAnimationFrame(update)
}

function checkLose(){
    const dinoRect = getDinoRect()
    return getCactusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2){
    return(
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

function updateSpeedScale(delta){
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta){
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}

function handleStart(){
    lastTime = null
    speedScale = 1
    score = 0
    setupGround()
    setupDino()
    setupCactus()
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose(){
    setDinoLose()
    setTimeout(()=> {
        document.addEventListener("keydown", handleStart, {once: true})
        startScreenElem.classList.remove("hide")
    }), 100
}

function setPixelToWorldScale(){
    let wordTopixelScale
    if(window.innerWidth / window.innerHeight < WORLD_WIDTH / World_Heigt) {
        wordTopixelScale = window.innerWidth / WORLD_WIDTH
    } else {
        wordTopixelScale = window.innerHeight / World_Heigt
    }
    worldElem.style.width = `${WORLD_WIDTH * wordTopixelScale}px`
    worldElem.style.height = `${World_Heigt * wordTopixelScale}px`
}
