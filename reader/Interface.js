
function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);

    application.interface = this;
    this.menu = new dat.GUI();

    //this.startMenu = this.menu.addFolder("New Game");
    //this.startMenu.add(this, 'newGame').name("New 12");
    
    this.cameras = this.menu.addFolder("Cameras");
    //cameras.open();

    this.cameras.add(this.scene, 'cameraTop').name("cam Top");
    this.cameras.add(this.scene, 'cameraGreen').name("cam Green");
    this.cameras.add(this.scene, 'cameraBlue').name("cam Blue");


    return true;
};

Interface.prototype.setScene = function(scene) {
    this.scene = scene;
    scene.interface = this;
};


Interface.prototype.newGame = function() {

    this.scene.status = "newGame";

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

    /*
     Create a button for every light with the light's id as the name
     Every button has an event handler for when it's clicked so it updates the
     respective light in the scene
     */
    for (bool in this.scene.lightsID) {
        var handler = lights_group.add(this.scene.lightsID, bool);

        handler.onChange(function(value) {
            self.scene.switchLight(this.property, value);
        });
    }
};

/*Interface.prototype.enableLights = function() {
    var group = this.gui.addFolder("ON/OFF");
    group.open();

    var myInterface = this;

    for (status in this.scene.lightsNo) {
        group.add(this.scene.lightsNo, status).onChange(function(value) {
            myInterface.scene.enableL(this.property, value);
        });
    }

    group.close();
};*/


