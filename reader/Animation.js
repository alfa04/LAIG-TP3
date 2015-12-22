function Animation(id, span) {
    this.id = id;
    this.span = span;
   // this.matrix = mat4.create();
    this.currentPos = 0;

}

Animation.prototype.constructor = Animation;
Animation.prototype.init = function () {

};

Animation.prototype.update = function () {

};

Animation.prototype.reset = function() {
    this.currentPos = 0;
};