function patch(scene,args){
	
	console.log(args);
	this.args=args;
    this.order = this.args[0];
    this.partsU = this.args[1];
    this.partsV = this.args[2];
    this.controlPoints = this.getControlPoints(this.args[3]);

	if(this.order == 1){
		knots = [0, 0, 1, 1];
	}else if(this.order == 2){
		knots = [0, 0, 0, 1, 1, 1];
	}else if(this.order == 3){
		knots = [0, 0, 0, 0, 1, 1, 1, 1];
	}else{
		console.error("Only order between 1 and 3");
		return;
	}
	console.log(this.order);
	console.log(this.partsU);
	console.log(this.partsV);
	console.log(this.controlPoints);
	
	var nurbsSurface = new CGFnurbsSurface(this.order, this.order, knots, knots, this.controlPoints);
	getSurfacePoint = function(u, v) {
		return nurbsSurface.getPoint(u, v);
	};

    CGFnurbsObject.call(this,scene, getSurfacePoint, this.partsU, this.partsV);
}

patch.prototype = Object.create(CGFnurbsObject.prototype);
patch.prototype.constructor = patch;

patch.prototype.updateTex = function(ampS, ampT) {};

patch.prototype.getControlPoints = function(CPList) {
    var finalList = [];
    for (var Uorder = 0; Uorder <= this.order; ++Uorder) {
        var vList = [];
        for (var Vorder = 0; Vorder <= this.order; ++Vorder) {
            var index = Uorder * (this.order+1) + Vorder;
            vList.push(CPList[index]);
        }
        finalList.push(vList);
    }

    return finalList;
};
