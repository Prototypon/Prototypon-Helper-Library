window.Proto = {};

(function (window, Proto, undefined) {
  
    var viewWidth = $(window).width()
    var viewHeight = $(window).height()

    var width;
    var height;
    var svg;

    function placeSVG(svg_path, callback){

        d3.xml(svg_path, "image/svg+xml", function(xml) {
            d3.select('body').node().appendChild(xml.documentElement);
            
            svg = d3.select('svg');

            width = svg.attr('width')
            height = svg.attr('height')
            var view = svg.attr('viewBox').split(' ')

            if(!width) width = view[2]
            if(!height) height = view[3]
            
            // avoid this in iOS-7
            svg.attr('width', null)
                .attr('height', null)
            
            FastClick.attach(document.body);

            if(callback) callback()
        })

    }
    



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
    <g id="{selector_container}">
        <g>...</g>
        <g id="{selector_mask}">...</g>
    </g>
    */
    function clip(selector_container, selector_mask){

        var component = d3.select(selector_container)
        var mask = d3.select(selector_mask).node()
        
        component.append('defs')
            .node()
            .appendChild(mask)

        var clipname = 'maskclip' + selector_container.replace('#', '_')
        
        component.append('clipPath')
            .attr('id', clipname)
            .append('use')
            .attr('xlink:href', selector_mask)
        
        component.attr('clip-path', 'url(#'+clipname+')')
    }



    function clipBody(){

        var all = d3.selectAll('svg > *').remove()

        var comp = svg.insert('g', ':first-child')
            .attr('id', 'body_clip_component')

        var content = comp.append('g')
            .attr('id', 'body_clip_content')

        all.each(function(){
            var el = d3.select(this).node()
            content.node().appendChild(el)
        })

        comp.append('rect')
            .attr({width:width, height:height})
            .attr('id', 'body_clip_mask')

        clip('#body_clip_component', '#body_clip_mask', '#body_clip_content')
    }




    function showCoach(selector){
        var couch = svg.select(selector)
            .attr('display', 'block')

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
    }


    Proto.clone = clone
    Proto.clip = clip
    Proto.showCoach = showCoach
    Proto.width = viewWidth
    Proto.height = viewHeight
    Proto.placeSVG = placeSVG
    Proto.clipBody = clipBody

  
})(window, window.Proto);
