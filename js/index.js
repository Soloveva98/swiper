/*
{ name: "Дженсен Эклс", imgUrl: "https://www.kinopoisk.ru/picture/3053486/" },
		{ name: "Джаред Падалеки", imgUrl: "https://www.kinopoisk.ru/picture/957159/" },
		{ name: "Джеффри Дин Морган", imgUrl: "https://www.kinopoisk.ru/picture/3029012/" },
		{ name: "Рут Коннелл", imgUrl: "https://www.kinopoisk.ru/picture/2693701/" },
		{ name: "Кэти Кэссиди", imgUrl: "https://www.kinopoisk.ru/picture/1072794/" },
		{ name: "Миша Коллинз", imgUrl: "https://www.kinopoisk.ru/picture/1008894/" },
		{ name: "Мэг Доннелли", imgUrl: "https://www.kinopoisk.ru/picture/3573419/" },
		{ name: "Эйми Гарсиа", imgUrl: "https://www.kinopoisk.ru/picture/2633438/" },
*/


class Card {
	constructor({
		imageUrl,
		onDismiss,
		onLike,
		onDislike
	}) {
		this.imageUrl = imageUrl;
		this.onDismiss = onDismiss;
		this.onLike = onLike;
		this.onDislike = onDislike;
		this.init();
	}

	startPoint;
	offsetX;
	offsetY;

	init = () => {
		const card = document.createElement('div');
		card.classList.add('card');
		const img = document.createElement('img');
		img.src = this.imageUrl;
		card.append(img);
		this.element = card;
		this.listenToMouseEvents();
	};

	listenToMouseEvents = () => {
		this.element.addEventListener('mousedown', ({ clientX, clientY }) => {
			this.startPoint = { x: clientX, y: clientY };
			document.addEventListener('mousemove', this.handleMouseMove);
		});

		this.element.style.transition = '';
		document.addEventListener('mouseup', this.handleMouseUp);

		this.element.addEventListener('dragstart', (e) => {
			e.preventDefault();

		})
	};

	handleMouseMove = ({ clientX, clientY }) => {
		if (!this.startPoint) return;
		this.offsetX = clientX - this.startPoint.x;
		this.offsetY = clientY - this.startPoint.y;

		const rotate = this.offsetX * 0.1;

		this.element.style.transform = `translate(${this.offsetX}px, ${this.offsetY}px) rotate(${rotate}deg)`;

		if (Math.abs(this.offsetX) > this.element.clientWidth * 0.7) {
			const direction = this.offsetX > 0 ? 1 : -1;
			this.dismiss(direction);
		}
	};

	handleMouseUp = () => {
		this.startPoint = null;
		document.removeEventListener('mousemove', this.handleMouseMove);
		this.element.style.transition = 'transform 0.5s';
		this.element.style.transform = '';
	};

	dismiss = (direction) => {
		this.startPoint = null;
		document.removeEventListener('mouseup', this.handleMouseUp);
		document.removeEventListener('mousemove', this.handleMouseMove);

		this.element.style.transition = 'transform 1s';
		this.element.style.transform = `translate(${direction * window.innerWidth}px, ${this.offsetY}px) rotate(${90 * direction}deg)`;
		this.element.classList.add('dismissing');

		setTimeout(() => {
			this.element.remove();
		}, 1000);

		if (typeof this.onDismiss === 'function') {
			this.onDismiss();
		}

		if (typeof this.onLike === 'function' && direction === 1) {
			this.onLike();
			console.log('like')
		}

		if (typeof this.onDislike === 'function' && direction === -1) {
			this.onDislike();
			console.log('dislike')
		}
	}


};


const swiper = document.querySelector('.swiper');
const like = document.querySelector('.like');
const dislike = document.querySelector('.dislike');

const urls = [
	'https://source.unsplash.com/random/1000x1000?sky',
	'https://source.unsplash.com/random/1000x1000?ocen',
	'https://source.unsplash.com/random/1000x1000?trees',
	'https://source.unsplash.com/random/1000x1000?mountain',
	'https://source.unsplash.com/random/1000x1000?landscape',
	'https://source.unsplash.com/random/1000x1000?forest',
	'https://source.unsplash.com/random/1000x1000?home',
	'https://source.unsplash.com/random/1000x1000?rain',
	'https://source.unsplash.com/random/1000x1000?city'
];

let cardCount = 0;

function appendNewCard() {
	const card = new Card({
		imageUrl: urls[cardCount % 5],
		onDismiss: appendNewCard,
		onLike: () => {
			like.style.animationPlayState = 'running';
			like.classList.toggle('trigger');
		},
		onDislike: () => {
			dislike.style.animationPlayState = 'running';
			dislike.classList.toggle('trigger');
		}
	});

	// card.element.style.setProperty('--i', cardCount % 5);

	swiper.append(card.element);
	cardCount++;

	const cards = swiper.querySelectorAll('.card:not(.dismissing)');
	cards.forEach((card, index) => {
		card.style.setProperty('--i', index);
	});
};

for (let i = 0; i < 5; i++) {
	appendNewCard();
}