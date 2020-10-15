//UTILITY FUNCTIONS

//WEBSITE DOM FUNCTIONS
function hideDD() { //Hides the Custom Dropdowns
  document.getElementById("selYear").style.visibility = "visible";
  document.getElementById("selYear").disabled = false;
  document.getElementById("begLabel").style.visibility = "hidden";
  document.getElementById("endLabel").style.visibility = "hidden";
  document.getElementById("begYear").disabled = true;
  document.getElementById("endYear").disabled = true;
  document.getElementById("begYear").style.visibility = "hidden";
  document.getElementById("endYear").style.visibility = "hidden";
}; // end of hideDD

function showDD(yrsVal) {
	   document.getElementById("begLabel").style.visibility = "visible";
       document.getElementById("endLabel").style.visibility = "visible";
	   document.getElementById("begYear").style.visibility = "visible";
       document.getElementById("endYear").style.visibility = "visible";
       document.getElementById("begYear").disabled = false;
	   document.getElementById("endYear").disabled = false;
	   
       document.getElementById("selYear").disabled = true;
	   document.getElementById("selYear").style.visibility = "hidden";

	   //Update Dropdowns
	   d3.select("#begYear")
				.selectAll('option')
				.data(yrsVal)
				.enter()
				.append('option')
				.attr('value', function(d) {return d;}) 
				.text(function(d) {return d;});
				
	   d3.select("#endYear")
				.selectAll('option')
				.data(yrsVal)
				.enter()
				.append('option')
				.attr('value', function(d) {return d;}) 
				.text(function(d) {return d;});
}; //end of showDD


//DATA MANIPULATION FUNCTIONS




//extendAxis extends the data array values to nearest whole 1000...
function extendAxis(indata){
		var MinVal = Number(indata[0]);
		var MaxVal = Number(indata[1]);

	// Adjusting MinVal
	if(Math.abs(MinVal) > 10000){
			var adjMin = (Math.floor(MinVal/10000)*10000) ;
	} else if(Math.abs(MinVal) > 1000){
			var adjMin = (Math.floor(MinVal/1000)*1000);
	  } else if(Math.abs(MinVal) > 100) {
			var adjMin = (Math.floor(MinVal/100)*100);
	  } else {
			var adjMin = (Math.floor(MinVal/10)*10);
	   };
	   
	// Adjusting MaxVal
	if(Number(MaxVal) > 10000){
			var adjMax = (Math.ceil(MaxVal/10000)*10000);
	} else if(Number(MaxVal) > 1000){
			var adjMax = (Math.ceil(MaxVal/1000)*1000);
	  } else if(Number(MaxVal) > 100) {
			var adjMax = (Math.ceil(MaxVal/100)*100);
	  } else {
			var adjMax = (Math.ceil(MaxVal/10)*10);
	   };
	var outArray = [adjMin,adjMax];
	return(outArray);
}

function rndJobs(inVal) {
	   if(Math.abs(inVal) > 1000) {
		  var outVal = Math.round(inVal/1000)*1000;
       } else if(Math.abs(inVal) > 100) {
		  var outVal = Math.round(inVal/100)*100;
	   } else {
		  var outVal = Math.round(inVal/10)*10;
	   };
return outVal;
}

//jobsHdr appends the jobs table objects into the svg 
function jobsHdr(tdata,yr,posLen,bSpace,bHeight,jobsD,xPos, type){

//Comma format
var formatComma = d3.format(",");
var formatDecimal = d3.format(".2");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Percentage Format
var formatPercent = d3.format(".1%")

//Y y anchor position
if(xPos > 400) {
   var rectanchorY = posLen * .20;
} else {
	var rectanchorY = posLen * .65;
}; 

if(type == 0){ //For the Count and Difference Tables
		var jobsN = +tdata[0].sum_jobs;
		var wageN = +tdata[0].total_wage;
		var jobsRnd = rndJobs(jobsN);
		//Scale jobsRnd
		if(jobsRnd > 1000000){
		   var jobVal = formatDecimal(jobsRnd/1000000);
		   var jobStr = jobVal + " Million Total Estimated Jobs";
		} else if(jobsRnd > 1000) {
		   var jobVal = formatDecimal(jobsRnd/1000);
		   var jobStr = jobVal + " Thousand Total Estimated Jobs";
        } else {
		   var jobStr = formatComma(jobRnd) + " Total Estimated Jobs";
        };
		var wageVal = formatDollar(wageN);
        var wageStr = wageVal + " Average Annual Wage";
        var yrStr = yr + " Employment Share by Wage";
		
		var lowStr = "(" + formatDollar(tdata[0].min_wage) + " - " + formatDollar(tdata[0].max_wage) + ") " + formatPercent(tdata[0].pct_jobs);
		var midStr = "(" + formatDollar(tdata[1].min_wage) + " - " + formatDollar(tdata[1].max_wage) + ") " + formatPercent(tdata[1].pct_jobs);
		var highStr = "(" + formatDollar(tdata[2].min_wage) + " - " + formatDollar(tdata[2].max_wage) + ") " + formatPercent(tdata[2].pct_jobs);
		//Output structure
		outArr = [{"color" : "#FFFFFF","text" : jobStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 1)},
		          {"color" : "#FFFFFF","text" : wageStr, "ypos" : rectanchorY + ((bSpace + bHeight + 2) * 2)},
				  {"color" : "#FFFFFF","text" : yrStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 3)},
				  {"color" : "#D85F02", "text" : lowStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 4)},
			      {"color" : "#757083", "text" : midStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 5)},
			      {"color" : "#1B9E77", "text" : highStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 6)}];
     } else {
//round jobs value and output string
var tabtxt = formatComma(rndJobs(jobsD)) + " Total Employment Change";
var outArr = [ {"color" : "#FFFFFF","text" : tabtxt, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 1)},
			{"color" : '#D85F02',"text" : "Less than 80% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 2)},
			{"color" : '#757083', "text" : "Between 81% to 120% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 3)},
			{"color" : '#1B9E77', "text" : "Greater than 120% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 4)}];
}

 

return outArr;
};


function switchFIPS(county){
   switch(county){
		case "Adams County":	
		fips = "001";	
		break;
		case "Alamosa County":	
		fips = "003";	
		break;
		case "Arapahoe County":	
		fips = "005";	
		break;
		case "Archuleta County":	
		fips = "007";	
		break;
		case "Baca County":	
		fips = "009";	
		break;
		case "Bent County":	
		fips = "011";	
		break;
		case "Boulder County":	
		fips = "013";	
		break;
		case "Broomfield County":	
		fips = "014";	
		break;
		case "Chaffee County":	
		fips = "015";	
		break;
		case "Cheyenne County":	
		fips = "017";	
		break;
		case "Clear Creek County":	
		fips = "019";	
		break;
		case "Conejos County":	
		fips = "021";	
		break;
		case "Costilla County":	
		fips = "023";	
		break;
		case "Crowley County":	
		fips = "025";	
		break;
		case "Custer County":	
		fips = "027";	
		break;
		case "Delta County":	
		fips = "029";	
		break;
		case "Denver County":	
		fips = "031";	
		break;
		case "Dolores County":	
		fips = "033";	
		break;
		case "Douglas County":	
		fips = "035";	
		break;
		case "Eagle County":	
		fips = "037";	
		break;
		case "Elbert County":	
		fips = "039";	
		break;
		case "El Paso County":	
		fips = "041";	
		break;
		case "Fremont County":	
		fips = "043";	
		break;
		case "Garfield County":	
		fips = "045";	
		break;
		case "Gilpin County":	
		fips = "047";	
		break;
		case "Grand County":	
		fips = "049";	
		break;
		case "Gunnison County":	
		fips = "051";	
		break;
		case "Hinsdale County":	
		fips = "053";	
		break;
		case "Huerfano County":	
		fips = "055";	
		break;
		case "Jackson County":	
		fips = "057";	
		break;
		case "Jefferson County":	
		fips = "059";	
		break;
		case "Kiowa County":	
		fips = "061";	
		break;
		case "Kit Carson County":	
		fips = "063";	
		break;
		case "Lake County":	
		fips = "065";	
		break;
		case "La Plata County":	
		fips = "067";	
		break;
		case "Larimer County":	
		fips = "069";	
		break;
		case "Las Animas County":	
		fips = "071";	
		break;
		case "Lincoln County":	
		fips = "073";	
		break;
		case "Logan County":	
		fips = "075";	
		break;
		case "Mesa County":	
		fips = "077";	
		break;
		case "Mineral County":	
		fips = "079";	
		break;
		case "Moffat County":	
		fips = "081";	
		break;
		case "Montezuma County":	
		fips = "083";	
		break;
		case "Montrose County":	
		fips = "085";	
		break;
		case "Morgan County":	
		fips = "087";	
		break;
		case "Otero County":	
		fips = "089";	
		break;
		case "Ouray County":	
		fips = "091";	
		break;
		case "Park County":	
		fips = "093";	
		break;
		case "Phillips County":	
		fips = "095";	
		break;
		case "Pitkin County":	
		fips = "097";	
		break;
		case "Prowers County":	
		fips = "099";	
		break;
		case "Pueblo County":	
		fips = "101";	
		break;
		case "Rio Blanco County":	
		fips = "103";	
		break;
		case "Rio Grande County":	
		fips = "105";	
		break;
		case "Routt County":	
		fips = "107";	
		break;
		case "Saguache County":	
		fips = "109";	
		break;
		case "San Juan County":	
		fips = "111";	
		break;
		case "San Miguel County":	
		fips = "113";	
		break;
		case "Sedgwick County":	
		fips = "115";	
		break;
		case "Summit County":	
		fips = "117";	
		break;
		case "Teller County":	
		fips = "119";	
		break;
		case "Washington County":	
		fips = "121";	
		break;
		case "Weld County":	
		fips = "123";	
		break;
		case "Yuma County":	
		fips = "125";	
		break;
		case "Colorado":	
		fips = "000";	
		break;
}
return fips;
};

//Join function from http://learnjsdata.com/combine_data.html

function join(lookupTable, mainTable, lookupKey, mainKey, select) {
    var l = lookupTable.length,
        m = mainTable.length,
        lookupIndex = [],
        output = [];
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
        output.push(select(y, x)); // select only the columns you need
    }
    return output;
};

//genData processes the data for the static chart
function genData(indata) {  

// Creating label array  
  var barLabels = [ { 'sector_id' : '00000', 'job_title' : 'Total Jobs'},
                    { 'sector_id' : '01000', 'job_title' : 'Agriculture'},
					{ 'sector_id' : '02000', 'job_title' : 'Mining'},
					{ 'sector_id' : '03000', 'job_title' : 'Utilities'},
					{ 'sector_id' : '04000', 'job_title' : 'Construction'},
					{ 'sector_id' : '05000', 'job_title' : 'Manufacturing'},
					{ 'sector_id' : '06000', 'job_title' : 'Wholesale Trade'},
					{ 'sector_id' : '07000', 'job_title' : 'Retail Trade'},
					{ 'sector_id' : '08000', 'job_title' : 'Transportation and Warehousing'},
					{ 'sector_id' : '09000', 'job_title' : 'Information'},
					{ 'sector_id' : '100000', 'job_title' : 'Financial Activities'},
					{ 'sector_id' : '10150', 'job_title' : 'Real Estate'},
					{ 'sector_id' : '11000', 'job_title' : 'Professional and Technical Services'},
					{ 'sector_id' : '11025', 'job_title' : 'Management of Companies '},
					{ 'sector_id' : '11050', 'job_title' : 'Administration and Waste'},
					{ 'sector_id' : '12000', 'job_title' : 'Private Education'},
					{ 'sector_id' : '12015', 'job_title' : 'Health Services'},
					{ 'sector_id' : '13000', 'job_title' : 'Arts, Entertainment & Recreation'},
					{ 'sector_id' : '13015', 'job_title' : 'Accommodation and Food'},
					{ 'sector_id' : '14000', 'job_title' : 'Other Services'},
					{ 'sector_id' : '15010', 'job_title' : 'Federal Government'},
					{ 'sector_id' : '15014', 'job_title' : 'Military'},
					{ 'sector_id' : '15020', 'job_title' : 'State Government'},
					{ 'sector_id' : '15030', 'job_title' : 'Local Government'}];
					
var barColors = [ {'category' : 'Low', 'bar_color' : '#D85F02'},
                  {'category' : 'Mid', 'bar_color' : '#757083'},
				  {'category' : 'High', 'bar_color' : '#1B9E77'}
				  ];
				  
//joining label array to data set
var outdata = join(barLabels,indata,"sector_id","sector_id",function(dat,col){
            return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: (col !== undefined) ? col.job_title : null,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   category : dat.category
			   };
			   }).filter(function(d) {return d.job_title != null;})
			     .filter(function(d) {return d.total_jobs > 0;})
				 .filter(function(d) {return d.sector_id != "00000";});
				 
var outdata = join(barColors,outdata,"category","category", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: dat.job_title,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   category : dat.category,
			   bar_color: (col !== undefined) ? col.bar_color : null  
			   };
			   }).filter(function(d) {return d.job_title != null;})
			     .filter(function(d) {return d.total_jobs > 0;});

//  sorting data in descending order

outdata.sort(function(a, b){ return d3.descending(+a['total_jobs'], +b['total_jobs']); })

return outdata;
}; //end of genData

//genPCTData calculates percentage from processed data...
function genPCTData(indata,jobsdata){

var jobsN = +jobsdata[0].sum_jobs;
for(i = 0; i < indata.length; i++) {
   indata[i]["pct_jobs"] = indata[i].total_jobs/jobsN;
   };
return indata;
};  //end of genPCTData

//diffData calculates differences between two data sets
function diffData(data1, data2) {

  var outData = join(data1,data2,"sector_id","sector_id", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: (dat != undefined) ? dat.county : col.county,
			   job_title: (dat != undefined) ? dat.job_title : col.job_title,
			   population_year1: (col != undefined) ? col.population_year : 0,
			   population_year2: (dat != undefined) ? dat.population_year : 0,
			   total_jobs1 : (col != undefined) ? col.total_jobs : 0,
			   total_jobs2 : (dat != undefined) ? dat.total_jobs : 0,
			   category : (dat != undefined) ? dat.category : col.category,
			   bar_color: (dat != undefined) ? dat.bar_color : col.bar_color
			   };
			   
			   
});

outData.forEach(function(d) { d.diffJobs = Number(d.total_jobs2) - Number(d.total_jobs1)});


outData.sort(function(a, b){ return d3.descending(+a['diffJobs'], +b['diffJobs']); })

return(outData);
};



//DATA AND IMAGE DOWNLOAD FUNCTIONS
function dataDownload(datain, chartType){

    var formatComma = d3.format(",");
	
	var seldCTY = d3.select('#selCty option:checked').text();
	var seldFIPS = switchFIPS(seldCTY);
	
if(chartType == 0){ //Count Data
	var seldYEAR = eval(d3.select("#selYear").property('value'));
	 if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
    };
	var fileName = "Jobs by Sector Counts " + seldCTY + " " + seldYEAR + ".csv";
	
		var datafiltered = datain.filter(function(d) {
		 if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
	 })
	var dataOut = genData(datafiltered);
	
		dataOut.forEach(function(e){
      if (typeof e === "object" ){
          e["county_name"] = seldCTY;
    }
   });
   var dataOut2 = dataOut.map(item => ({
		fips_code : item.area_code,
		county: item.county_name,
		job_category : item.job_title,
		year: item.population_year,
		jobs: formatComma(Math.round(item.total_jobs))}));
     };
	 
if(chartType == 1){ //Percentage Data
    updatePCTChart(datain,1); //This 1 value will trigger the download...
}; 

if(chartType == 2) {
		var begYEAR = eval(d3.select("#begYear").property('value'));
        var endYEAR = eval(d3.select("#endYear").property('value'));
		if(seldCTY == "Broomfield County" && begYEAR < 2010){
	        begYEAR = 2010;
			document.getElementById("begYear").value = 2010;
        };
        var fileName = "Jobs by Sector Differences " + seldCTY + " " + begYEAR + " to " + endYEAR + ".csv";

	var dataYr1 = datain.filter(function(d) {
                 if( d.population_year == begYEAR && d.area_code == seldFIPS) { return d; }
             });
    var dataYr2 = datain.filter(function(d) {
                 if( d.population_year == endYEAR && d.area_code == seldFIPS) { return d; }
             });
	var outData1 = genData(dataYr1);
	var outData2 = genData(dataYr2);  
	var dataOut = diffData(outData1,outData2);
	
 	dataOut.forEach(function(e){
      if (typeof e === "object" ){
          e["county_name"] = seldCTY;
    }
   });

      var dataOut2 = dataOut.map(item => ({
		fips_code : item.area_code,
		county: item.county_name,
		job_category : item.job_title,
		year_1: item.population_year1,
		jobs_year_1: formatComma(Math.round(item.total_jobs1)),
		year_2: item.population_year2,
		jobs_year_2: formatComma(Math.round(item.total_jobs2)),
	    difference : Math.round(item.diffJobs)}));
    }; 
	
	exportToCsv(fileName, dataOut2);

}; //end of dataDownload


function pctDownload(dataOut) {  //A special workaround for to download the PCT data  ugh

     var formatPercent = d3.format(".1%")
	 var formatComma = d3.format(",");

	 var seldCTY = d3.select('#selCty option:checked').text();
	 var seldFIPS = switchFIPS(seldCTY);
	 var seldYEAR = eval(d3.select("#selYear").property('value'));
	 if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	    seldYEAR = 2010;
		document.getElementById("selYear").value = 2010;
     };
	var fileName = "Jobs by Sector Percentage " + seldCTY + " " + seldYEAR + ".csv";
   
   
 
 	dataOut.forEach(function(e){
      if (typeof e === "object" ){
          e["county_name"] = seldCTY;
    }
   });

      var dataOut2 = dataOut.map(item => ({
		fips_code : item.area_code,
		county: item.county_name,
		job_category : item.job_title,
		year: item.population_year,
		jobs: formatComma(Math.round(item.total_jobs)),
		percentage : formatPercent(item.pct_jobs)}));
     
	exportToCsv(fileName, dataOut2);
}; //pctDownload


function exportToCsv(filename, rows) {
        var csvFile = d3.csvFormat(rows);

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    };

function imageDownload(outFileName) {
      // Retrieve svg node
	  const svg = d3.select("svg");
      const svgNode = svg.node();

        // Get image quality index (basically,  index you can zoom in)
        const quality = 3;
        // Create image
        const image = new Image();
        image.onload = () => {
	   // Create image canvas
          const canvas = document.createElement('canvas');
          // Set width and height based on SVG node
          const rect = svgNode.getBoundingClientRect();
          canvas.width = rect.width * quality;
          canvas.height = rect.height * quality;

          // Draw background
          const context = canvas.getContext('2d');
          context.fillStyle = '#FAFAFA';
          context.fillRect(0, 0, rect.width * quality, rect.height * quality);
          context.drawImage(image, 0, 0, rect.width * quality, rect.height * quality);

          // Set some image metadata
          let dt = canvas.toDataURL('image/png');

          // Invoke saving function
          saveAs(dt, outFileName);

        };


        var url = 'data:image/svg+xml; charset=utf8, ' + encodeURIComponent(serializeString(svgNode));

        image.src = url// URL.createObjectURL(blob);
      

      // This function invokes save window
      function saveAs(uri, filename) {
	  
        // create link
        var link = document.createElement('a');
        if (typeof link.download === 'string') {
          document.body.appendChild(link); // Firefox requires the link to be in the body
          link.download = filename;
          link.href = uri;
          link.click();
          document.body.removeChild(link); // remove the link when done
        } else {
          location.replace(uri);
        }
      }

      // This function serializes SVG and sets all necessary attributes
      function serializeString(svg) {
	 
        const xmlns = 'http://www.w3.org/2000/xmlns/';
        const xlinkns = 'http://www.w3.org/1999/xlink';
        const svgns = 'http://www.w3.org/2000/svg';
        svg = svg.cloneNode(true);
        const fragment = window.location.href + '#';
        const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT, null, false);
        while (walker.nextNode()) {
          for (const attr of walker.currentNode.attributes) {
            if (attr.value.includes(fragment)) {
              attr.value = attr.value.replace(fragment, '#');
            }
          }
        }
        svg.setAttributeNS(xmlns, 'xmlns', svgns);
        svg.setAttributeNS(xmlns, 'xmlns:xlink', xlinkns);
        const serializer = new XMLSerializer();
        const string = serializer.serializeToString(svg);
        return string;
      }
    };


//CHART FUNCTIONS
//initialChart reads information from the dropdowns, updates the title block and calls genCountChart to produce the initial static chart
function initialChart(datain) {  

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'))

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
	    //Generate bar chart
  var datafiltered = datain.filter(function(d) {
                 if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
             })
  var  outData = genData(datafiltered);
//Reading the range data, the tabular data...

d3.csv("./data/wage_summ.csv").then(function(rngdata){ 

  var  tabData = rngdata.filter(function(d) {
                     if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
                 });

  genCountChart(outData,tabData,seldCTY,seldYEAR);
  				 });  //d3.csv
}; // initialChart

//updateCountChart reads information from the dropdowns, updates the title block and generates the updated static chart
function updateCountChart(datain) {

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'));

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
// Removes the chart

var graph = d3.select("svg").remove();
	    //Generate bar chart
 var datafiltered = datain.filter(function(d) {
                 if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
             });
  var  outData = genData(datafiltered);
  
  d3.csv("./data/wage_summ.csv").then(function(rngdata){ 

  var  tabData = rngdata.filter(function(d) {
                     if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
                 });

  genCountChart(outData,tabData,seldCTY,seldYEAR);
  				 });  //d3.csv
 
}; //updateCountChart

//updatePCTChart reads information from the dropdowns, updates the title block and generates the updated percentage chart
//type = 1 triggers the download function
function updatePCTChart(datain,type) {

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'));

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
// Removes the chart
if(type == 0) {
var graph = d3.select("svg").remove();
};
	    //Generate bar chart
 var datafiltered = datain.filter(function(d) {
                 if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
             });
  var  outData = genData(datafiltered);
  
  d3.csv("./data/wage_summ.csv").then(function(rngdata){ 

  var  tabData = rngdata.filter(function(d) {
                     if( d.population_year == seldYEAR && d.area_code == seldFIPS) { return d; }
                 });
  pctData = genPCTData(outData,tabData);
 if(type == 0){
	 genPCTChart(pctData,tabData,seldCTY,seldYEAR);
 } else {
	pctDownload(pctData);
 };
  				 });  //d3.csv
 
}; //updatePCTChart

//updateCustomChart reads information from the dropdowns, updates the title block and generates the updated percentage chart
function updateCustomChart(datain) {

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var begYEAR = eval(d3.select("#begYear").property('value'));
var endYEAR = eval(d3.select("#endYear").property('value'));

if(seldCTY == "Broomfield County" && begYEAR < 2010){
	begYEAR = 2010;
	document.getElementById("begYear").value = 2010;
};
// Removes the chart

var graph = d3.select("svg").remove();
//Generate bar chart

var dataYr1 = datain.filter(function(d) {
                 if( d.population_year == begYEAR && d.area_code == seldFIPS) { return d; }
             });
var dataYr2 = datain.filter(function(d) {
                 if( d.population_year == endYEAR && d.area_code == seldFIPS) { return d; }
             });
var outData1 = genData(dataYr1);
var outData2 = genData(dataYr2);  
var dataDiff = diffData(outData1,outData2);

//Calculating difference in Total Jobs
var totalYr1 = datain.filter(function(d) {
                 if( d.population_year == begYEAR && d.area_code == seldFIPS && d.sector_id == "00000") { return d; }
             });
var totalYr2 = datain.filter(function(d) {
                 if( d.population_year == endYEAR && d.area_code == seldFIPS && d.sector_id == "00000") { return d; }
             });

var totalChng = Number(totalYr2[0].total_jobs) - Number(totalYr1[0].total_jobs);

genCustomChart(dataDiff,totalChng,seldCTY,begYEAR,endYEAR);

 
}; //updateCustomChart

//genCountChart produces the Total Jobs chart
function genCountChart(outdata,tabdata,CTY,YEAR){ 

//Comma format
var formatComma = d3.format(",");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Date Format
var formatDate = d3.timeFormat("%m/%d/%Y");
//Percentage Format
var formatPercent = d3.format(".1%")
//defining the SVG  
 margin = ({top: 20, right: 210, bottom: 40, left: 40})

    var width = 900,
	height = 600,
    barHeight = 8,
	barSpace = 4,
	axisShift = 130;
	

var yLen = (barHeight + barSpace) * (outdata.length);

var maxVal = d3.max(outdata, function(d) { return +d.total_jobs;} );

var x_axis = d3.scaleLinear()
                   .domain([0, maxVal])
				   .range([0,(width - margin.right)]);

var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

  var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [0, 0, width, height]);

//Title
var titStr = "Jobs by Sector: " + CTY +", "+ YEAR;
graph.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16px sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);

var bar = graph.selectAll("g")
                  .data(outdata)
                  .enter()
                  .append("g")
                  .attr("transform", `translate(${margin.left + axisShift},50)`);

bar.append("rect")
       .attr("y", function(d) { return y_axis(d.job_title); })
       .attr("width", function(d) { return x_axis(+d.total_jobs); })
       .attr("height", barHeight)
	   .style("fill", function(d) { return d.bar_color});

bar.append("text")
       .attr("x", function(d) { return x_axis(+d.total_jobs) + 3; })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatComma(Math.round(d.total_jobs)); })
	   .style("fill","black")
	   .style("font", "9px sans-serif");

//X- axis
graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${margin.left + axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatComma));

//Y-axis
graph.append("g")
      .attr("class","Y-Axis")
      .attr("transform", `translate(${margin.left + axisShift},50)`)
      .call(d3.axisLeft(y_axis));
	  

//caption
var caption = "Source:  State Demography Office, Print Date: "+ formatDate(new Date);
graph.append("text")
        .attr("x", 165)             
        .attr("y", yLen + 100)
        .attr("text-anchor", "right")  
        .style("font", "9px sans-serif")   
        .text(caption);

//Table

var pos = x_axis(0);
var tabArray = jobsHdr(tabdata,YEAR,yLen,barSpace,barHeight,0,pos, 0);

if(pos > 400) {
   var rectanchorX = width * .20;
} else {
    var rectanchorX = width * .75;
}; 

var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  barHeight)
    .attr("height", barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 10;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9px sans-serif");
	
return graph.node();
 
};  //end of genCountChart

//genPCTChart produces the Total Jobs chart
function genPCTChart(outdata,tabdata,CTY,YEAR){ 

//Comma format
var formatComma = d3.format(",");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Date Format
var formatDate = d3.timeFormat("%m/%d/%Y");
//Percentage Format
var formatPercent = d3.format(".1%")
//defining the SVG  
 margin = ({top: 20, right: 210, bottom: 40, left: 40})

    var width = 900,
	height = 600,
    barHeight = 8,
	barSpace = 4,
	axisShift = 130;
	

var yLen = (barHeight + barSpace) * (outdata.length);

var maxVal = d3.max(outdata, function(d) { return +d.pct_jobs;} );

var x_axis = d3.scaleLinear()
                   .domain([0,maxVal])
				   .range([0,(width - margin.right)]);


var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

  var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [0, 0, width, height]);

//Title
var titStr = "Jobs by Sector, Percentage: " + CTY +", "+ YEAR;
graph.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16px sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);

var bar = graph.selectAll("g")
                  .data(outdata)
                  .enter()
                  .append("g")
                  .attr("transform", `translate(${margin.left + axisShift},50)`);

bar.append("rect")
       .attr("y", function(d) { return y_axis(d.job_title); })
       .attr("width", function(d) { return x_axis(+d.pct_jobs); })
       .attr("height", barHeight)
	   .style("fill", function(d) { return d.bar_color});

bar.append("text")
       .attr("x", function(d) { return x_axis(+d.pct_jobs); })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatPercent(+d.pct_jobs); })
	   .style("fill","black")
	   .style("font", "9px sans-serif");

//X- axis
graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${margin.left + axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatPercent));

//Y-axis
graph.append("g")
      .attr("class","Y-Axis")
      .attr("transform", `translate(${margin.left + axisShift},50)`)
      .call(d3.axisLeft(y_axis));
	  

//caption
var caption = "Source:  State Demography Office, Print Date: "+ formatDate(new Date);
graph.append("text")
        .attr("x", 165)             
        .attr("y", yLen + 100)
        .attr("text-anchor", "right")  
        .style("font", "9px sans-serif")   
        .text(caption);

//Table
var pos = x_axis(0);
var tabArray = jobsHdr(tabdata,YEAR,yLen,barSpace,barHeight,0,pos, 0);

if(pos > 400) {
   var rectanchorX = width * .20;
} else {
    var rectanchorX = width * .75;
}; 

var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  barHeight)
    .attr("height", barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 10;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9px sans-serif");
	
return graph.node();
 
};  //end of genPCTChart

//genCustomChart produces the Difference Chart
function genCustomChart(outdata,totalDiff,CTY,YEAR1,YEAR2){ 


//Comma format
var formatComma = d3.format(",");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Date Format
var formatDate = d3.timeFormat("%m/%d/%Y");
//Percentage Format
var formatPercent = d3.format(".1%")
//defining the SVG  
 margin = ({top: 20, right: 210, bottom: 40, left: 40})

    var width = 900,
	height = 600,
    barHeight = 8,
	barSpace = 4,
	axisShift = 130;
	

var cfg = {
      labelMargin: 5,
      xAxisMargin: 10,
      legendRightMargin: 0
    }
var yLen = (barHeight + barSpace) * (outdata.length);

var scaleVal = extendAxis(d3.extent(outdata, function(d) {return d.diffJobs;}));

var x_axis = d3.scaleLinear()
                   .domain([scaleVal[0], scaleVal[1]])
				   .range([0,(width - margin.right)]);

var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [0, 0, width, height]);
if(YEAR1 == YEAR2) {
	var titStr = "The selected year values are equal.  Please adjust the 'Start Year' or 'End Year' values.";
	graph.append("text")
			.attr("x", (width / 2))             
			.attr("y", margin.top + 10 )
			.attr("text-anchor", "middle")  
			.style("font", "16px sans-serif") 
			.style("text-decoration", "underline")  
			.text(titStr);
} else if(+YEAR1 > +YEAR2) {
	var titStr = "The 'Start Year' value is greater than the 'End Year' value.  Please adjust the 'Start Year' or 'End Year' values.";
	graph.append("text")
			.attr("x", (width / 2))             
			.attr("y", margin.top + 10 )
			.attr("text-anchor", "middle")  
			.style("font", "16px sans-serif") 
			.style("text-decoration", "underline")  
			.text(titStr);
} else {
//Title
var titStr = "Employment Change by Sector. " + CTY +" "+ YEAR1 +" to "+ YEAR2;
graph.append("text")
        .attr("x", (width / 2))             
        .attr("y", margin.top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16px sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);
//Y Axis
     var yAxis = graph.append("g")
      	.attr("class", "y-axis")
      	.attr("transform", "translate(" + x_axis(0) + ",0)")
      	.append("line")
          .attr("y1", 0)
          .attr("y2", height);

//X Axis
    graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${margin.left + axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatComma));
      
//Bars
      var bars = graph.append("g")
      	.attr("class", "bars")
		.attr("transform", `translate(${margin.left + axisShift},50)`);
      
      bars.selectAll("rect")
      	.data(outdata)
        .enter()
	    .append("rect")
      	.attr("class", "annual-growth")
      	.attr("x", function(d) {
       		return x_axis(Math.min(0, d.diffJobs));
      	})
      	.attr("y", function(d) { return y_axis(d.job_title); })
      	.attr("height", barHeight)
      	.attr("width", function(d) { 
        	return Math.abs(x_axis(d.diffJobs) - x_axis(0))
      	})
      	.style("fill", function(d) { return d.bar_color;});
      	
      
	  bars.selectAll("text")
	   .data(outdata)
	   .enter()
	   .append("text")
       .attr("x", function(d) { return d.diffJobs < 0 ? x_axis(+d.diffJobs) - 40 : x_axis(+d.diffJobs) + 10; })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatComma(Math.round(d.diffJobs)); })
	   .style("fill","black")
	   .style("font", "9px sans-serif");
	  
	  //Axis Labels
      var labels = graph.append("g")
      	.attr("class", "labels")
		.attr("transform", `translate(${margin.left + axisShift},45)`);;
      
      labels.selectAll("text")
      	.data(outdata)
      .enter().append("text")
      	.attr("class", "bar-label")
      	.attr("x", x_axis(0))
      	.attr("y", function(d) { return y_axis(d.job_title )})
      	.attr("dx", function(d) {
        	return d.diffJobs < 0 ? cfg.labelMargin : -cfg.labelMargin;
      	})
      	.attr("dy", y_axis.bandwidth())
      	.attr("text-anchor", function(d) {
        	return d.diffJobs < 0 ? "start" : "end";
      	})
      	.text(function(d) { return d.job_title; })
      	.style("fill", "black")
		.style("font", "9px sans-serif");

//caption
var caption = "Source:  State Demography Office, Print Date: "+ formatDate(new Date);
graph.append("text")
        .attr("x", 165)             
        .attr("y", yLen + 100)
        .attr("text-anchor", "right")  
        .style("font", "9px sans-serif")   
        .text(caption);



//Table, not really...

var tabtxt = formatComma(rndJobs(totalDiff)) + " Total Employment Change";
var tabdata = [ {"color" : "#FFFFFF","text" : tabtxt},
			{"color" : '#D85F02',"text" : "Less than 80% of Average Weekly Wage"},
			{"color" : '#757083', "text" : "Between 81% to 120% of Average Weekly Wage"},
			{"color" : '#1B9E77', "text" : "Greater than 120% of Average Weekly Wage"}];

var pos = x_axis(0);
var tabArray = jobsHdr(tabdata,0,yLen,barSpace,barHeight,totalDiff,pos, 1);

if(pos > 400) {
   var rectanchorX = width * .20;
} else {
    var rectanchorX = width * .75;
}; 


var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  barHeight)
    .attr("height", barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 10;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9px sans-serif");
	
} //Error Message
return graph.node();
 
};  //end of genCustomChart
 