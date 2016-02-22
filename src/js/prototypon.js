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
        var newnode = d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
        newnode.attr('id', null)
        return newnode;
    }




    


    /*
    Convenient function to set a clip-path to an element.
    The markup should follows this structure:
    <g id="{container_selector}">
        <g>...</g>
        <g id="{selector_mask}">...</g>
    </g>
    The selector mask group need to contains shapes (circle, rect, etc) and path only
    */
    function clip(container_selector, selector_mask){

        var component = d3.select(container_selector)
        var mask = d3.select(selector_mask)
        
        var clipname = 'maskclip' + container_selector.replace('#', '_')

        var defs = svg.select('defs')
        if(defs.size() == 0) defs = svg.append('defs')

        var clippath = defs.append('clipPath')
            .attr('id', clipname)

        var children = mask.selectAll('*')
        if(children.size() > 0){
            children.each(function(d,i) { 
                clippath.node()
                    .appendChild(this)
            })
        }else{
            clippath.node()
                .appendChild(mask.node())
        }
        
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




    function coach(selector){
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
    Proto.coach = coach
    Proto.width = viewWidth
    Proto.height = viewHeight
    Proto.placeSVG = placeSVG
    Proto.clipBody = clipBody

  
})(window, window.Proto);
