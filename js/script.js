//configuration
const dificultyChangeRate =5000

var ballAnimationDuration = 1000
var obsRate = 0.7
var obsDuration = 3500
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
var dificultyInterval = null

//update message
updateMessage("Press spacebar/tap to start.")
//update max score
updateMaxScore()
//update ball animation duration
udateBallAnimationDuration(ballAnimationDuration)

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
        }, ballAnimationDuration-50)
    }
})

//on touch
window.addEventListener('touchstart',() => {
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
        }, ballAnimationDuration-50)
    }
})

//create a new obstacle
function createObs(){
    if(!isStarted || isGameOver) return;

    var obs = document.createElement('div')
    var date = new Date()

    var delay = ballAnimationDuration/2000 + Math.random()*1
    
    obs.classList.add('obs')
    obs.id = "obs"+date.getMilliseconds()
    obs.style.left = 110+"%"
    obs.style.animationDuration = obsDuration/1000+"s"
    obs.style.animationDelay = delay+"s"
    
    //add obs element into the game
    game.appendChild(obs)
    //remove the added obs element from the game adter 5000ms
    removeObsTimeout = setTimeout(function(){
        if(!isGameOver)
        game.removeChild(obs)
    }, obsDuration+delay*1000)
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
    console.log("duration: "+obsDuration+", rate: "+obsRate);
}

//update dificulty
function updateDificulty(){
    if(obsDuration>50){
        // obsDuration -= 50;
        obsRate += 0.1
        ballAnimationDuration -= 50
        clearInterval(createObs)
        setInterval(createObs, 1000/obsRate)
        udateBallAnimationDuration(ballAnimationDuration)
    }
}

//update ball animation duration
function udateBallAnimationDuration(duration){
    ball.style.animationDuration = duration/1000+"s"
}

//start the game
function startGame(){
    //remove any obs if available
    obs.forEach(item=>{
        game.removeChild(item)
    })

    //reset configuration
    ballAnimationDuration = 1000
    obsRate = 0.7
    obsDuration = 3500
    isStarted = true
    isGameOver = false
    score = 0

    // set ball animation state to running
    ball.style.animationPlayState = 'running'
    //set a timeout for removing ball animation class
    ballTimeout = setTimeout(function(){
        ball.classList.remove('bounce')
    }, ballAnimationDuration)

    //setting intervals
    updateScoreInterval = setInterval(updateScore, 100)
    checkGameInterval = setInterval(checkGame, 5)
    newObsInterval =  setInterval(createObs, 1000/obsRate)
    // dificultyInterval = setInterval(updateDificulty, dificultyChangeRate)
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
    clearInterval(dificultyInterval)
}

//game over
function gameOver(){
    obs.forEach(item => {
        item.style.animationPlayState = 'paused'
    })
    stopGame()
    updateMessage("Gameover! <br>Press spacebar/tap to start again.")
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

//update the max score value
function setMaxScore(score) {
    localStorage.setItem('maxScore', score)
}
//update max score in the game
function updateMaxScore() {
    document.querySelector('#maxscore').innerHTML = "Max score: "+getMaxScore()
}
//get max score
function getMaxScore() {
    if(localStorage.getItem('maxScore'))
        return localStorage.getItem('maxScore')
    else
        return 0
}