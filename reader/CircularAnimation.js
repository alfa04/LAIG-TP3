function CircularAnimation(id, span, center, radius, startang, rotang) {
    Animation.call(this, id, span);

    this.center = center;
    this.radius = radius;
    this.span = span;
    this.startang = startang;
    this.rotang = rotang;

    this.type = "circular";

    this.finished = false;

    this.currentPos = 0;

    this.matrix = mat4.create();

    this.CircMatrix = mat4.create();
    var sign;

    if(this.rotang > 0)
        sign = Math.PI/2;
    else
        sign = -Math.PI/2;

    mat4.identity(this.CircMatrix);
    mat4.rotateY(this.CircMatrix, this.CircMatrix, this.startang);
    mat4.translate(this.CircMatrix, this.CircMatrix, vec3.fromValues(0, 0, this.radius));
    mat4.rotateY(this.CircMatrix, this.CircMatrix, sign);

}

CircularAnimation.prototype = Object.create(Animation.prototype);
CircularAnimation.prototype.constructor = CircularAnimation;

CircularAnimation.prototype.update = function (step) {

    step = step/1000;

    //console.log(this.currentPos);

    this.currentPos = Math.min(this.span, this.currentPos + step);

	mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, this.center);

    var ang = this.rotang * (this.currentPos / this.span);
    mat4.rotateY(this.matrix, this.matrix, ang);

   // console.log(this.currentPos);
   // console.log(ang);

    mat4.multiply(this.matrix, this.matrix, this.CircMatrix);

}

CircularAnimation.prototype.clone = function() {
    return new CircularAnimation(this.id,
        this.span,
        this.center,
        this.radius,
        this.startang,
        this.rotang);
};