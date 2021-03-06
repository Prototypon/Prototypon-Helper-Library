window.Proto = {};

(function (window, Proto, undefined) {
    
    var version = '0.0.24'

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
    Returns the selection array of the primitive shapes
    */
    function clip(container_selector, selector_mask){

        var component = d3.select(container_selector)
        var mask = d3.select(selector_mask).attr('display', 'block')
        
        var clipname = selector_mask.replace('#', '_') + '_' + container_selector.replace('#', '_')

        var defs = svg.select('defs')
        if(defs.size() == 0) defs = svg.append('defs')

        var clippath = defs.append('clipPath')
            .attr('id', clipname)

        var children = mask.selectAll('*')
        if(children.size() > 0){ // it's a group
            //children = mask.selectAll('*')
            children.each(function(d,i) { 
                clippath.node()
                    .appendChild(this)
            })
        }else{
            children = mask
            clippath.node()
                .appendChild(mask.node())
        }
        
        component.attr('clip-path', 'url(#'+clipname+')')

        return children[0];
    }


    /*
    Not sure it's helpful
    */
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

        clip('#body_clip_component', '#body_clip_mask')
    }



     /*
    Convenient function to set the following behaviour to an element:
    - fadein on call
    - click handler to fade itself out
    - removing from DOM
    */
    function coach(selector, clb){
        var _coach = svg.select(selector)
            .attr('display', 'block')

        _coach.attr('opacity', 0)
            .transition()
            .duration(900)
            .delay(500)
            .attr('opacity', 1)

        d3.select('body')
            .on('click', function(){
                _coach.remove()
                d3.select('body').on('click', null)

                if(clb){
                    clb()
                }
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
            update:_options.update,
            initStep: _options.initStep || 0
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
        
        var cstep = options.initStep/options.steps;
        spring.setCurrentValue(cstep)
        spring.setEndValue(cstep);
        currentPos = mapval(cstep, 0, 1, 0, (size * num * -1));
        step = options.initStep
        options.update(currentPos, cstep)


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

        this.getSpring = function(){
            return spring
        }
        
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

    function textCenter(selector){
        _alignText(selector, 'center')
    }

    function textRight(selector){
        _alignText(selector, 'right')
    }

    function click(selector, callback){
        $(selector).addClass('elementIsLink')
        $(selector).on('click', function(){
            callback()
        })
    }
    
    
    function show(selector){
        $(selector).css('display' ,'block')
    }
    
    function hide(selector){
        $(selector).css('display' ,'none')
    }


    // public properties
    Proto.version = version
    Proto.width = viewWidth
    Proto.height = viewHeight

    // public methods
    Proto.placeSVG = placeSVG
    Proto.clipBody = clipBody
    Proto.Stepper = _Rebound
    Proto.Momentum = _Impetus
    Proto.clone = clone
    Proto.clip = clip
    Proto.coach = coach
    Proto.textCenter = textCenter
    Proto.textRight = textRight
    Proto.click = click
    Proto.show = show
    Proto.hide = hide

    // legacy, to be removed at some point
    Proto.Impetus = _Impetus
    Proto.Rebound = _Rebound

  
})(window, window.Proto);
