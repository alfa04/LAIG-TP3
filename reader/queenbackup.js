/**
 * Queen
 * @constructor
 */

var degToRad = Math.PI / 180.0;

function Queen(scene, args) {
    CGFobject.call(this, scene);

    this.args = args;

    //transformações consoante posição
    this.x = this.args[0];
    this.y = this.args[1];
    this.matrix = mat4.create();
    this.rainhatopo = new patch(this.scene, [3,10,10,[[0,0,3,1],[-2,0,3,1],[-1.5,0,2,1],[-0.5,0,0,1],[0,0,3,1],[-1,2,3,1],[-1,1.5,2,1],[-0.5,0.5,0,1],[0,0,3,1],[1,2,3,1],[1,1.5,2,1],[0.5,0.5,0,1],[0,0,3,1],[2,0,3,1],[1.5,0,2,1],[0.5,0,0,1]]]);
    this.rainhacorpoleaf = new patch(this.scene, [3,10,10,[[0,0,3,1],[-3.5,0,3,1],[0,0,2,1],[-0.5,0,0,1],[0,0,3,1],[-1,3.5,3,1],[-1,0,2,1],[-0.5,0.5,0,1],[0,0,3,1],[1,3.5,3,1],[1,0,2,1],[0.5,0.5,0,1],[0,0,3,1],[3.5,0,3,1],[0,0,2,1],[0.5,0,0,1]]]);
    this.rainhacorpobaseleaf = new patch(this.scene, [3,10,10,[[0,0,3,1],[-4.5,0,3,1],[0,0,2,1],[-0.5,0,0,1],[0,0,3,1],[-1,4.5,3,1],[0,0,2,1],[-0.5,0.5,0,1],[0,0,3,1],[1,4.5,3,1],[0,0,2,1],[0.5,0.5,0,1],[0,0,3,1],[4.5,0,3,1],[0,0,2,1],[0.5,0,0,1]]]);
    this.rainhatopoleaf = new patch(this.scene, [3,10,10,[[0,0,3,1],[-2,0,3,1],[-1.5,0,2,1],[-0.5,0,0,1],[0,0,3,1],[-1,2,3,1],[-1,1.5,2,1],[-0.5,0.5,0,1],[0,0,3,1],[1,2,3,1],[1,1.5,2,1],[0.5,0.5,0,1],[0,0,3,1],[2,0,3,1],[1.5,0,2,1],[0.5,0,0,1]]]);
    this.base = new MyCoveredCylinder(this.scene,[0.4,1.2,1.2,20,8]);
    this.head = new Sphere(this.scene,['1','20','20']);

    this.initBuffers();
};

Queen.prototype = Object.create(CGFobject.prototype);
Queen.prototype.constructor = Queen;

Queen.prototype.display = function () {
    this.scene.pushMatrix();

    mat4.translate(this.matrix, this.matrix, [this.x, 0, this.y]);
    
    mat4.rotate(this.matrix, this.matrix, -90 * degToRad, [1,0,0]);

    mat4.translate(this.matrix, this.matrix, [0,-1,0]);

    mat4.scale(this.matrix, this.matrix, [0.2,0.2,0.2]);
    mat4.translate(this.matrix, this.matrix, [2,2,3]);

    this.scene.multMatrix(this.matrix);

    this.scene.pushMatrix();
    mat4.translate(this.matrix, this.matrix, [0, 0, -3.3]);
    this.scene.multMatrix(this.matrix);
    this.base.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    mat4.translate(this.matrix, this.matrix, [0, 0, 2.5]);
    this.scene.multMatrix(this.matrix);
    this.rainhatopoleaf.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    mat4.translate(this.matrix, this.matrix, [0, 0, 2.5]);
    mat4.rotate(this.matrix, this.matrix, -180 * degToRad, [0,0,1]);
    this.scene.multMatrix(this.matrix);
    this.rainhatopoleaf.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    //this.scene.translate(0, 0, 2.5);
    this.scene.multMatrix(this.matrix);
    this.rainhacorpoleaf.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    mat4.rotate(this.matrix, this.matrix, -180 * degToRad, [0,0,1]);
    this.scene.multMatrix(this.matrix);
    this.rainhacorpoleaf.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    mat4.rotate(this.matrix, this.matrix, -180 * degToRad, [1,0,0]);
    this.scene.multMatrix(this.matrix);
    this.rainhacorpobaseleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    mat4.rotate(this.matrix, this.matrix, -180 * degToRad, [1,0,0]);
    mat4.rotate(this.matrix, this.matrix, -180 * degToRad, [0,0,1]);
    this.scene.multMatrix(this.matrix);
    this.rainhacorpobaseleaf.display();
    this.scene.popMatrix();


    this.scene.pushMatrix();
    mat4.translate(this.matrix, this.matrix, [0, 0, 5.9]);
    mat4.scale(this.matrix, this.matrix, [0.5,0.5,0.5]);
    this.scene.multMatrix(this.matrix);
    this.head.display();
    this.scene.popMatrix();
   
    this.scene.popMatrix();

    //CGFobject.prototype.display.call(this);
};

Queen.prototype.updateTex = function(S, T) {
};