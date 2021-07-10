//@ts-check
const items = [
	'anchor',
	'anchor',
	'laugh',
	'laugh',
	'atom',
	'atom',
	'biking',
	'biking',
	'bomb',
	'bomb',
	'car',
	'car',
	'lightbulb',
	'lightbulb',
	'dove',
	'dove',
	'pizza-slice',
	'pizza-slice',
	'chess-king',
	'chess-king'
]

let showItems, previousItem, moves, stopwatch, timeDuration, cardMatched, stars

const shuffleItems = () => {
	items.sort(() => {
		return Math.random() - 0.5
	})
}

const renderStar = (count) => {
	const starsElm = document.querySelector('.stars')
	let starHTMLs = ''
	for (let i = 0; i < count; i++) {
		starHTMLs += '<i class="fas fa-star"></i>'
	}
	starsElm.innerHTML = starHTMLs
}

const renderCards = () => {
	const cardsElm = document.querySelector('.cards')
	let cardHTMLs = ''

	items.forEach((item, idx) => {
		cardHTMLs += `<div class="card animate__animated" data-item="${item}">
      <i class="fas fa-${item}"></i>
    </div>`
	})

	cardsElm.innerHTML = cardHTMLs
}

const updateMoves = () => {
	moves += 1
	const movesCountElm = document.querySelector('.moves__count')
	movesCountElm.innerText = moves

	//perform action on move
	if (moves === 1) {
		startTimer()
	} else if (moves === 30 || moves === 40) {
		stars -= 1
		renderStar(stars)
	}
}

const cardClickEvent = () => {
	const cardElms = document.querySelectorAll('.card')
	cardElms.forEach((elm) => {
		elm.addEventListener('click', (e) => {
			const cardElm = e.currentTarget
			const item = cardElm.dataset.item

			//return if already open card is clicked
			if (cardElm.classList.value.includes('open')) return

			cardElm.classList.add('open', 'animate__wobble')
			updateMoves()

			//logic to show or hide the card
			if (previousItem) {
				if (previousItem === item) {
					cardMatch(item)
					previousItem = ''
				} else {
					setTimeout(() => {
						cardNotMatch(item)
						cardNotMatch(previousItem)
						previousItem = ''
					}, 500)
				}
			} else {
				previousItem = item
			}
		})
	})
}

const cardMatch = (item) => {
	const itemElms = document.querySelectorAll(`[data-item=${item}]`)
	itemElms.forEach((elm) => {
		elm.classList.remove('animate__wobble')
		elm.classList.add('show', 'animate__rubberBand')
	})
	cardMatched += 2
	if (cardMatched === 20) {
		stopTimer()
		sweetAlert()
	}
}

const sweetAlert = () => {
	Swal.fire({
		title: 'Congratulations',
		icon: 'success',
		html: `
    <div>You won the game!</div>
    <div><b>Star Won : </b> ${stars}</div>
    <div><b>Moves Taken : </b> ${moves}</div>
    <div><b>Time Taken : </b> ${calculateDuration()}</div>
    `,
		showClass: {
			popup: 'animate__animated animate__fadeInDown'
		},
		hideClass: {
			popup: 'animate__animated animate__fadeOutUp'
		},
		allowOutsideClick: false,
		showDenyButton: true,
		showConfirmButton: false,
		denyButtonText: `Close`
	}).then((result) => {
		reset()
	})
}

const cardNotMatch = (item) => {
	const itemElms = document.querySelectorAll(`[data-item=${item}]`)
	itemElms.forEach((elm) => {
		elm.classList.remove('open', 'animate__wobble')
	})
}

const startTimer = () => {
	stopwatch = setInterval(() => {
		timeDuration += 1
		updateStopwatch()
	}, 1000)
}

const stopTimer = () => {
	clearInterval(stopwatch)
	updateStopwatch()
}

const updateStopwatch = () => {
	const value = calculateDuration()
	const stopwatchElm = document.querySelector('.stopwatch')
	stopwatchElm.innerText = value
}

const calculateDuration = () => {
	let temp = timeDuration
	const hour = Math.floor(temp / 3600)
	temp %= 3600
	const minutes = Math.floor(temp / 60)
	temp %= 60
	const seconds = temp
	return `${hour > 9 ? hour : '0' + hour}:${
		minutes > 9 ? minutes : '0' + minutes
	}:${seconds > 9 ? seconds : '0' + seconds}`
}

const reset = () => {
	showItems = []
	previousItem = ''
	moves = -1
	timeDuration = 0
	cardMatched = 0
	stars = 3
	shuffleItems()
	stopTimer()
	renderStar(stars)
	updateStopwatch()
	renderCards()
	cardClickEvent()
	updateMoves()
}

reset()
