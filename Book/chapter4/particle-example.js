var particle = new Particle();
particle.x = 2;
particle.y = 3;

// tests
console.log(particle.mass, particle.charge);
particle.mass = 2;
particle.charge = -1;
console.log(particle.mass, particle.charge);

//console.log(particle.getPos2D().x, particle.getPos2D().y);
console.log(particle.pos2D.x, particle.pos2D.y);
console.log(particle.velo2D.x, particle.velo2D.y);
particle.velo2D = new Vector2D(2.5,4.7);
console.log(particle.velo2D.x, particle.velo2D.y);

var dt = 0.1;
particle.pos2D = particle.pos2D.addScaled(particle.velo2D,dt);
console.log(particle.pos2D.x, particle.pos2D.y);
