
function XMLscene() {
    CGFscene.call(this);
    this.selectedExampleShader=0;
    this.appearance = null;
};

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;
var tempplayer = 1;
var tempturns = 10;
var map;
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
    this.queensList = [];
    this.kingsList = [];
	this.piece1 = 0;
	this.texture1;
	this.texture2;
	this.id1;
	this.id2;
	this.xi;
	this.xf;
	this.yi;
	this.yf;
    map = "[['$','$','$','$','+','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','*','&','&','&']]";
	this.player = 1;
	this.turns = 10;
	this.axis=new CGFaxis(this);


    this.timeNow = new Date().getTime();
  //  this.q = new Queen(this,[5,5]);
	

	this.setUpdatePeriod(50);
	this.appearance = new CGFappearance(this);
	this.appearance.setAmbient(0.3, 0.3, 0.3, 1);
	this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
	this.appearance.setSpecular(0.0, 0.0, 0.0, 1);	
	this.appearance.setShininess(120);

	
	//this.interface.menu();
	this.setPickEnabled(true);
	// font texture: 16 x 16 characters
	// http://jens.ayton.se/oolite/files/font-tests/rgba/oolite-font.png
	this.fontTexture = new CGFtexture(this, "textures/oolite-font.png");
	this.appearance.setTexture(this.fontTexture);

	// plane where texture character will be rendered
	this.plane=new Plane2(this);
	
	// instatiate text shader
	this.textShader=new CGFshader(this.gl, "shaders/font.vert", "shaders/font.frag");

	// set number of rows and columns in font texture
	this.textShader.setUniformsValues({'dims': [16, 16]});


	

};

XMLscene.prototype.initLights = function() {
    this.lights = [];
    this.lightsID = [];

    for (var i = 0; i < this.graph.lights.length; i++) {
        var l = this.graph.lights[i];
        var aux = new CGFlight(this, i);

        aux.lsxid = l.id;
        l.enabled ? aux.enable() : aux.disable();
        aux.setPosition(l.position.x, l.position.y, l.position.z, l.position.w);
        aux.setAmbient(l.ambient.r, l.ambient.g, l.ambient.b, l.ambient.a);
        aux.setDiffuse(l.diffuse.r, l.diffuse.g, l.diffuse.b, l.diffuse.a);
        aux.setSpecular(l.specular.r, l.specular.g, l.specular.b, l.specular.a);
        aux.setVisible(true);
        aux.update();

        this.lights[i] = aux;
        this.lightsID[l.id] = l.enabled;
    }

    this.interface.initLights();

};
XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(4, 0, 4));
    this.cameraDestination = [15,15,15];
    this.cameraTransition = false;
    this.camTransTime = 1000;
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
  	
	this.initLights();
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

	//this.initLights();
    //LEAVES
    this.setLeaves();


    //NODES
    this.setNodes();


	this.transformBoard();

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



};

XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
 	this.logPicking();
	this.clearPickRegistration();
	
	//console.log(this.map.length + "aqui");
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();
    if (this.graph.loadedOk){
     for (var i = 0; i < this.lights.length; i++)
            this.lights[i].update();}
	// An example of how to show something that is not affected by the camera (e.g. a HUP display)
	this.appearance.apply();
	this.setActiveShaderSimple(this.textShader);
	this.pushMatrix();
	this.scale(0.1,0.1,1);
	this.activeShader.setUniformsValues({'charCoords': [8,4]});
		this.translate(-14,19,-10);
		this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [5,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [3,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [1,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [4,5]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [15,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [13,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [2,4]});
	this.translate(1,0,0);
	this.plane.display();
	if(tempplayer == 1){
		this.activeShader.setUniformsValues({'charCoords': [0,5]});
	this.translate(-5,-35,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [12,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [1,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [9,5]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [5,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [2,5]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [1,3]});
	this.translate(2,0,0);
	this.plane.display();
	}
	else{
		this.activeShader.setUniformsValues({'charCoords': [0,5]});
	this.translate(-5,-35,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [12,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [1,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [9,5]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [5,4]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [2,5]});
	this.translate(1,0,0);
	this.plane.display();
	this.activeShader.setUniformsValues({'charCoords': [2,3]});
	this.translate(2,0,0);
	this.plane.display();
	}	
	this.popMatrix();
	
	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();
		this.pushMatrix();


		this.scale(1,1,1);

		// set character to display to be in the 6th column, 5th line (0-based)
		// the shader will take care of computing the correct texture coordinates 
		// of that character inside the font texture (check shaders/font.vert )
		// Homework: This should be wrapped in a function/class for displaying a full string
		this.translate(3,3,0);
		this.activeShader.setUniformsValues({'charCoords': [12,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [1,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [9,4]});
		this.plane.display();

		this.translate(1,0,0);
		this.activeShader.setUniformsValues({'charCoords': [7,4]});
		this.plane.display();

	this.popMatrix();
	this.setActiveShaderSimple(this.defaultShader);	


	
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

        this.setAnimation();


      //  this.q.display();
		//Lights
       

        //Nodes

        for(var i = 0; i < this.nodesList.length; i++){
        
        	var node = this.nodesList[i];
        	//console.log(node["texture"]);
            this.pushMatrix();
            node["material"].setTexture(node["texture"]);
            if (node["texture"] != null) {
            	//console.log(node["primitive"]);
                node["primitive"].updateTex(node["texture"].amplifFactor_S, node["texture"].amplifFactor_T);
            }
            
            if(node["animationref"] != null){
            	this.multMatrix(node["animationref"].matrix);
            	//console.log(node["animationref"].matrix);
			}
            node["material"].apply();
            if(node["id"] != "queen" && node["id"] != "king")
            	this.multMatrix(node["matrix"]);
            this.registerForPick(node["id"], node["primitive"]);
           // if(node["id"] == "queen")
          	//  console.log(node["primitive"]);
            node["primitive"].display();
            this.popMatrix();
        }


        //queens
/*
        for(var i = 0; i < this.queensList.length; i++){
        
        	var queen = this.queensList[i];
        	var inter = "dont"
            this.pushMatrix();
            this.registerForPick(inter, queen);
        	queen.display(); 
            this.popMatrix();
        }

         //kings

        for(var i = 0; i < this.kingsList.length; i++){
        
        	var king = this.kingsList[i];
        	
            this.pushMatrix();
        	king.display();    
            this.popMatrix();
        }


        */
	}

	//this.transformBoard();

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
                sphere = new Sphere(this, leaf.args[0]);
                console.log("SPHERE----");
			    console.log(leaf.args[0]);
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
                //patch1 = new patch(this,leaf.args);
                patch1 = new Queen (this, [1,2]);
                patch1.id = leaf.id;
                this.leaveslist.push(patch1);
                break;

            case "terrain":
                terrain = new terrain(this,leaf.args);
                terrain.id = leaf.id;
                this.leaveslist.push(terrain);
                break;
            case "queen":
                queen1 = new Queen (this, [1,2]);
                queen1.id = leaf.id;
                this.leaveslist.push(queen1);
                break;
            case "king":
                king1 = new King (this, [1,2]);
                king1.id = leaf.id;
                this.leaveslist.push(king1);
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

//@Apu
XMLscene.prototype.indexNode = function(id) {
	for(var i = 0; i<this.nodesList.length; i++){
		if(this.nodesList[i].id == id){
			return i;
		}

	}
	return -1;

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

	if(this.cameraTransition) {
		if(!this.camTransBeg) this.camTransBeg = timeNow;  //BEGINNING
		else
			{
			var time_since_start = timeNow - this.camTransBeg;
			if(time_since_start>=this.camTransTime) 
				{ //END
				this.camera.setPosition(this.cameraDestination);
				this.camTransBeg=null;
				this.cameraTransition=false;
				}
			else 
				{
				var time_perc = time_since_start / this.camTransTime;
				var new_pos = [this.cameraOrigin[0]+(this.transitionVec[0]*time_perc),
				this.cameraOrigin[1]+(this.transitionVec[1]*time_perc),
				this.cameraOrigin[2]+(this.transitionVec[2]*time_perc)];
				this.camera.setPosition(new_pos);
				}
			}
	}
 //if(this.player == 1) this.cameraGreen();
   //             else this.cameraGreen();
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
					
					var customId = this.pickResults[i][1];				
					console.log("Picked object: " + obj + ", with pick id " + customId + ", with coordX = " + Math.floor(customId/10) + ", with coordY = " + customId % 10);
				
				console.log(this.piece1);
				this.temptex = this.nodesList[this.indexNode(customId)]["texture"];
				this.nodesList[this.indexNode(customId)]["texture"] =null;
				if(this.piece1 == 1){
					this.xf = Math.floor(customId/10) - 1;
					this.yf = customId % 10 -1;
					this.makeRequest(this.xi,this.yi,this.xf,this.yf);

					this.getPieceToMove(this.xi,this.yi,this.xf,this.yf);

					this.texture2 = this.temptex;
					this.piece1 = 0;
					this.id2 = customId;
					this.nodesList[this.indexNode(this.id1)]["texture"] =this.texture1;
					this.nodesList[this.indexNode(this.id2)]["texture"] =this.texture2;
		
				}
				else{
				this.piece1 = 1;
				this.texture1 = this.temptex;
				this.id1 = customId;
				this.xi = Math.floor(customId/10) - 1;
				console.log("LOGGG"+this.xi);

				this.yi = customId % 10 - 1;
				//this.yi = customId % 10;
				}
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}		
	}
};

XMLscene.prototype.getPrologRequest = function (requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

XMLscene.prototype.makeRequest = function(xi,yi,xf,yf)
{
	// Get Parameter Values
	//var requestString = "pvpgame(1,[['$','$','$','$','+','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['$','$','$','$','$','$','$','$'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','&','&','&','&'],['&','&','&','&','*','&','&','&']],10,4,3,4,4)";				

	console.log("XI:" + xi + " YI: " + yi + "XF: " + xf + "YF: " + yf);
	//absoluto para já a move porque nem todas dão

	//console.log("MAPPPP"+this.map);
	//absoluto para já a move

	//var requestString = "pvpgame(" + this.player + ","+ this.map +"," +this.turns + ","+ xi +"," +yi+","+xf+","+yf+")";
	var requestString = "pvpgame(" + tempplayer + ","+ map +"," +tempturns + ","+ yi +"," +xi+","+yf+","+xf+")";

	console.log(requestString);
	// Make Request
	this.getPrologRequest(requestString, this.handleReply);

};

XMLscene.prototype.transformBoard = function(){

	var aux = map.split("");
	console.log(aux);

	var mappieces = [];
	var x = 0;
	var y = 7;
		
	for(var k=0; k< aux.length;k++){
		if(aux[k]=='$'||aux[k]=='&'||aux[k]=='+'||aux[k]=='*'||aux[k]==' ')
		{
			mappieces.push(aux[k]);
		}
	}

	console.log("MapPieces");
	console.log(mappieces);	
		
	console.log(this.map);

	for (var i=0; i< mappieces.length; i++) {

		//console.log(x+"-"+y + "-aquiiiiiiiiii");
			if(mappieces[i] == '$'){
				var q = new Queen(this,[x,y]);
				var queen = [];
				queen["texture"] = new CGFtexture(this, "scenes/textures/green.jpg");
			    queen["material"] = this.materialsList[0];
			    queen["animationref"] = null;
			    queen["primitive"] = q;
			    queen["id"] = "queen";
				this.nodesList.push(queen);

			}

			else if(mappieces[i] == '&'){
				var q = new Queen(this,[x,y]);
				var queen = [];
				queen["texture"] = new CGFtexture(this, "scenes/textures/blue.jpg");
			    queen["material"] = this.materialsList[0];
			    queen["animationref"] = null;
			    queen["primitive"] = q;
			    queen["id"] = "queen";
				this.nodesList.push(queen);

			}

			else if(mappieces[i] == '+'){
				var k = new King(this,[x,y]);
				var king = [];
				king["texture"] = new CGFtexture(this, "scenes/textures/golden.jpg");
			    king["material"] = this.materialsList[0];
			    king["animationref"] = null;
			    king["primitive"] = k;
			    king["id"] = "king";
				this.nodesList.push(king);
			}

			else if(mappieces[i] == '*'){
				var k = new King(this,[x,y]);
				var king = [];
				king["texture"] = new CGFtexture(this, "scenes/textures/golden2.jpg");
			    king["material"] = this.materialsList[0];
			    king["animationref"] = null;
			    king["primitive"] = k;
			    king["id"] = "king";
				this.nodesList.push(king);
			}


		y = y - 1;

		if(i==7||i==15||i==23||i==31||i==39||i==47||i==55||i==63)
		{
			x = x + 1;
			y = 7;
		}
	}console.log(x+"-"+y + "-aquiiiiiiiiii");

};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return this.substring(0, index) + string + this.substring(index, this.length);
  else
    return string + this;
};

//Handle the Reply
XMLscene.prototype.handleReply = function(data){
	console.log(data.target.response);
	
	console.log("Resposta em bruto:");
	var resposta = data.target.response.split("");
	console.log(data.target.response);
	// parse server response
   
    console.log('Código de resposta:' + resposta[1]);
	
    // handle reply
    switch(resposta[1]){
      case '0':
       	map = data.target.response.slice(3);
       	map = map.substring(0, map.length - 1);
       	var x=2;
       	for(x=2;x<map.length;x++){
       		if(map[x] != "," && map[x] != "]" && map[x] != "["){
			if(map[x] != " "){
       		map = map.insert(x,"'");
			map = map.insert(x + 2,"'");
			x += 3;
			}
			else{
				map = map.insert(x,"''");
				var t = map.substring(0,x+2);
				var p = map.substring(x+3,map.length);
				map = t+p;
				x += 2;
			}
       		}
       		if((map[x] == "[" && map[x+1] == ",") || (map[x] == "," && map[x+1] == "]") || (map[x] == "," && map[x+1] == ",")){
       			map = map.insert(x + 1,"''");
			//	var t = map.substring(0,x+2);
			//	var p = map.substring(x+3,map.length);
			//	map = t+p;
				x += 2;
       		}
			/*
			else{
				if(map[x+1] != "]"){
			map = map.insert(x,"'',");
			var p =  map.substring(0, x+3);
			var t = map.substring(x+5,map.length);
			console.log(p);
			console.log(t);
			map=p+t;
			x += 2;
				}
				else{
			console.log(map);
       		map = map.insert(x,"''");
       		x += 2;
				}
			}
       		}
       		
*/
       		
       	}
        console.log("Mapa após pedido: "+map);
       if(tempplayer == 1)
        tempplayer = 2;
		else
		tempplayer = 1;
		tempturns--;
        break;
      default:
        console.log('erro no servidor');
        break;
    }
   
	//document.querySelector("#query_result").innerHTML=data.target.response;
};

XMLscene.prototype.getPieceToMove = function(xi,yi,xf,yf){
	var xi1 = 0;
	 for(var i = 0; i < this.nodesList.length; i++){
        var node = this.nodesList[i];
        if(node["id"] == "queen" || node["id"] == "king"){
        	console.log("mod"+ (yi%2));
        	console.log("xi"+ xi + "yi" + yi);
        	if((yi%2)==1){
        		
	        	if(xi == 0)
	        		xi1 = 7;
	        	else if(xi == 1)
	        		xi1 = 6;
	        	else if(xi == 2)
	        		xi1 = 5;
	        	else if(xi == 3)
	        		xi1 = 4;
	        	else if(xi == 4)
	        		xi1 = 3;
	        	else if(xi == 5)
	        		xi1 = 2;
	        	else if(xi == 6)
	        		xi1 = 1;
	        	else if(xi == 7)
	        		xi1 = 0;
			}
			else if((yi%2)==0)
			{
				if(xi == 0)
	        		xi1 = 7;
	        	else if(xi == 1)
	        		xi1 = 6;
	        	else if(xi == 2)
	        		xi1 = 5;
	        	else if(xi == 3)
	        		xi1 = 4;	
				else if(xi == 4)
	        		xi1 = 3;
	        	else if(xi == 5)
	        		xi1 = 2;
	        	else if(xi == 6)
	        		xi1 = 1;
	        	else if(xi == 7)
	        		xi1 = 0;
			}


        	if(node["primitive"].x == xi1 && node["primitive"].y == yi){
        		console.log(xi + "xi, " + yi + "yi");
        		var cp = [];
        		cp[0] = [];
        		cp[0].push(0);
        		cp[0].push(0);
        		cp[0].push(0);
        		cp[1] = [];	
        		cp[1].push(xf);
        		cp[1].push(yf);
        		cp[1].push(0);

        		var animation = [];
        		animation = new LinearAnimation("movePiece", 5, cp);
				animation["type"] = 'linear';
				node["animationref"] = "movePiece";
				this.animationsList.push(animation);
			}

        }

    }

};

//Cameras

XMLscene.prototype.cameraTop = function() {

    if(!this.cameraTransition) {
        this.cameraOrigin=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
        this.cameraDestination = [0,25,4];
        if(!arraysEqual(this.cameraDestination, this.cameraOrigin)) this.calcTransition();
    }
};


XMLscene.prototype.cameraBlue = function() {

    if(!this.cameraTransition) {
        this.cameraOrigin=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
        this.cameraDestination = [20,10,4];
        if(!arraysEqual(this.cameraDestination, this.cameraOrigin)) this.calcTransition();
    }
};

XMLscene.prototype.cameraGreen = function() {

    if(!this.cameraTransition) {
        this.cameraOrigin=[this.camera.position[0], this.camera.position[1], this.camera.position[2]];
        this.cameraDestination = [-12,10,4];
        if(!arraysEqual(this.cameraDestination, this.cameraOrigin)) this.calcTransition();
    }
};

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

XMLscene.prototype.calcTransition = function() {
    this.transitionVec = [this.cameraDestination[0]-this.cameraOrigin[0],
            this.cameraDestination[1]-this.cameraOrigin[1],
            this.cameraDestination[2]-this.cameraOrigin[2]];

    this.cameraTransition = true;
};
XMLscene.prototype.switchLight = function(id, _switch) {
    for (var i = 0; i < this.lights.length; ++i) {
        if (id == this.lights[i].lsxid) {
            _switch ? this.lights[i].enable() : this.lights[i].disable();
        }
    }
};