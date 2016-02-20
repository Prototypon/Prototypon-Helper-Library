# Prototypon-Helper-Library




# Methods

### Proto.placeSVG

Insert at run-time an external svg file in order to manipulate it through javascript.

	Proto.placeSVG('your_svg_file.svg', function(){

		// the svg is ready to be manipulated
		// place here the code for your micro-interactions

	})


### Proto.showCoach

This method allow to quick show a layer and attach a global click event to hide it upon user click.

	// 'selector' should be the layer id (e.g. '#myHelperInfo')
	Proto.showCoach( selector )



### Proto.clipBody

Make a clip mask on the whole body, useful to attach a scroll b
