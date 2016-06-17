# Prototypon Helper Library


### deploy

Update the version in .js, push on master, git tag with same version, git push -u origin <tag>


## Quick Reference

### Load and insert a svg file

Insert at run-time an external svg file in order to manipulate it through javascript.

```js
Proto.placeSVG('your_svg_file.svg', function(){

	// the svg is ready to be manipulated
	// place here the code for your micro-interactions

})
```

You can also assign a id to the loaded svg

```js
Proto.placeSVG('your_svg_file.svg', 'my_new_id', function(){

	// the svg is ready to be manipulated
	// place here the code for your micro-interactions

})
```


### Make a clip

This method allows to make a clip mask passing 2 selectors that are:

- the container layer that contains all the elements that need to be masked and the mask element as well
- the shape or group of shapes that will be used as a mask element
    
```js
Proto.clip(container_selector, mask_selector)
```

You can get the selection of the primitive shapes from the method:

```js
var selections = Proto.clip(container_selector, mask_selector)
$(selections).each(function(){
	console.log(this)
})
```

This way you can select it for further manipulations.

```js
Proto.clip('#component', '#mask')
```

Where #component is the selector id of the layer that contais either the mask and the content that need to be clipped, and #mask is the selector id of the shape that should mask the content.



### TextCenter

Given a text element in SVG which align text always from left by default (even you set differently in Illustrator/Sketch), this function allow to convert its alignment behavior at run time in order to change the text content dynamically with the expected behavior.

```js   
Proto.textCenter(selector)
```
    

### TextRight

Given a text element in SVG which align text always from left by default (even you set differently in Illustrator/Sketch), this function allow to convert its alignment behavior at run time in order to change the text content dynamically with the expected behavior.

```js  
Proto.textRight(selector)
```
    


### Click

```js    
Proto.click(selector, callback)
```


### Show

Convenient method to show instantly any hidden selectors (comma separated with multiple selectors)

```js    
Proto.show(selector)
```


### Hide

Convenient method to hide instantly any visible selectors (comma separated with multiple selectors)

```js   
Proto.hide(selector)
```



### Make a scroller with momentum

Usually you need to set up a mask before use this component.
You need to select the target that is the driver of the gesture. With the given value (x and y) you can do a different task:

```js
Proto.Momentum({
    source: '#content',
    update: function (x, y) {
    		// do whatever you want with them
    }
});
```
    
Usually we want to move the content based on mouse/tap movement:

```js
var content = d3.select('#content');

Proto.Momentum({
    source: '#content',
    update: function (x, y) {
    		TweenMax.set('#content', {x:x, y:y})
    }
});
```
    

And here with some constraints:
    
```js
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
```



### Make a scrolling steps list

```js
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
```
                
You can also create an instance to get further methods:

```js
var myStepper = new Proto.Stepper({...})
myStepper.getSpring();
```

to get the Rebound spring instance.


### Proto.coach

This method allows quickly to show a layer and attach a global click event in order to hide itself upon user interaction.
It could be useful to show some hints about what the user is supposed to do on the given micro-interaction.

```js
// 'selector' should be the layer id (e.g. '#myHelperInfo')
Proto.coach( selector )
```

You can also providing a callback to trigger a custom function

```js
Proto.coach( selector, myCallBack )

function myCallBack(){
	// do something here
}
```




    
