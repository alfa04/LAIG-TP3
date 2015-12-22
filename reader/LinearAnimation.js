function LinearAnimation(id, span, controlPoint) {
    Animation.call(this, id, span);

    this.span = span;
    this.controlPoint = controlPoint;
    this.totalDist = 0;
    this.finished = false;

    this.cpX = 0;
    this.cpY = 0;
    this.cpZ = 0;
    this.movingX = 0;
    this.movingY = 0;
    this.movingZ = 0;
    this.idx = 0;
    this.paragem = 0;
    this.signal = 0;

    this.matrix = mat4.create();

    for(var i = 0; i < this.controlPoint.length-1; i++){
        var dx = this.controlPoint[i+1][0] - this.controlPoint[i][0];
        var dy = this.controlPoint[i+1][1] - this.controlPoint[i][1];
        var dz = this.controlPoint[i+1][2] - this.controlPoint[i][2];

        this.dist2points = Math.sqrt(dx*dx + dy*dy + dz*dz);

        this.totalDist += this.dist2points;

    }
}

LinearAnimation.prototype = Object.create(Animation.prototype);
LinearAnimation.prototype.constructor = LinearAnimation;

LinearAnimation.prototype.update = function (step) {

    this.speed = step/1000 * this.totalDist/this.span;

    //console.log(this.speed);

    var v = this.calcVec();

    var vecR = vec3.fromValues(v[0], 0, v[2]);

    var rotAng;

    vec3.normalize(vecR, vecR);
    rotAng = Math.acos(vec3.dot(vecR, vec3.fromValues(0, 0, 1)));

    rotAng *= this.signal;

    //console.log(rotAng);

    mat4.identity(this.matrix);
    mat4.translate(this.matrix, this.matrix, v);
    mat4.rotateY(this.matrix, this.matrix, rotAng);

    

};

LinearAnimation.prototype.calcVec = function () {

    var vec = [];

    if(this.movingX == 0){
        if(this.cpX - this.animat1x < 0){
            this.cpX += this.speed;
            this.signal = 1;
        }
        else{
            this.cpX -= this.speed;
            this.signal = -1;
        }
    }

    if(this.movingY == 0){
        if(this.cpY - this.animat1y < 0){
            this.cpY += this.speed;
            this.signal = 1;
        }
        else{
            this.cpY -= this.speed;
            this.signal = -1;
        }
    }
    
    if(this.movingZ == 0){
        if(this.cpZ - this.animat1z < 0){
            this.cpZ += this.speed;
            this.signal = 1;
        }
        else{
            this.cpZ -= this.speed;
            this.signal = -1;
        }
    }

    if(this.idx < this.controlPoint.length){
                 
        this.animat1x  = this.controlPoint[this.idx][0];
        this.animat1y  = this.controlPoint[this.idx][1];
        this.animat1z  = this.controlPoint[this.idx][2];
    }

    if(this.idx < this.controlPoint.length - 1 && (this.cpX.toFixed(2) == this.animat1x || (Math.abs(this.cpX.toFixed(2) - this.animat1x)) <0.08) && (this.cpY.toFixed(2) == this.animat1y || (Math.abs(this.cpY.toFixed(2) - this.animat1y)) <0.08) && (this.cpZ.toFixed(2) == this.animat1z || (Math.abs(this.cpZ.toFixed(2) - this.animat1z)) <0.08)){
        this.idx+= 1;
        this.movingX = 0;
        this.movingY = 0;
        this.movingZ = 0;
        this.animat1x  = this.controlPoint[this.idx][0];
        this.animat1y  = this.controlPoint[this.idx][1];
        this.animat1z  = this.controlPoint[this.idx][2];
    }

    if(this.cpX.toFixed(2) == this.animat1x || (Math.abs(this.cpX.toFixed(2) - this.animat1x)) <0.08)
        this.movingX = 1;
    if(this.cpY.toFixed(2) == this.animat1y || (Math.abs(this.cpY.toFixed(2) - this.animat1y)) <0.08)
          this.movingY = 1;
    if(this.cpZ.toFixed(2) == this.animat1z || (Math.abs(this.cpZ.toFixed(2) - this.animat1z)) <0.08)
        this.movingZ = 1;

    vec[0] = this.cpX;
    vec[1] = this.cpY;
    vec[2] = this.cpZ;

    return vec;

}

LinearAnimation.prototype.clone = function() {
    return new LinearAnimation(this.id,
        this.span,
        this.controlPoint);
};