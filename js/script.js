//configuration
const obsDuration = 0.2
const dificultyInterval = 1500
const removeBounceClassTimeout = 900

var isStarted = false;
var isGameOver = false;
var score = 0;

var game = document.querySelector('.game')
var ball = document.querySelector('.ball')
var obs = document.querySelectorAll('.obs')

//intervals
var updateScoreInterval = null
var checkGameInterval = null
var newObsInterval =  null
var removeObsTimeout = null
var ballTimeout = null

//update message
updateMessage("Press spacebar to start.")
//update max score
updateMaxScore()

//on keypress
window.addEventListener('keypress', (e) =>{
    //start the game
    if(!isStarted){
        startGame()
    }
    // reset the game
    if(e.key == '0'){
        gameOver()
        setMaxScore(0)
        updateMaxScore()
    }
    
    //bounsing
    if(e.key == ' ' && !ball.classList.contains('bounce')){
        ball.classList.add('bounce')
        
        //remove bounce class
        ballTimeout = setTimeout(function(){
            ball.classList.remove('bounce')
        }, removeBounceClassTimeout)
    }
})

//on touch
window.addEventListener('touchstart',(e) => {
    //start the game
    if(!isStarted){
        startGame()
    }
    
    //bounsing
    if(!ball.classList.contains('bounce')){
        ball.classList.add('bounce')
        
        //remove bounce class
        ballTimeout = setTimeout(function(){
            ball.classList.remove('bounce')
        }, removeBounceClassTimeout)
    }
})

//create a new obstacle
function createObs(){
    if(!isStarted || isGameOver) return;

    var obs = document.createElement('div')
    var date = new Date()
    
    obs.classList.add('obs')
    obs.id = "obs"+date.getMilliseconds()
    obs.style.left = 100+Math.random()*50+"%"
    obs.style.animationDuration = obsDuration*1000
    
    //add obs element into the game
    game.appendChild(obs)
    //remove the added obs element from the game adter 5000ms
    removeObsTimeout = setTimeout(function(){
        if(!isGameOver)
        game.removeChild(obs)
    }, 5000)
}

// check game over
function checkGame(){
    if(!isStarted) return;
    //get ball positions
    var bstyle = ball.getBoundingClientRect()

    //update obs
    obs = document.querySelectorAll('.obs')
    
    obs.forEach(item =>{
        //get obs positions
        var obsStyle = item.getBoundingClientRect()
        //checking if the ball hits an obs or not
        var conX = bstyle.right>=obsStyle.left && bstyle.left<obsStyle.right || bstyle.right>=obsStyle.left && bstyle.left<obsStyle.right;
        var conY = bstyle.bottom>obsStyle.top
        
        if(conX && conY){
            clearTimeout(ballTimeout)
            ball.style.animationPlayState = 'paused'
            gameOver()
        }
    })
}
//update score
function updateScore(){
    if(!isStarted) return;
    // console.log(score);
    document.querySelector('#score').innerHTML = "Score: "+score
    score++
}

//start the game
function startGame(){
    //remove any obs if available
    obs.forEach(item=>{
        game.removeChild(item)
    })

    isStarted = true
    isGameOver = false
    score = 0

    // set ball animation state to running
    ball.style.animationPlayState = 'running'
    //set a timeout for removing ball animation class
    ballTimeout = setTimeout(function(){
        ball.classList.remove('bounce')
    }, removeBounceClassTimeout)

    //setting intervals
    updateScoreInterval = setInterval(updateScore, 100)
    checkGameInterval = setInterval(checkGame, 5)
    newObsInterval =  setInterval(createObs, dificultyInterval)
    updateMessage("")
}

//stop the game
function stopGame(){
    isStarted = false
    isGameOver = true
    clearInterval(newObsInterval)
    clearInterval(checkGameInterval)
    clearInterval(updateScoreInterval)
    clearTimeout(removeObsTimeout)
}

//game over
function gameOver(){
    obs.forEach(item => {
        item.style.animationPlayState = 'paused'
    })
    stopGame()
    updateMessage("Gameover! <br>Press spacebar to start again.")
    console.log("Gameover");

    //update max score
    if(score>getMaxScore()){
        setMaxScore(score-1)
    }
    //update score
    updateMaxScore()
}

//update message
function updateMessage(_msg){
    document.querySelector('#msg').innerHTML = _msg
}

function setMaxScore(score) {
    localStorage.setItem('maxScore', score)
}
function updateMaxScore() {
    document.querySelector('#maxscore').innerHTML = "Max score: "+getMaxScore()
}
function getMaxScore() {
    if(localStorage.getItem('maxScore'))
        return localStorage.getItem('maxScore')
    else
        return 0
}