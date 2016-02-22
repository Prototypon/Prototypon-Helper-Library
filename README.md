# Prototypon Helper Library




# Methods

### Proto.placeSVG

Insert at run-time an external svg file in order to manipulate it through javascript.

	Proto.placeSVG('your_svg_file.svg', function(){

		// the svg is ready to be manipulated
		// place here the code for your micro-interactions

	})


### Proto.coach

This method allows quickly to show a layer and attach a global click event to hide it upon user click.
It could be useful to show some hints about what the user is supposed to do on the given micro-interaction.

	// 'selector' should be the layer id (e.g. '#myHelperInfo')
	Proto.coach( selector )




### Proto.clip

This method allows to make a clip mask passing 2 selectors that are:

- the container layer that contains all the elements that need to be masked and the mask element as well
- the shape or group of shapes that will be used as a mask element
    
    Proto.clip(container_selector, mask_selector)
    
    
