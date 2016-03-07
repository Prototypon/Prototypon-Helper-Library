window.Proto = {};

(function (window, Proto, undefined) {
  
    var viewWidth = $(window).width()
    var viewHeight = $(window).height()
    
    var ratioW
    var ratioH

    var width;
    var height;
    var svg;

    function placeSVG(svg_path, svg_id, callback){

        var id = _.isString(svg_id) ? svg_id : null
        var clb = _.isFunction(svg_id) ? svg_id : callback

        d3.xml(svg_path, "image/svg+xml", function(xml) {
            var sv = d3.select('body').node().appendChild(xml.documentElement);
            
            svg = d3.select(sv);

            if(id){
                svg.attr('id', id)
            }

            // some exported svg don't have with and height set properly
            if(svg.attr('width')){
                width  = +svg.attr('width').split('px')[0]
                height = +svg.attr('height').split('px')[0]
            }
            
            var view = svg.attr('viewBox').split(' ')

            if(!width)  width  = +view[2]
            if(!height) height = +view[3]
            
            // avoid this in iOS-7
            svg.attr('width', null)
                .attr('height', null)
            
            ratioW = viewWidth/width
            ratioH = viewHeight/height
            
            FastClick.attach(document.body);

            if(clb) clb()
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
    Returns the selector name of the clippath symbol to allows direct manipulation
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
            children = mask.selectAll('g > *')
            children.each(function(d,i) { 
                clippath.node()
                    .appendChild(this)
            })
        }else{
            clippath.node()
                .appendChild(mask.node())
        }
        
        component.attr('clip-path', 'url(#'+clipname+')')

        return clippath;
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
                couch.remove()
                d3.select('body').on('click', null)
        })
    }

    
    
    function _Impetus(_options) {
        
        var driver = d3.select(_options.source).node()
       
        _options.source = driver
        
        new Impetus(_options)
    }
    
    
    
    function _Rebound(_options) {
        
        var options = {
            source:_options.source,
            steps:_options.steps,
            view_size:_options.view_size,
            direction:_options.direction,
            update:_options.update
        }
                
        var mapval = rebound.MathUtil.mapValueInRange
        var springSystem = new rebound.SpringSystem()
        var spring = springSystem.createSpring(50, 10)

        var el = $(options.source)
        var num = options.steps
        var size = options.view_size //$(document).width();

        var mousedown = false
        var current = 0
        var last = 0
        var currentPos = 0
        var currentShift = 0
        var step = 0
        var prp = (options.direction == 'x') ? 'pageX' : 'pageY'
        var ratio = (options.direction == 'x') ? ratioW : ratioH
        var prevLast

        el.on('touchmousedown', function (e) {
            var ev = e[prp] / ratio
            current = ev
            mousedown = true
        });

        $('body').on('touchmousemove', function (e) {
            if (!mousedown) return;
            
            var ev = e[prp] / ratio

            var fakt = 1;
            if (step == 0 && ev > current) {
                fakt = .19;
            }
            if (step == num-1 && ev < current) {
                fakt = .19;
            }

            currentShift = (ev - current) * fakt;
            
            var v = (currentPos + currentShift);
            var shiftNorm = mapval(v, 0, size * num, 0, 1)
            options.update(v, shiftNorm*-1)
            
            spring.setCurrentValue(shiftNorm * -1);
            
            prevLast = last
            last = ev;
        })

        $('body').on('touchmouseup', function (e) {
            if (!mousedown) return;
            mousedown = false;
            currentPos += currentShift;

            if (last < prevLast) {
                step++;
                if (step > num - 1) step = num - 1;
            } else {
                step--;
                if (step < 0) step = 0;
            }
            spring.setEndValue(step / num);
        })

        spring.addListener({
            onSpringUpdate: function (spring) {
                var norm = spring.getCurrentValue();
                val = mapval(norm, 0, 1, 0, (size * num * -1));
                if (!mousedown) {
                    options.update(val, norm)
                    currentPos = val
                }
            }
        });
        
    }


    function _alignText(sel, align){
        var _align = (align == 'center') ? 'middle' : 'end'

        var bbox = d3.select(sel).node().getBBox();

        var tr = d3.transform( d3.select(sel).attr('transform') )
        var _val = (align == 'center') ? bbox.width/2 : bbox.width
        tr.translate[0] += _val

        d3.select(sel)
            .attr('transform', tr)
            .attr('text-anchor', _align)
    }

    function textCenter(sel){
        _alignText(sel, 'center')
    }

    function textRight(sel){
        _alignText(sel, 'right')
    }




    Proto.clone = clone
    Proto.clip = clip
    Proto.coach = coach
    Proto.width = viewWidth
    Proto.height = viewHeight
    Proto.placeSVG = placeSVG
    Proto.clipBody = clipBody
    Proto.Rebound = _Rebound
    Proto.Impetus = _Impetus
    Proto.textCenter = textCenter
    Proto.textRight = textRight

  
})(window, window.Proto);
