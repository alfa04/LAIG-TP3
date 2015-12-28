
function XMLscene() {
    CGFscene.call(this);
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

	this.enableTextures(true);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.leaveslist = [];
    this.texturesList = [];
    this.materialsList = [];
    this.animationsList = [];
    this.nodesList = [];

	this.axis=new CGFaxis(this);


    this.timeNow = new Date().getTime();

	
	//this.setUpdatePeriod(10);
	this.setPickEnabled(true);
	//this.interface.menu();

};

XMLscene.prototype.initLights = function () {

    this.lightsNo = [];

    for(var i = 0; i<this.graph.lightsList.length; i++){

		if(this.graph.lightsList[i].enabled)
			this.lights[i].enable();
		else this.lights[i].disable();

		this.lights[i].id = this.graph.lightsList[i].id;
    	this.lights[i].setPosition(this.graph.lightsList[i].position.x, this.graph.lightsList[i].position.y, this.graph.lightsList[i].position.z, this.graph.lightsList[i].position.w);
	    this.lights[i].setDiffuse(this.graph.lightsList[i].diffuse.r, this.graph.lightsList[i].diffuse.g, this.graph.lightsList[i].diffuse.b, this.graph.lightsList[i].diffuse.a);
	    this.lights[i].setAmbient(this.graph.lightsList[i].ambient.r, this.graph.lightsList[i].ambient.g, this.graph.lightsList[i].ambient.b, this.graph.lightsList[i].ambient.a);
	    this.lights[i].setSpecular(this.graph.lightsList[i].specular.r, this.graph.lightsList[i].specular.g, this.graph.lightsList[i].specular.b, this.graph.lightsList[i].specular.a);

		this.lights[i].setVisible(true);

	    this.lights[i].update();
	    if(this.graph.lightsList[i].enabled)
	    	this.lightsNo[this.graph.lightsList[i].id] = true;
		else this.lightsNo[this.graph.lightsList[i].id] = false;

	}

   // this.interface.enableLights();
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
};

XMLscene.prototype.setDefaultAppearance = function () {
    for (var i = 0; i < this.materialsList.length; i++) {
        if (this.materialsList[i].id == "default") {
            this.materialsList[i].apply();
            break;
        }
    }
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{	//INITIALS

	//frustum
	this.camera.near = this.graph.initialsInfo.frustum['near'];
    this.camera.far =  this.graph.initialsInfo.frustum['far'];
    
    //axis reference
 
	this.axis = new CGFaxis(this,this.graph.initialsInfo.reference['length']);
	this.axis = new CGFaxis(this,0);

	//ILLUMINATION

	//background
	this.gl.clearColor(this.graph.backgroundInfo['r'],this.graph.backgroundInfo['g'],this.graph.backgroundInfo['b'],this.graph.backgroundInfo['a']);
	
	//ambient
	this.setGlobalAmbientLight(this.graph.ambientInfo['r'],this.graph.ambientInfo['g'],this.graph.ambientInfo['b'],this.graph.ambientInfo['a']); 
	
	//LIGHTS
	//TODO: Descomentar e arranjar luzes
  		//  this.initLights();

    //TEXTURES

	this.enableTextures(true);
	for(var i = 0; i<this.graph.texturesList.length; i++){
		var texture = [];
		this.texture = new CGFtexture(this, this.graph.texturesList[i].filePath);
		this.texture["id"] = this.graph.texturesList[i].id;
		this.texture["filePath"] = this.graph.texturesList[i].filePath;
		this.texture["amplifFactor_S"] = this.graph.texturesList[i].amplifFactor_S;
		this.texture["amplifFactor_T"] = this.graph.texturesList[i].amplifFactor_T;
		this.texturesList.push(this.texture);
		
	}    


    //MATERIALS

    for(var i = 0; i<this.graph.materialsList.length; i++){
		var material = [];
		this.material = new CGFappearance(this, this.graph.materialsList[i].id);
		this.material["id"] = this.graph.materialsList[i].id;
		this.material.setShininess(this.graph.materialsList[i].shininess);
		this.material.setSpecular(this.graph.materialsList[i].specular.r, this.graph.materialsList[i].specular.g, this.graph.materialsList[i].specular.b, this.graph.materialsList[i].specular.a);
		this.material.setDiffuse(this.graph.materialsList[i].diffuse.r, this.graph.materialsList[i].diffuse.g, this.graph.materialsList[i].diffuse.b, this.graph.materialsList[i].diffuse.a);
		this.material.setAmbient(this.graph.materialsList[i].ambient.r, this.graph.materialsList[i].ambient.g, this.graph.materialsList[i].ambient.b, this.graph.materialsList[i].ambient.a);
		this.material.setEmission(this.graph.materialsList[i].emission.r, this.graph.materialsList[i].emission.g, this.graph.materialsList[i].emission.b, this.graph.materialsList[i].emission.a);
		this.materialsList.push(this.material);	
	}  

	
    //LEAVES
    this.setLeaves();


    //NODES
    this.setNodes();

    //ANIMATIONS
    for(var i = 0; i < this.nodesList.length; i++){
        var node = this.nodesList[i];
        //console.log(node.id);
		for(var j = 0; j<this.graph.animationsList.length; j++){
			//console.log(this.graph.animationsList[j].id+ "node" + node["animationref"]);

			if(node["animationref"] == this.graph.animationsList[j].id){
				

				this.animation = [];
				if(this.graph.animationsList[j].type == "linear"){
					this.animation = new LinearAnimation(this.graph.animationsList[j].id, this.graph.animationsList[j].span, this.graph.animationsList[j].controlPoint);
					this.animation["type"] = 'linear';
				}

				else if(this.graph.animationsList[j].type == "circular"){
					this.animation = new CircularAnimation(this.graph.animationsList[j].id, this.graph.animationsList[j].span, this.graph.animationsList[j].center, this.graph.animationsList[j].radius,this.graph.animationsList[j].startang, this.graph.animationsList[j].rotang);
					this.animation["type"] = 'circular';
				}
				
				this.animationsList.push(this.animation);	
			}
		} 
	}

    this.setAnimation();

    this.fixAnims();
};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
 	this.logPicking();
	this.clearPickRegistration();
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();


	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{

		// Draw axis
		this.axis.display();
	

		this.setDefaultAppearance();

        // setInitials transformations
        this.setInitials();

		//Lights
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();

        //Nodes

        for(var i = 0; i < this.nodesList.length; i++){
        
        	var node = this.nodesList[i];
        	//console.log(node);
            this.pushMatrix();
            node["material"].setTexture(node["texture"]);
            if (node["texture"] != null) {
            	//console.log(node["primitive"]);
                node["primitive"].updateTex(node["texture"].amplifFactor_S, node["texture"].amplifFactor_T);
            }
            if(node["animationref"] != null && node["animationref"].finished == false){
            	this.multMatrix(node["animationref"].matrix);
			}
            node["material"].apply();
            this.multMatrix(node["matrix"]);
            this.registerForPick(node["id"], node["primitive"]);
            //console.log(node["id"]);
            node["primitive"].display();
            this.popMatrix();
        }
	}

};

XMLscene.prototype.setInitials = function() {
	var deg2rad = Math.PI / 180;

	//tranlate
    this.translate(this.graph.initialsInfo.translation['x'], this.graph.initialsInfo.translation['y'],this.graph.initialsInfo.translation['z']);
    
    //rotations
    //x
    this.rotate(this.graph.initialsInfo.rotation['x'] * deg2rad, 1, 0, 0);
    //y          
    this.rotate(this.graph.initialsInfo.rotation['y'] * deg2rad, 0, 1, 0);
    //z        
    this.rotate(this.graph.initialsInfo.rotation['z'] * deg2rad, 0, 0, 1);
                
    //scale
    this.scale(this.graph.initialsInfo.scale['sx'], this.graph.initialsInfo.scale['sy'], this.graph.initialsInfo.scale['sz']);
};

XMLscene.prototype.setLeaves = function() {
	for (var i = 0; i < this.graph.leaveslist.length; i++) {
		var leaf = this.graph.leaveslist[i];

		switch (leaf.type) {
            case "rectangle":
                var rectangle = new Plane(this,leaf.args[0]);
                rectangle.id = leaf.id;
                this.leaveslist.push(rectangle);
                break;
            case "cylinder":
                cylinder = new MyCoveredCylinder(this,leaf.args);
                cylinder.id = leaf.id;
                this.leaveslist.push(cylinder);
                break;
            case "sphere":
                sphere = new sphere(this, leaf.args[0]);
                sphere.id = leaf.id;
                this.leaveslist.push(sphere);
                break;
            case "triangle":
                triangle = new MyTriangle(this,leaf.args);
                triangle.id = leaf.id;
                this.leaveslist.push(triangle);
                break;
            case "plane":
                planenurbs1 = new planenurbs(this,leaf.args);
                planenurbs1.id = leaf.id;
                this.leaveslist.push(planenurbs);
                break;
			case "patch":
			 	console.log("PATCHHHH----");
			    console.log(leaf.args);
			    console.log("/PATCHHHH----");
                patch1 = new patch(this,leaf.args);
                patch1.id = leaf.id;
                this.leaveslist.push(patch1);
                break;

            case "terrain":
                terrain = new terrain(this,leaf.args);
                terrain.id = leaf.id;
                this.leaveslist.push(terrain);
                break;
        }
	}
};

XMLscene.prototype.findNode = function(id) {
	for(var i = 0; i<this.graph.nodesList.length; i++){
		if(this.graph.nodesList[i].id == id){
			return this.graph.nodesList[i];
		}

	}

};
XMLscene.prototype.indexNode = function(id) {
	for(var i = 0; i<this.nodesList.length; i++){
		if(this.nodesList[i].id == id){
			return i;
		}

	}

};

XMLscene.prototype.setNodes = function() {

	var root = this.findNode(this.graph.rootInfo["id"]);
    this.calcNodes(root, root.texture, root.material, root.matrix, root.animationref);

};

XMLscene.prototype.calcNodes = function(node, nodeTexture, nodeMaterial, nodeMatrix, anim) {

	var nextNodeTexture = node.texture;
	if(node.texture == "null")
		nextNodeTexture = nodeTexture;
		
	var nextNodeMaterial = node.material;
	if(node.material == "null")
		nextNodeMaterial = nodeMaterial;
		
	var nextNodeMatrix = mat4.create();
	mat4.multiply(nextNodeMatrix, nodeMatrix, node.matrix);

	//animation
	if(node.animationref != null)
	{
		anim = node.animationref;
	}

	for(var i = 0; i < node.descendants.length; i++){
		
		var nextNode = this.findNode(node.descendants[i]);

		if(nextNode == null){

			this.n = [];
			this.n["id"] = node.descendants[i];

			//textures
			if(nextNodeTexture == null)
				this.n["texture"] = null;
			else{
				for(var j = 0; j<this.texturesList.length; j++){

					if(nextNodeTexture == this.texturesList[j]["id"]){
						this.n["texture"] = this.texturesList[j];
					}
				}
			}

			//materials
			if(nextNodeMaterial == null)
				this.n["material"] = null;

			else{
				for(var k = 0; k<this.materialsList.length; k++){

					if(nextNodeMaterial == this.materialsList[k]["id"])
						this.n["material"] = this.materialsList[k];
				}
			}

			
			//animations
			this.n["animationref"] = anim;
			
		
			//matrix
			this.n["matrix"] = nextNodeMatrix;

			for(var l = 0; l < this.leaveslist.length; l++){

				if(this.leaveslist[l].id == this.n["id"]){
					//primitive
					this.n["primitive"] = this.leaveslist[l];
					break;
				}
			}
			
			//console.log(this.n);
			this.nodesList.push(this.n);
			continue;

		}

		this.calcNodes(nextNode, nextNodeTexture, nextNodeMaterial, nextNodeMatrix, anim);

	}

};

XMLscene.prototype.setAnimation = function(){

	this.animsNo = [];

	for(var i = 0; i < this.nodesList.length; i++){
		var node = this.nodesList[i];
		for (var j = 0; j < this.animationsList.length; j++) {

				//console.log(this.animationsList.length);
			if(node["animationref"] == this.animationsList[j].id){
				node["animationref"] = this.animationsList[j];
				this.animsNo[this.animationsList[j].id] = false;
			}
		}
	}

	//this.interface.enableAnims();
};

XMLscene.prototype.fixAnims = function() {
    for(var i = 0; i < this.nodesList.length; i++){
		var node = this.nodesList[i];
		var done = 0;
		for (var j = 0; j < this.animationsList.length; j++) {
			if(node["animationref"] != null && node["animationref"].id == this.animationsList[j].id && done == 0){
					done = 1;
					node["animationref"].finished = true;
	            	node["animationref"] = this.animationsList[j].clone();
			}
		}
	}

};

XMLscene.prototype.enableAnims = function(id, enabled) {
    for(var i = 0; i < this.nodesList.length; i++){
		var node = this.nodesList[i];
		var done = 0;
		for (var j = 0; j < this.animationsList.length; j++) {
			if(node["animationref"] != null && this.animationsList[j].id == id && node["animationref"].id == this.animationsList[j].id && done == 0){
				if(enabled){
					done = 1;
					node["animationref"].finished = true;
	            	node["animationref"] = this.animationsList[j].clone();
				}
			}
		}
	}

};

XMLscene.prototype.enableL = function(id, enabled) {
    for (var i = 0; i < this.lights.length; i++) {
        if (id == this.lights[i].id) {
            if(enabled)
            	this.lights[i].enable();
            else this.lights[i].disable();
        }
    }
};

XMLscene.prototype.update = function(timeNow) {
    var step = timeNow - this.timeNow;
    this.timeNow = timeNow;

    for(var i = 0; i < this.nodesList.length; i++){
		if(this.nodesList[i]["animationref"] != null && this.nodesList[i]["animationref"].finished == false){
            this.nodesList[i]["animationref"].update(step);
           // console.log(step);
		}
	}
};

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0];
				if (obj)
				{
					console.log(obj);
					makeRequest();
					var customId = this.pickResults[i][1];				
					console.log("Picked object: " + obj + ", with pick id " + customId + ", with coordX = " + Math.floor(customId/10) + ", with coordY = " + customId % 10);
					//this.nodesList[this.indexNode("13n")]["texture"] = null;
				//	console.log(this.indexNode(customId));
				//	console.log(this.nodesList);
				//	this.nodesList[this.indexNode(customId)]["texture"] =null;
				//	this.nodesList[0]["texture"] =null;
				console.log(this.indexNode(customId));
				this.nodesList[this.indexNode(customId)]["texture"] =null;
				
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
}

function getPrologRequest(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}

function makeRequest()
{
	// Get Parameter Values
	var requestString = "pvpgame(1,[['$','$','$','$','+','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','*','&','&','&']],10,4,3,4,4)";				
	
	// Make Request
	getPrologRequest(requestString, handleReply);

}

//Handle the Reply
function handleReply(data){
	console.log(data.target.response);
	document.querySelector("#query_result").innerHTML=data.target.response;
}
