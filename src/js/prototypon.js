window.Proto = {};

(function (window, Proto, undefined) {
  

    var width;
    var height;
    var svg;

    d3.xml(svg_path, "image/svg+xml", function(xml) {
        d3.select('body').node().appendChild(xml.documentElement);
        
        svg = d3.select('svg');

        width = svg.attr('width')
        height = svg.attr('height')
        var view = svg.attr('viewBox').split(' ')

        if(!width) width = view[2]
        if(!height) height = view[3]
        
        if(d3.select('#couch_blueprint')){
            showCouchMark('#couch_blueprint');
        }
        
        // avoid this in iOS-7
        svg.attr('width', null)
            .attr('height', null)
        

        FastClick.attach(document.body);
        ready()
    })



    /*
    Convenient function to clone an element in the same parent
    */
    function clone(selector) {
        var node = d3.select(selector).node();
        return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
    }




    /*
    Convenient function to set a clip-path to an element.
    The markup should follows this structure:
    <g id="{selector_component}">
        <g id="{selector_content}">...</g>
        <g id="{selector_mask}">...</g>
    </g>
    */
    function clip(selector_component, selector_mask, selector_content){

        var component = d3.select(selector_component)
        var mask = d3.select(selector_mask).node()
        var content = d3.select(selector_content)
        
        component.append('defs')
            .node()
            .appendChild(mask)

        var clipname = 'maskclip' + selector_component.replace('#', '_')
        
        component.append('clipPath')
            .attr('id', clipname)
            .append('use')
            .attr('xlink:href', selector_mask)
        
        component.attr('clip-path', 'url(#'+clipname+')')
    }




    function showCouch(selector){
        
        setTimeout(function(){
            console.log('show', selector);
            var couch = svg.select(selector)
                .attr('display', 'block')

            couch.insert('rect', ":first-child")
                .attr({width:width, height:height})
                .attr('fill', 'white')
                .attr('opacity', .75)

            couch.attr('opacity', 0)
                .transition()
                .duration(900)
                .delay(500)
                .attr('opacity', 1)

            d3.select('body')
                .on('click', function(){
                console.log('remove', selector);
                    couch.remove()
                    d3.select('body').on('click', null)
            })
        }, 100);
    }


    Proto.clone = clone
    Proto.clip = clip
    Proto.showCouch = showCouch


  
})(window, window.Proto);
