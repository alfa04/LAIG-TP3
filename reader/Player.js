function Player(scene, id, name) {

    this.scene = scene;
    this.id = id;
    this.pieces = [];

};

Player.prototype = Object.create(CGFobject.prototype);
Player.prototype.constructor = Player;

Player.prototype.addPiece = function(piece) {
    this.pieces.push(piece);
};

Player.prototype.getPieces = function() {
    return this.pieces;
};

//faltam cenas
