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

    this.scene.translate(this.x, 0, this.y);
    this.scene.rotate(-90 * degToRad, 1, 0, 0);
    this.scene.translate(0, -1, 0);

    this.scene.scale(0.2,0.2,0.2);
    this.scene.translate(2,2,3);

    this.scene.pushMatrix();
    this.scene.translate(0, 0, -3.3);
    this.base.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 2.5);
    this.rainhatopoleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.translate(0, 0, 2.5);
    this.scene.rotate(-180 * degToRad, 0, 0, 1);
    this.rainhatopoleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    //this.scene.translate(0, 0, 2.5);
    this.rainhacorpoleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-180 * degToRad, 0, 0, 1);
    this.rainhacorpoleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-180 * degToRad, 1, 0, 0);
    this.rainhacorpobaseleaf.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
    this.scene.rotate(-180 * degToRad, 1, 0, 0);
    this.scene.rotate(-180 * degToRad, 0, 0, 1);
    this.rainhacorpobaseleaf.display();
    this.scene.popMatrix();
    
    this.scene.pushMatrix();
    this.scene.translate(0, 0, 5.9);
    this.scene.scale(0.5,0.5,0.5);
    
    this.head.display();

    this.scene.popMatrix();

    this.scene.popMatrix();

    //CGFobject.prototype.display.call(this);
};

Queen.prototype.updateTex = function(S, T) {
};