let dogs = 0;
let cats = 0;
let other = 0;
const queue = [];

const	CAT = 0;
const DOG = 1;
const NEITHER = 2;
const BOTH = 3;
const FIN = 'FIN';

const dogDiv = document.querySelector('#dogs');
const catDiv = document.querySelector('#cats');

const socket = io(); // eslint-disable-line no-undef
socket.on('cloudcats', m => {
	console.log(m);
	queue.push(m);
});

const addButton = document.querySelector('#add');
const progress = document.querySelector('#progress');
const main = document.querySelector('main');
const snackbar = document.querySelector('#snackbar');
addButton.addEventListener('click', () => {
	main.classList.add('cover2');
	main.classList.remove('cover');
	progress.style.display = 'block';
	dogs = 0;
	cats = 0;
	other = 0;
	socket.emit('start');
	snackbar.MaterialSnackbar.showSnackbar({
		message: 'Let\'s get started!'
	});
});

const dialog = document.querySelector('dialog');
dialog.querySelector('.close').addEventListener('click', () => {
	dialog.close();
});

function showDialog(data) {
	const dialogContent = document.querySelector('#dialogContent');
	const dialogTitle = document.querySelector('#dialogTitle');

	if (data.winner === 'tie') {
		dialogContent.textContent = 'There was a tie!? That was unfulfilling.';
		dialogTitle.textContent = 'TIE! TIE! TIE!';
	} else {
		dialogContent.textContent = 'It looks like the Internet really likes ' + data.winner + '. Who knew?';
		dialogTitle.textContent = data.winner + ' WIN!';
	}

	progress.style.display = 'none';
	dialog.showModal();
}

function processMessage(m) {
	if (m.type === FIN) {
		let winner;
		console.log('we are DONE');
		if (cats > dogs) {
			winner = 'CATS';
		} else if (dogs > cats) {
			winner = 'DOGS';
		} else {
			winner = 'tie';
		}

		showDialog({
			winner,
			dogs,
			cats,
			other
		});
	} else {
		const pic = document.createElement('div');
		pic.style.backgroundImage = 'url(' + m.url + ')';
		switch (m.type) {
			case DOG:
				dogs++;
				dogDiv.insertBefore(pic, dogDiv.firstChild);
				break;
			case CAT:
				cats++;
				catDiv.insertBefore(pic, catDiv.firstChild);
				break;
			case BOTH:
				cats++;
				dogs++;
				dogDiv.insertBefore(pic, dogDiv.firstChild);
				catDiv.insertBefore(pic, catDiv.firstChild);
				break;
			case NEITHER:
				other++;
				break;
			default:
				break;
		}
	}
}

setInterval(() => {
	if (queue.length > 0) {
		processMessage(queue.shift());
	}
}, 500);

