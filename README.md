# Prototypon Helper Library



# Reference

### Load and insert a svg file

Insert at run-time an external svg file in order to manipulate it through javascript.

	Proto.placeSVG('your_svg_file.svg', function(){

		// the svg is ready to be manipulated
		// place here the code for your micro-interactions

	})

You can also assign a id to the loaded svg

	Proto.placeSVG('your_svg_file.svg', 'my_new_id', function(){

		// the svg is ready to be manipulated
		// place here the code for your micro-interactions

	})


### Make a clip

This method allows to make a clip mask passing 2 selectors that are:

- the container layer that contains all the elements that need to be masked and the mask element as well
- the shape or group of shapes that will be used as a mask element
    
```    
Proto.clip(container_selector, mask_selector)
```

You can get the new clip id from the method:

	var maskID = Proto.clip(container_selector, mask_selector)

This way you can select it for further manipulations.

	Proto.clip('#component', '#mask')
	
Where #component is the selector id of the layer that contais either the mask and the content that need to be clipped, and #mask is the selector id of the shape that should mask the content.



### Make a scroller with momentum

Usually you need to set up a mask before use this component.
You need to select the target that is the driver of the gesture. With the given value (x and y) you can do a different task:
	
	Proto.Impetus({
        source: '#content',
        update: function (x, y) {
        		// do whatever you want with them
        }
    });
    
Usually we want to move the content based on mouse/tap movement:

	var content = d3.select('#content');
    
	Proto.Impetus({
        source: '#content',
        update: function (x, y) {
        		d3.select('#content')
            		.attr('transform', 'translate(' + x + ', ' + y + ')')
        }
    });
    

And here with some constraints:
    
    var content = d3.select('#content');
    
	Proto.Impetus({
        source: '#content',
        boundY: [-409, 0], // height of content - height of mask
        initialValues: [0, 0],
        update: function (x, y) {
        		d3.select('#content')
            		.attr('transform', 'translate(0, ' + y + ')')
        }
    });



### Make a scrolling steps list

	Proto.Stepper({
                    source: '#content',
                    steps:4,
                    view_size: 400,
                    direction:'x',
                    initStep: 0,
                    update: function(val, norm) {
                        content.attr('transform', 'translate(' + val + ', 0)')
                    }
                })
                
You can also create an instance to get further methods:

    var myStepper = new Proto.Stepper({...})
    myStepper.getSpring();
    
to get the Rebound spring instance.


### Proto.coach

This method allows quickly to show a layer and attach a global click event in order to hide itself upon user interaction.
It could be useful to show some hints about what the user is supposed to do on the given micro-interaction.

	// 'selector' should be the layer id (e.g. '#myHelperInfo')
	Proto.coach( selector )

You can also providing a callback to trigger a custom function

	Proto.coach( selector, myCallBack )
	
	function myCallBack(){
		// do something here
	}



    
