console.log(Universe);


// function SuperHuman (name, superPower) {
//     this.name = name;
//     this.superPower = superPower;
// }

// SuperHuman.prototype.usePower = function () {
//     console.log(this.superPower + "!");
// };

// SuperHuman.create = function(name, superPower){
//    return new SuperHuman (name, superPower);
// };

// var banshee = SuperHuman.create("Silver Banshee", "sonic wail");
// banshee.usePower();




// function SuperHero (name, superPower, allegiance) {
//     // Reuse SuperHuman initialization
//     SuperHuman.call(this, name, superPower);
//     this.allegiance = allegiance;
// }
// // Inherit all 
// SuperHero.prototype = new SuperHuman();
// // Add new methods to prototype
// SuperHero.prototype.saveTheDay = function () {
//     console.log(this.name + " saved the day!");
// };
// // Create my constructor
// SuperHero.create = function(name, superPower, allegiance){
//    return new SuperHero (name, superPower, allegiance);
// };


// var marvel = new SuperHero("Captain Marvel", "magic", "Good");
// // Outputs: "Captain Marvel saved the day!"
// marvel.saveTheDay();
// marvel.usePower();