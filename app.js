const state = {
    numCells: (600 / 40) * (600 / 40),
    cells: [],
    shipPosition: 217,
    alienPosition: [
        3, 4, 5, 6, 7, 8, 9, 10, 11,
        18, 19, 20, 21, 22, 23, 24, 25, 26,
        33, 34, 35, 36, 37, 38, 39, 40, 41,
        48, 49, 50, 51, 52, 53, 54, 55, 56
    ],
    gameover: false,
    score: 0

}

const setupGame = (element) => {
    state.element = element
    // do all things needed to draw the game
    // draw the grid
    drawGrid()
    // draw the spaceship
    drawShip()
    // draw the aliens
    drawAliens()
    // add the instructions and the score
    drawScoreboard()
}

const drawGrid = () => {
    // create the containing element
    const grid = document.createElement('div')
    grid.classList.add('grid')

    // create a lot of cells - 15x15 (225)
    for (let i = 0; i < state.numCells; i++) {
        // create a cell
        const cell = document.createElement('div')
        // append the cell to the grid
        grid.append(cell)
        // store the cell in game state
        state.cells.push(cell)
    }

    // append the cells to the containing element and the containing element to the app
    state.element.append(grid)
}

const drawShip = () => {
    state.cells[state.shipPosition].classList.add('spaceship')
    // find the bottom row, middle cell (from game state) add a bg image.
}

const controlShip = (event) => {
    if (state.gameover) return
    //if the key pressed is left
    if (event.code === 'ArrowLeft') {
        moveShip('left')
        // if right        
    } else if (event.code === 'ArrowRight') {
        moveShip('right')
        // if space
    } else if (event.code === 'Space') {
        fire()
    }
}

const moveShip = (direction) => {
    // remove image from current cell position
    state.cells[state.shipPosition].classList.remove('spaceship')
    // figure out the delta
    if (direction === 'left' && state.shipPosition % 15 !== 0) {
        state.shipPosition--
    } else if (direction === 'right' && state.shipPosition % 15 !== 14) {
        state.shipPosition++
    }
    // add image to new cell position
    state.cells[state.shipPosition].classList.add('spaceship')
}

const fire = () => {
    // use an interval: run some code repeatedly each time after a specific time
    let interval;
    // laser starts at the ship position
    let laserPosition = state.shipPosition
    interval = setInterval(() => {
        // remove the laser image
        state.cells[laserPosition].classList.remove('laser')
        // decrease (move up a row) the laser position
        laserPosition -= 15
        // check we are still in bounds!
        if (laserPosition < 0) {
            clearInterval(interval)
            return
        }

        //if there's an alien BOOM!
        //clear the interval, remove the alien image, remove the alien from the alien positions, add the BOOM image, set a timeout to remove the BOOM image.
        if (state.alienPosition.includes(laserPosition)) {
            clearInterval(interval)
            state.alienPosition.splice(state.alienPosition.indexOf(laserPosition), 1)
            state.cells[laserPosition].classList.remove('alien', 'laser')
            state.cells[laserPosition].classList.add('hit')
            state.score++
            state.scoreElement.innerText = state.score
            setTimeout(() => {
                state.cells[laserPosition].classList.remove('hit')
            }, 200)
            return
        }

        // add the laser image
        state.cells[laserPosition].classList.add('laser')

    }, 100)
}

const drawAliens = () => {
    //adding the alients to the grid -> we need to store the aliens in our game state
    state.cells.forEach((cell, index) => {
        //remove any alien images
        if (cell.classList.contains('alien')) {
            cell.classList.remove('alien')

        }
        //add the image to the cell if the index is in the set of alien position
        if (state.alienPosition.includes(index)) {
            cell.classList.add('alien')
        }
    })
}

const play = () => {
    // start the march of the aliens!
    let interval
    //starting direction
    let direction = 'right'
    interval = setInterval(() => {
        //if right, increase the position by 1
        if (direction === 'right') {
            //if right and at the edge, increase position by 15, move left, decrease 1
            if (atEdge('right')) {
                movement = 15 - 1
                direction = 'left'
            } else {
                //if right, increase the position by 1
                movement = 1
            }
        } else if (direction === 'left') {
            //if left and at the edge, increase position by 15, increase 1
            if (atEdge('left')) {
                movement = 15 + 1
                direction = 'right'
            } else {
                // if left, decrease the position by 1
                movement = -1
            }
        }
        //update the alien positions
        state.alienPosition = state.alienPosition.map(position => position + movement)
        //redraw aliens on the page
        drawAliens()
        checkGameState(interval)
    }, 400)
    // set up the ship controls
    window.addEventListener('keydown', controlShip)
}


const atEdge = (side) => {
    if (side === 'left') {
        // are any aliens in the left hand column?
        return state.alienPosition.some(position => position % 15 === 0)
    } else if (side === 'right') {
        // are any aliens in the right hand column?
        return state.alienPosition.some(position => position % 15 === 14)
    }
}

const checkGameState = (interval) => {
    //has the aliens got to the bottom? 
    //has the aliens all DEAD?!
    if (state.alienPosition.length === 0) {
        //stop everything
        state.gameover = true
        //stop the interval
        clearInterval(interval)
        drawMessage("HUMAN WINS!")
    } else if (state.alienPosition.some(position => position >= state.shipPosition)) {
        clearInterval(interval)
        state.gameover = true
        //make ship go BOOM!
        //remove the ship image, add the explosion image
        state.cells[state.shipPosition].classList.remove('spaceship')
        state.cells[state.shipPosition].classList.add('hit')
        drawMessage("GAME OVER!")

    }
}

const drawMessage = (message) => {
    //create a message
    const messageElement = document.createElement('div')
    messageElement.classList.add('message')
    //create the heading text
    const h1 = document.createElement('h1')
    h1.innerText = message
    messageElement.append(h1)
    //apend it to the app

    state.element.append(messageElement)
}

const drawScoreboard = () => {
    const heading = document.createElement("h1")
    heading.innerText = 'Space Invaders'
    const paragraph1 = document.createElement("p")
    paragraph1.innerText = 'Press SPACE to shoot.'
    const paragraph2 = document.createElement("p")
    paragraph2.innerText = 'Press ← and → to move'
    const scoreboard = document.createElement('div')
    scoreboard.classList.add('scoreboard')
    const scoreElement = document.createElement('span')
    scoreElement.innerText = state.score
    const heading3 = document.createElement('h3')
    heading3.innerText = 'Score: '
    heading3.append(scoreElement)
    scoreboard.append(heading, paragraph1, paragraph2, heading3)

    state.scoreElement = scoreElement
    state.element.append(scoreboard)
}

// query the page for the place to insert my game
const appElement = document.querySelector('.app')

//do all things needed to draw the game
setupGame(appElement)
//play the game - start being to able to move the ship, move alients
play()
