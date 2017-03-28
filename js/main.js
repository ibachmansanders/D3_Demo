/* Main JavaScript sheet, Ian Bachman-Sanders, March 2017*/
window.onload = function(){ //begin code on window load

	//base svg on client viewport
	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

	//this is a d3 code block for the element container
	var container = d3.select("body") //use d3 to select the body element (the first it comes across)
		.append("svg") //append an svg element in the body, changing the selection to the svg
		.style("background-color","rgba(0,0,0,0.2)")
		.attr("width", w)//assign width
		.attr("height", h)//assign height
		.attr("class","container") //BEST PRACTICE assign class name matching variable name for styling, selection
		;

	//start a new code block to create a variable to put within the container
	//BEST PRACTICE create only one new element per block
	var rectangle = container.append("rect") //puts a <rect> into the svg
		.datum(w) //a single value available in this code block for anonymous functions
		.attr("width",function(){
				return w * 0.9;
			})
			.attr("x",function(){
				var xDist = w*0.1/2
				return xDist;
			}) //distance from left on x axis
			.attr("height",function(){
				return h * 0.9;
			})
			.attr("y",function(){
				return h*0.1/2
			}) //distance from top on y axis
		.style("fill","#FFFFFF")
		.attr("class","rectangle") //assigned class (same as object name)
		;

	//LESSON 2 & 3: Working in with data and arrays
	//let's add complex data to circles! A list of objects/dictionary
	var cityPop = [
	    { 
	        city: 'Madison',
	        population: 233209
	    },
	    {
	        city: 'Milwaukee',
	        population: 594833
	    },
	    {
	        city: 'Green Bay',
	        population: 104057
	    },
	    {
	        city: 'Superior',
	        population: 27244
	    }
	];

	//create a scale to map out the cities' x coordinates
	var xScale = d3.scaleLinear() //create the scale generator (NOT object, it is a tool reliant upon input)
		.range([w*0.1,w*0.9]) 
		//use original w, h values
		.domain([0,3.5]); //input min and max

	//create a y scale
	//find min value in array
	var minPop = d3.min(cityPop, function(d){
		return d.population;
	});
	//find max value in array
	var maxPop = d3.max(cityPop,function(d){
		return d.population;
	});
	//creat scale
	var yScale = d3.scaleLinear()
		.range([h*0.95,h*0.05]) //again based on rect dimensions, this time width
		.domain([
			0,
			700000
		]);

	//COLOR SCALE generator
	var colorScale = d3.scaleLinear()
		//choose a color range
		.range([
				//unclassed- to class, provide # of colors equal to classes
				"#99d8c9",
				"#005824"
		])
		//set your domain (based here on our array min max)
		.domain([
			minPop,
			maxPop
		]);

	//DRAW AXES
	var yAxis = d3.axisLeft(yScale) //create y axis generator
		.scale(yScale) //use yScale as the range and domain
		;

	//create axis <g> element and add it to the graph <g>= group, and will hold the several elements d3 creates
	var axis = container.append("g")
		.attr("transform",function(){
			return "translate("+w*0.05+",0)";
		}) //move axis onto screen
		.attr("class","axis")
		.call(yAxis) //same as yAxis(axis)
		;

	//THE MAGIC TRIO for using data - .d3.selectAll(),.data(),.enter()
	var circles = container.selectAll(".circles") //doesn't exist yet- creates an empty selection, allowing us to enter data from our array
		.data(cityPop) //call on the array above
		.enter() //enter the data into the container, magically - 
		//all following commands apply to all circles created based on array, like a loop
			.append("circle") //add a circle for each datum in the array into the svg
			.attr("r", function(d,i){ //set radius
				console.log("d: ",d,"i: ",i); //check out the values - i = index (array location)
				var area = d.population*0.01; //derive radius from population as area, scaled down to fit on screen
				return Math.sqrt(area/Math.PI);
			})
			.attr("cx",function(d,i){
				return xScale(i); //use the scaleLinear above to calculate cx, then convert units
			})
			.attr("cy",function(d){
				return yScale(d.population);
			})
			.style("fill",function(d){
				return colorScale(d.population)
			})
			.style("stroke","#005824")
			.attr("class","circles")
			.attr("id",function(d){
				return d.city; //assign each circle an id based on the name
			})
		;

	//ADD TITLE
	var title = container.append("text") //add a text element to the svg for a title
		.attr("text-anchor","middle") //anchor text to centerpoint
		.attr("x",w/2) //set text anchor location
		.attr("y",h*0.035)
		.text("City Populations") //add the text
		.attr("class","title") //provide a class, as always
		;

	//ADD LABELS
	var labels = container.selectAll(".labels") //iterate through the labels as they come
		.data(cityPop) //base data on city array
		.enter() //iterate through the cities
		.append("text")//add a text element
		.attr("text-anchor","left")
		.attr("y", function(d,i){
			//position inline w/ circles vertically
			return yScale(d.population)-5;
		})
		.attr("class","labels")
		;

	//label 1st line
	var nameLine = labels.append("tspan") //tspan is a child element of text, and can be positioned separately, allowing us to break up text
		.attr("x", function(d,i){
			//position to the right of each circle based on radius
			return xScale(i) + Math.sqrt(d.population*0.01/Math.PI) + 5;
		})
		.text(function(d){ //remember d is pulling from labels, which called the array
			return d.city;
		})
		.attr("class","nameLine")
		;

	//create a numbers as text format generator to format population
	var format = d3.format(","); //indicates that the numbers will be formatted using commas

	//label 2nd line
	var popLine = labels.append("tspan") //tspan is a child element of text, and can be positioned separately, allowing us to break up text
		.attr("x", function(d,i){
			//position to the right of each circle based on radius
			return xScale(i) + Math.sqrt(d.population*0.01/Math.PI) + 5;
		})
		.text(function(d){ //remember d is pulling from labels, which called the array
			return "Pop: " + format(d.population); //call format generator to format return
		})
		.attr("dy","1.5em") //offset the second line to avoid overlap
		.attr("class","popLine")
		;
};
