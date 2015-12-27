function Piece(scene, id) {
	CGFobject.call(this, scene);

    this.id = id;
    // id = 0  para rainhas id=1 para reis por exemplo nao sei

    this.animation = null;
    this.selected = false;

};

Piece.prototype = Object.create(CGFobject.prototype);
Piece.prototype.constructor = Piece;

Piece.prototype.selectPiece = function() {

	this.selected = true;

}

Piece.prototype.unSelectPiece = function() {

	this.selected = false;

}

Piece.prototype.display = function() {

	// draw a queen if id = 0

	// draw a king if id = 1 

	// or use another atributte


}

Piece.prototype.update = function(curTime){
  if(this.animation!=undefined) //use for animations
    this.animation.update();
};

//faltam cenas
