// define the dimensions and margins for the graph
var margin = {top: 30, right: 100, bottom: 100, left: 80};
var width = 860 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;
var padding = 1;

// append svg element to the body of the page
// set dimensions and position of the svg element
var svg = d3.select("#chart-area")
            .append("svg")
            .attr("width", width + margin.left + margin.right )
            .attr("height",height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
          
var chartGroup = svg.append("g") .attr("transform","translate("+margin.left+","+margin.top+")")
chartGroup.append("g")
    .append("text")
    .attr('x', width/2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '20px')
    .attr('class', 'Chart-Title')
    .style("font-weight","bold")
    .text('Board games by Rating 2015-2019');

colors = ["green", "red", "blue", "purple","brown"]

d3.csv("average-rating.csv")
    .then(
        function(data) 
        {
            var nest = d3.nest()
                        .key(function(row) { return row.year; })
                        .key(function(row) { return Math.floor(row.average_rating)})
                        .rollup(function(leaves) { return leaves.length; })
                        .entries(data)
                        .map(function(d)
                        {
                            if (d.key ==="2015")
                                {
                                    d.values.push({key:"0",value:0})
                                    d.values.push({key:"1",value:0})
                                    d.values.push({key:"2",value:0})
                                    d.values.push({key:"9",value:0})
                                }
                            if (d.key ==="2016")
                                {
                                    d.values.push({key:"0",value:0})
                                    d.values.push({key:"1",value:0})
                                    d.values.push({key:"2",value:0})
                                    d.values.push({key:"9",value:0})
                                }
                            if (d.key ==="2017")
                                {
                                    d.values.push({key:"0",value:0})
                                    d.values.push({key:"1",value:0})
                                    d.values.push({key:"2",value:0})
                                }
                            if (d.key ==="2018")
                                {
                                    d.values.push({key:"0",value:0})
                                }
                            if (d.key ==="2019")
                                {
                                    d.values.push({key:"0",value:0})
                                    d.values.push({key:"1",value:0})
                                    d.values.push({key:"2",value:0})
                                    d.values.push({key:"3",value:0})
                                    d.values.push({key:"4",value:0})
                                    d.values.push({key:"5",value:0})
                                }
                            return d
                        })   
            //data =data.forEach(function (d){return d.average_rating = Math.floor(d.average_rating)})
            data.forEach(function(d){d.average_rating = Math.floor(+d.average_rating)})
            console.log(data)           
            var fildata = 
                nest.filter(
                    function (d) 
                        { 
                            return d.key >=2015 & d.key <=2019 
                        })
            
                fildata.forEach(
                    function(d)
                        {
                            d.values.sort(
                                function(a,b)
                                    {
                                        return d3.ascending(+a.key,+b.key)
                                    })
        
                        })               

            aggData = []
                for (var i = 0; i < fildata.length; i++) 
                {
                    
                    for (var j = 0; j < fildata[i].values.length; j++) 
                    {
                        aggDataValues = {}  
                        aggDataValues.year = fildata[i].key;                      
                        aggDataValues.ratings = fildata[i].values[j].key;
                        
                        aggDataValues.count = fildata[i].values[j].value;
                        aggData.push(aggDataValues) 
                    }                    
                }
            console.log('aa', aggData)
            console.log('df', fildata)
            var x = d3.scaleLinear()
                .range([0,width])
                .domain([0,d3.max(aggData,function(d){return d.ratings})]);           
               
            var y = d3.scaleLinear()
                .range([height,20])
                .domain([0,d3.max(aggData,function(d){return d.count })]);
            
            var yAxis = d3.axisLeft(y)
                            .scale(y)
            var xAxis = d3.axisBottom()
                            .scale(x)                   
            

            var line = d3.line()
                        .defined(function(d){return d})
                    
                        .x(function(d){return x(+d.ratings)})
                        .y(function(d){return y(+d.count)}); 
            
            

            var years = d3.map(aggData, function(d){return d.year;}).keys()
            

            for (var j = 0; j < years.length; j++) 
            {                
                chartGroup.append("path")
                          .attr("d",line(aggData.filter(function(d) { if( d.year == years[j]){ return d;} })))
                          .attr("stroke-width", 1)
                          .style("fill","none")
                          .style("stroke", colors[j])
                var circle = chartGroup.selectAll("circle"+j)
                                       .data(aggData.filter(function(d) { if( d.year == years[j]){ return d;} }))
                                       .enter().append("circle")
                                       .attr("cx",function(d){return x(d.ratings);})
                                       .attr("cy",function(d){return y(d.count);})
                                       .attr("r",5)
                                       .attr("class","circle"+j)
                                       .attr("fill",colors[j])                          
                                       .on('mouseover', function(d, i) 
                                            {                                                
                                                d3.select(this).transition().duration(100).attr('r', 8);
                                                
                                                var height2 = 300 - margin.top - margin.bottom;
                                                var width2  = 600 - margin.left - margin.right;
                                                
                                                var svg2 = d3.select("#chart-area2")
                                                                .append("svg")
                                                                .attr("width",width2 + margin.left + margin.right +10)
                                                                .attr("height",height2 + margin.top + margin.bottom)
                                                                .attr("id", "barchart")
                                                              
                                                var chartGroup2 = svg2.append("g")
                                                                        .attr("transform","translate("+160+","+margin.top+")")

                                                var hoverfilter = data.filter(function(e){return e.average_rating==d.ratings & e.year == d.year });
                                                console.log('hh', hoverfilter)                                       
                                                svg2.classed("active", true);
                                                    
                                                    chartGroup2.append("g")
                                                            .append("text")
                                                            .attr('x', width2 / 2)
                                                            .attr('y', -10)
                                                            .attr('text-anchor', 'middle')
                                                            .attr('font-size', '20px')
                                                            .attr('class', 'Chart-Title2')
                                                            .style("font-weight","bold")
                                                            .text("Top 5 most rated games for the year " 
                                                                    + hoverfilter[j].year + " with rating "
                                                                    + hoverfilter[j].average_rating);

                                                    
                                                    hoverfilter.forEach(function(d){d.users_rated = +d.users_rated});                                          
                                                    
                                                    hoverfilter.sort(function(a, b) {
                                                        return d3.descending(+a.users_rated,+b.users_rated)
                                                        })
                                                    hoverfilter.map(function(d){ d.name = d.name.substring(0,10)})
                                                    var topfive = hoverfilter.slice(0,5);
                                                    topfive.forEach(function(d){d.users_rated = +d.users_rated});                                          
                                                    
                                                    console.log('t5', topfive);
                                                    topfive.sort(function(a,b){return a.users_rated-b.users_rated})
                                                    var maxUsers= d3.max(topfive,function(d){return d.users_rated;}); 
                                                    topgames = d3.map(topfive, function(d){return d.name;}).keys();
                                                    

                                                  //  topgames.forEach(function(d){ d.name =(d.name).substring(0,10)})
                                                 //   console.log(games)
                                                    

                                                var y2 = d3.scaleBand()
                                                                .range([height2, 0])
                                                                .domain(topgames)
                                                                .padding(0.5);
                                                
                                                    var x2 = d3.scaleLinear().nice()
                                                                .domain([0,maxUsers])
                                                                .range([0, width2]);
                                                
                                                    var yAxis2 = d3.axisLeft(y2);
                                                    var xAxis2 = d3.axisBottom(x2)
                                                                    .tickSize(-height2); 

                                                    ///x axis
                                                    chartGroup2.append("g")
                                                                .attr("transform","translate(0,"+height2+")")
                                                                .call(xAxis2)
                                                    chartGroup2.append("text")
                                                                .attr("id", "x2_axis_label")
                                                                .text("Number of users")
                                                                .attr('y', height2+35)
                                                                .attr('x',width2/2)
                                                                .attr('text-anchor', 'middle')

                                                    ///y axis
                                                    chartGroup2.append("g")
                                                                .call(yAxis2);
                                                    chartGroup2.append("text")
                                                                .attr("id","y2_axis_label")
                                                                .attr("transform", "rotate(-90)")
                                                                .text('Games')
                                                                .attr('text-anchor', 'middle')
                                                                .attr("x",0-margin.left)
                                                                .attr("y",-65 );

                                                    var rect = chartGroup2.selectAll(".rect")
                                                                        .data(topfive)
                                                                        .enter()
                                                                        .append("rect")                                                                
                                                                        .attr("y", function(d) { return y2(d.name);})
                                                                        .attr("height", 20)
                                                                        .attr("width",function(d,i){return x2(d.users_rated);})
                                                                        .attr("fill","steelblue")
                                                                        
                                                                        
                                            })

                                        .on('mouseout', function(d, i) 
                                                {
                                                   d3.select(this)
                                                        .transition()
                                                        .duration(100)
                                                        .attr('r', 5);                                                        
                                                   
                                                    var height2 = 0
                                                    var width2  = 0
                                                                    
                                                    var svg2= d3.select("#chart-area2").append("svg").attr("width",width2).attr("height",height2);
                                                    d3.select("#barchart").remove();
                                                    var chartGroup2 = svg2.append("g").attr("transform","translate("+margin.left+","+margin.top+")")
                                                                                                       
                                                }
                                                );
                        

            }

                chartGroup.append("g")
                .attr("class","x_axis")
                .attr("transform","translate(0,"+height+")")
                .call(xAxis);
                chartGroup.append("text")
                .attr("id", "x_axis_label")
                .text("Rating")
                .attr('y', height+margin.top+5)
                .attr('x',width/2)
                .attr('text-anchor', 'middle')                
                
                chartGroup.append("g")
                    .attr("class","axis y")
                    .call(yAxis);     
                
                chartGroup.append("text")
                    .attr("id","y_axis_label")
                    .attr("transform", "rotate(-90)")
                    .text("Count")
                    .attr('text-anchor', 'middle')
                    .attr("x",0 - (height / 2))
                    .attr("y",-40 )
                chartGroup.append("text")
                    .attr("id","credit")
                    .attr("x",width/2)
                    .attr("y",0)
                    .text("cmodi9")
                    .style("font-size",15);

                chartGroup.append("g")
                      .selectAll("circle").data(colors).enter().append("circle")
                      .attr("cx",620)
                      .attr("cy",function(d,i){return  17 *i;})
                      .attr("r",5)
                      .attr("fill",function(d,i){return d;});

                chartGroup.append("g")
                      .selectAll("text").data(years).enter().append("text")
                      .attr("x",630)
                      .attr("y",function(d,i){return 5 + 17 *i;})
                      .text(function(d) { return d; })
                      .style("font-size","12px")
                      .style("font-weight","bold");                     


        })