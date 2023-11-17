title = "One Button Circle";

description = `
	   Hit the rings when
	they are the right size.
	      Don't miss!
`;

characters = [];

const G = {
	WIDTH: 150,
	HEIGHT: 150,

	TARGET_RADIUS: 5,
	TARGET_RADIUS_BUFFER: 3,
	TARGET_COLOR: "light_black",

	MAX_MISSES: 5,
}

options = {
	viewSize: {
		x: G.WIDTH,
		y: G.HEIGHT,
	},
	seed: 8,
	isPlayingBgm: true,
	isReplayEnabled: true,
	theme: 'dark',
};

function randColor() {
	const CHOICES = [
		"red",
		"green",
		"blue",
		"purple",
		"cyan",
		"light_red",
		"light_green",
		"light_blue",
		"light_purple",
		"light_cyan",
	];

	return CHOICES[rndi(0, CHOICES.length)];
}

function spawnRing() {
	const radius = rnd(20, 50)
	const posX = rnd(radius, G.WIDTH - radius);
	const posY = rnd(radius, G.HEIGHT - radius);

	return {
		pos: vec(posX, posY),
		rad: radius,
		speed: rndi(1, 10) / 60, // since game runs at 60fps,
		color: randColor(),
	};
}

/**
* @typedef {{
* pos: Vector,
* rad: number,
* speed: number,
* color: Color,
* }} Ring
*/
	
/**
* @type  { Ring [] }
*/
let rings;

let misses;

let didClickAndMissed;

function update() {
	if (!ticks) {
		misses = 0;

		rings = times(10, spawnRing);
	}

	didClickAndMissed = false;

	if (input.isJustPressed) {
		didClickAndMissed = true;
	}

	if (misses >= G.MAX_MISSES) {
		play("hit");
		end();
	}

	while (rings.length < 10) {
		rings.push(spawnRing());
	}

	remove(rings, r => {
		r.rad -= r.speed;

		if (r.rad < 0) {
			play("explosion");
			misses++;
		}

		const didHitTarget = (input.isJustPressed 
			&& r.rad <= (G.TARGET_RADIUS + G.TARGET_RADIUS_BUFFER)
			&& r.rad >= (G.TARGET_RADIUS - G.TARGET_RADIUS_BUFFER)
		)

		if (didHitTarget) {
			didClickAndMissed = false;
			play("select");
			color("yellow");
			particle(
				r.pos,
				15, // The number of particles
				1, // The speed of the particles
				-PI/2, // The emitting angle
				r.rad  // The emitting width
			);
			addScore(rndi(2, 5) * 10, r.pos);
		} else {
			color(r.color);
			arc(r.pos, r.rad, 3);
	
			color("light_black");
			arc(r.pos, G.TARGET_RADIUS, 2);
		}


		return r.rad < 0 || didHitTarget
	});

	if (didClickAndMissed) {
		play("jump");
		misses++;
		color("light_yellow");
		particle(
			input.pos,
			10, // The number of particles
			.5, // The speed of the particles
			-PI/2, // The emitting angle
			10  // The emitting width
		);
	}

	text(`MISS ${misses}/${G.MAX_MISSES}`, G.WIDTH/3, 3, {
		color: "black",
	});

}
