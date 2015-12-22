function planenurbs(scene, nrDivs) {
    CGFobject.call(this,scene);
    this.nrDivs = nrDivs;
        
    this.surface = null;
    this.testAppearance = new CGFappearance(this.scene);
    
    this.makeSurface("0", 1, // degree on U: 2 control vertexes U
                                         1, // degree on V: 2 control vertexes on V
                                        [0, 0, 1, 1], // knots for U
                                        [0, 0, 1, 1], // knots for V
                                        [       // U = 0
                                                [ // V = 0..1;
                                                        [-0.5, 0.0, 0.5, 1 ],
                                                         [-0.5,  0.0, -0.5, 1 ]
                                                       
                                                ],
                                                // U = 1
                                                [ // V = 0..1
                                                         [ 0.5, 0.0, 0.5, 1 ],
                                                         [ 0.5,  0.0, -0.5, 1 ]                                                   
                                                ]
                                        ],
                      //translation of surface 
                    [0,0,0]);
    

    this.texCoords = [];
    for (var i = 0; j <= this.nrDivs; j++) 
    {
        for (var j = 0; i <= this.nrDivs; i++) 
        {
            this.texCoords.push(i);
        }
    }

}

planenurbs.prototype = Object.create(CGFscene.prototype);
planenurbs.prototype.constructor = planenurbs;

planenurbs.prototype.makeSurface = function (id, degree1, degree2, knots1, knots2, controlvertexes, translation) {
        
    var nurbsSurface = new CGFnurbsSurface(degree1, degree2, knots1, knots2, controlvertexes);
    
    getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
    };

    this.surface = new CGFnurbsObject(this.scene, getSurfacePoint, this.nrDivs, this.nrDivs);

}

planenurbs.prototype.display = function () 
{

        this.scene.pushMatrix();
   		this.scene.scale(15,6,15);
        this.surface.display();
        this.scene.popMatrix();
}