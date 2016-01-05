
function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    application.interface = this;
    this.menu = new dat.GUI();
    this.cameras = this.menu.addFolder("Cameras");

    this.cameras.add(this.scene, 'cameraTop').name("cam Top");
    this.cameras.add(this.scene, 'cameraGreen').name("cam Green");
    this.cameras.add(this.scene, 'cameraBlue').name("cam Blue");

    this.ambients = this.menu.addFolder("Ambients");
    this.ambients.add(this.scene, 'setBlack').name("Black");
    this.ambients.add(this.scene, 'setWhite').name("White");
    this.ambients.add(this.scene, 'setGrass').name("Grass");
    this.ambients.add(this.scene, 'setOcean').name("Ocean");




    return true;
};

Interface.prototype.setScene = function(scene) {
    this.scene = scene;
    scene.interface = this;
};


Interface.prototype.enableAnims = function() {

    var groupAnims = this.gui.addFolder("Animations");
    groupAnims.open();

    var myInterface = this;

    for (name in this.scene.animsNo){
        groupAnims.add(this.scene.animsNo, name).onChange(function(value) {
            myInterface.scene.enableAnims(this.property, value);
        });
    }

    groupAnims.close();

};

Interface.prototype.initLights = function() {
    var lights_group = this.menu.addFolder("Lights");
    lights_group.open();

    var self = this;
    
    for (bool in this.scene.lightsID) {
        var handler = lights_group.add(this.scene.lightsID, bool);

        handler.onChange(function(value) {
            self.scene.switchLight(this.property, value);
        });
    }
};