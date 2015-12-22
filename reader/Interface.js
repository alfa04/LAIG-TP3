function Interface() {
    CGFinterface.call(this);
};

Interface.prototype = Object.create(CGFinterface.prototype);
Interface.prototype.constructor = Interface;

Interface.prototype.init = function(application) {
    CGFinterface.prototype.init.call(this, application);
    application.interface = this;
    this.gui = new dat.GUI();  

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

}

Interface.prototype.enableLights = function() {
    var group = this.gui.addFolder("ON/OFF");
    group.open();

    var myInterface = this;

    for (status in this.scene.lightsNo) {
        group.add(this.scene.lightsNo, status).onChange(function(value) {
            myInterface.scene.enableL(this.property, value);
        });
    }

    group.close();
};