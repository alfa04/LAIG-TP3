function terrain(scene, args) {
    CGFobject.call(this,scene);
    
    this.args = args;
  	this.materialTerrain = new CGFappearance(scene);
    this.texTerrain = new CGFtexture(scene, this.args[0]);
    this.heightmapTerrain = new CGFtexture(scene, this.args[1]);
    this.materialTerrain.setTexture(this.texTerrain);
    this.myShader = new CGFshader(scene.gl, "scenes/shaders/texture3.vert", "scenes/shaders/texture3.frag");
    this.myShader.setUniformsValues({uSampler2: 1});
    this.myShader.setUniformsValues({scale: 0.5});
    
    this.plane = new planenurbs(scene, 15);
 }
 
terrain.prototype = Object.create(CGFobject.prototype);
terrain.prototype.constructor = terrain;
 
terrain.prototype.display = function() {

    this.scene.setActiveShader(this.myShader);
    
    this.scene.pushMatrix();
    
    this.heightmapTerrain.bind(1);
    this.plane.display();
    this.scene.setActiveShader(this.scene.defaultShader);

    this.scene.popMatrix();
};

terrain.prototype.updateTex = function(S,T) {

};
