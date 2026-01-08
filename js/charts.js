//Jobs by Sector main functions
//UTILITY FUNCTIONS

//WEBSITE DOM FUNCTIONS
function hideDD() { //Hides the Diff Dropdowns
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

// removeDups from https://stackoverflow.com/questions/40166958/removing-duplicate-edges-from-an-array-for-a-d3-force-directed-graph
function removeDups(myArray){

	var outArray = [];
    myArray.sort(function(a, b){ return d3.ascending(a['job_title'], b['job_title']); })

    for(var i = 1; i < myArray.length; ){
        if(myArray[i-1].job_title != myArray[i].job_title){
            outArray = outArray.concat(myArray[i-1]);
            }
		i++;
        }
	outArray = outArray.concat(myArray[myArray.length-1]);
    return outArray;
    }  



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

//captionTxt specifies the chart caption
function captionTxt(suppress, supp_pct, posY) {

	//Date Format
   var formatDate = d3.timeFormat("%m/%d/%Y");
   var formatPercent = d3.format(".1%")
   
   var dateStr = "Visualization by the State Demography Office, Print Date: "+ formatDate(new Date);

   if(suppress.length <= 2){
   
   var capTxt = [
		          {"captxt" : "Data Source:  State Demography Office and Bureau of Labor Statistics",  "ypos" :posY},
				  {"captxt": "Vintage 2024 Estimates.","ypos" :posY + 15},  //Update this line as the production date changes
				  {"captxt" : dateStr,  "ypos" : posY + 30}
				 ];
   } else {
//Output suppression lists

   var capTxthead = [
                  {"captxt" : "Job sector data is suppressed according to Bureau of Labor Statistics standards.", "ypos" : posY},
				  {"captxt" : "Percent Jobs Suppressed: "+ formatPercent(supp_pct), "ypos" : posY + 15},
				  {"captxt" : "Suppressed Job Sectors:", "ypos" : posY + 30}]
var supList = [];
var N1 = "captxt";
var N2 = "ypos";
for(row = 0; row < suppress.length; row++){
    var obj = {};
	var yp = posY + 45 + eval(row * 15);
	var ctxt = suppress[row].job_title;
	obj[N1] = ctxt;
	obj[N2] = yp;
	supList.push(obj);
};
  

   var capTxttail = [
		          {"captxt" : "Data Source:  State Demography Office and Bureau of Labor Statistics.",  "ypos" : yp + 35},    
				  {"captxt": "Vintage 2024 Estimates.","ypos" : yp + 50},  //Update this line as the production date changes
				  {"captxt" : dateStr,  "ypos" : yp + 65}
				 ];
var capTxt = capTxthead.concat(supList).concat(capTxttail);
   };
   
return(capTxt);
};

//jobsHdr appends the jobs table objects into the svg 
function jobsHdr(tdata,yr,posLen,bSpace,bHeight,jobsD,xPos, type){

//Comma format
var formatComma = d3.format(",");
var formatDecimal = d3.format(".3");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Percentage Format
var formatPercent = d3.format(".1%")

var rectanchorY = posLen + 80;

if(type == 0){ //For the Count and Difference Tables
		var jobsN = +tdata[0].sum_jobs;
		var wageN = +tdata[0].total_wage;
		var jobsRnd = Math.round(jobsN);
		//Scale jobsRnd
		if(jobsRnd > 1000000){
		   var jobVal = formatDecimal(jobsRnd/1000000);
		   var jobStr = jobVal + " Million Total Estimated Jobs";
        } else {
		   var jobStr = formatComma(jobsRnd) + " Total Estimated Jobs";
        };
		
		
        var wageStr = formatDollar(wageN) + " Average Annual Wage";
        var yrStr = yr + " Employment Share by Wage";

	var outArr = [{"color" : "#FFFFFF","text" : jobStr, "ypos" : rectanchorY + (bSpace + bHeight + 1)},
		          {"color" : "#FFFFFF","text" : wageStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) + 15)},
				  {"color" : "#FFFFFF","text" : yrStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) + 30)}];
				  
    for(i = 0; i < tdata.length; i++) {
		//Modification for new labels 12/2023
		// var tabStr = "(" + formatDollar(tdata[i].min_wage) + " - " + formatDollar(tdata[i].max_wage) + ") " + formatPercent(tdata[i].pct_jobs);
		var tabStr = tdata[i].label ;
		if(tdata[i].category == 'Low'){
			outArr.push({"color" : "#5BB5FF", "text" : " Low Wage Jobs: " +tabStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) + 60)});
		};
		if(tdata[i].category == 'Mid'){
			outArr.push({"color" : "#007ADE", "text" : " Mid Wage Jobs: " + tabStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) + 75)});
		};
		if(tdata[i].category == 'High'){
			outArr.push({"color" : "#001970", "text" : " High Wage Jobs: " + tabStr, "ypos" : rectanchorY + ((bSpace + bHeight + 1) + 90)});
		};
	} //i
     } else {
//round jobs value and output string
var tabtxt = formatComma(Math.round(jobsD)) + " Total Employment Change";
var outArr = [ {"color" : "#FFFFFF","text" : tabtxt, "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 1)},
			   {"color" : '#5BB5FF',"text" : "Less than 80% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 2)},
			   {"color" : '#007ADE', "text" : "Between 81% to 120% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 3)},
			   {"color" : '#001970', "text" : "Greater than 120% of Average Weekly Wage", "ypos" : rectanchorY + ((bSpace + bHeight + 1) * 4)}];
 } //if

return outArr;
};  //end of jobsHdr


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
    var l = lookupTable.length;
    var m = mainTable.length;
    var lookupIndex = [];
    var output = [];
	
    for (var i = 0; i < l; i++) { // loop through l items
        var row = lookupTable[i];
        lookupIndex[row[lookupKey]] = row; // create an index for lookup table
    }
    for (var j = 0; j < m; j++) { // loop through m items
        var y = mainTable[j];
        var x = lookupIndex[y[mainKey]]; // get corresponding row from lookupTable
		if(typeof x === 'undefined') {
			var x= [];
			x.push({"area_code" : y.area_code,
		"sector_id" : y.sector_id,
		"population_year" : y.population_year,
		"total_jobs" : 0})
		}
        output.push(select(y, x)); // select only the columns you need
    }
	
    return output;
};

//buildData creates the basic data set
function buildData(jData,wData){

	jData.sort(function(a, b){ return d3.ascending(+a['sector_id'], +b['sector_id']); })
	wData.sort(function(a, b){ return d3.ascending(+a['sector_id'], +b['sector_id']); })

var outData = join(jData,wData,"sector_id","sector_id",function(dat,col){
		return{
			area_code : col.area_code,
			sector_id : col.sector_id,
			population_year : col.population_year,
			total_jobs : col.total_jobs,
			avg_wage : (dat.avg_wage !== undefined) ? dat.avg_wage : 0,
			category : (dat.category !== undefined) ? dat.category : ""
		};
	});
	
	

var outData2 = outData.filter(function(d) {return d.area_code !== undefined;});

return(outData2);
} //End buildData

//genData processes the data for the static chart
function genData(indata, TYPE) {  

//Look at this file.  If it has wages, then need to suppress when wages are missing...
// Creating label array  
  var barLabels = [ {'sector_id': '00000', 'job_title': 'Total All Sectors'},
					{'sector_id': '00001', 'job_title': 'Federal Government'},
					{'sector_id': '00002', 'job_title': 'State Government'},
					{'sector_id': '00003', 'job_title': 'Local Government'},
					{'sector_id': '00011', 'job_title': 'Agriculture, Forestry, Fishing and Hunting'},
					{'sector_id': '00021', 'job_title': 'Mining'},
					{'sector_id': '00022', 'job_title': 'Utilities'},
					{'sector_id': '00023', 'job_title': 'Construction'},
					{'sector_id': '00042', 'job_title': 'Wholesale Trade'},
					{'sector_id': '00051', 'job_title': 'Information'},
					{'sector_id': '00052', 'job_title': 'Finance and Insurance'},
					{'sector_id': '00053', 'job_title': 'Real Estate and Rental and Leasing'},
					{'sector_id': '00054', 'job_title': 'Professional, Scientific, and Technical Services'},
					{'sector_id': '00055', 'job_title': 'Management of Companies and Enterprises'},
					{'sector_id': '00056', 'job_title': 'Admin. and Waste Management Services'},
					{'sector_id': '00061', 'job_title': 'Educational Services'},
					{'sector_id': '00062', 'job_title': 'Health Care and Social Assistance'},
					{'sector_id': '00071', 'job_title': 'Arts, Entertainment, and Recreation'},
					{'sector_id': '00072', 'job_title': 'Accommodation and Food Services'},
					{'sector_id': '00081', 'job_title': 'Other Services (except Public Administration)'},
					{'sector_id': '00099', 'job_title': 'Unclassified'},
					{'sector_id': '03133', 'job_title': 'Manufacturing'},
					{'sector_id': '04445', 'job_title': 'Retail Trade'},
					{'sector_id': '04849', 'job_title': 'Transportation and Warehousing'}];
					
var barColors = [ {'category' : 'Low', 'bar_color' : '#5BB5FF'},
                  {'category' : 'Mid', 'bar_color' : '#007ADE'},
				  {'category' : 'High', 'bar_color' : '#001970'}
				  ];
				  
	
				  
//joining label array to data set
var outdata = join(barLabels,indata,"sector_id","sector_id",function(dat,col){
            return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: (col !== undefined) ? col.job_title : dat.job_title,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   avg_wage : dat.avg_wage,
			   category : dat.category
			   };
               });
			   
			   
//Creating suppressed dataset

var suppr1 = outdata.filter(function(d) {return d.job_title != null;});
var suppr2 = suppr1.filter(function(d) {return d.total_jobs == 0});
var suppr3 = suppr1.filter(function(d) {return d.avg_wage == null || d.avg_wage == 0;});
					  
var suppressed = removeDups(suppr2.concat(suppr3));


//Modifying cutdata for final processing
if(suppressed.length > 1){
var  difference = outdata.filter(x => !suppressed.includes(x));
var  outdata = difference;
}

//TYPE == 0 is for chart output, removes the total jobs row
if(TYPE == 0){
	var outdata = outdata.filter(function(d) {return d.sector_id != "00000";});
};
				 
var outdata = join(barColors,outdata,"category","category", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: dat.county,
			   job_title: dat.job_title,
			   population_year: dat.population_year,
			   total_jobs: dat.total_jobs,
			   avg_wage : dat.avg_wage,
			   category : dat.category,
			   bar_color: (col !== undefined) ? col.bar_color : null  
			   };
			   }).filter(function(d) {return d.job_title != null;})
			     .filter(function(d) {return d.total_jobs > 0;});

//  sorting data in descending order

outdata.sort(function(a, b){ return d3.descending(+a['total_jobs'], +b['total_jobs']); })

return [outdata, suppressed];
}; //end of genData

//createAdjData calculates percentage from processed data...
function createAdjData(jobsdata){
var chartData3 = jobsdata.filter(function(d) {return d.sector_id != "00000";});
var adjJobs = d3.rollup(chartData3, v => d3.sum(v, d => d.total_jobs));
return(adjJobs);
};  //end of createAdjData

//unmatchedArray adds missing records prior to calculating the differences
var unmatchedArray = function(obj1,obj2) {
  var fips = obj2[0].area_code;
    var yr = obj2[0].population_year;
  var unmatched = [];
  for(i = 0; i < obj1.length; i++){
	    var match = false;
	    for(j = 0; j < obj2.length; j++){
			if(obj1[i].sector_id == obj2[j].sector_id){
				 match = true;
			}
		};  //j loop
		if(match == false){
		 unmatched.push({"area_code" : fips, "sector_id": obj1[i].sector_id, "county" : "", "job_title" : "MISSING", "population_year" : yr, "total_jobs" : "0", "category" : "MISSING", "bar_color" : "MISSING"})
		}; //match
       };  //i loop

//Concatenating arrays

outArray = obj2.concat(unmatched);
outArray.sort(function(a, b){ return d3.ascending(+a['sector_id'], +b['sector_id']); })
return outArray;
}  //end of unmatchedArray

//fixMISS Resolves the missing values in the dataset
function fixMISS(elem1,elem2) {
	 if(elem1 == "MISSING" && elem2 !== "MISSING"){
	            var elemOut = elem2;
               } else if(elem1 !== "MISSING" && elem2 == "MISSING") {
				var elemOut = elem1;
		    	} else {
				var elemOut = elem1;
				};
return elemOut;
}; //end of fixMISS

//fixCODE removes the dash from sector_id codes
function fixCODE(incode) {
	var outcode = incode.replace("-","")
	return(outcode)
}; //end of fixCODE


//CHART DATA FUNCTIONS
//genChartPromise Creates execures promises and created charts
function genChartPromise(FIPS,YEAR,CTY, dimChart){

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");

var numFIPS = +FIPS;

/* Data Notes
the inputs for jobsdataStr (area_code and sector_id = non-zero-filled number string)
All others are zero-filled number string
The Postgres tables have to have these data specifications.
*/
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + YEAR;
var boundaryStr = "https://gis.dola.colorado.gov/lookups/wage_bound?county=" + FIPS + "&year=" + YEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + YEAR;


var prom = [d3.json(jobsdataStr),d3.json(wagedataStr),d3.json(boundaryStr)];


Promise.all(prom).then(function(data){

      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == '10' ? zero5(fixCODE('0')): zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });

	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 


	  var chartData = buildData(data[0],data[1]); //These two function calls create the data set that will be charted

	  var chartData2 = genData(chartData,0);
	  
	   var adjJobs = createAdjData(chartData2[0]);

	  var totJobsarr = chartData.filter(function(d) {return d.sector_id == "00000";});
	  var totJobs = totJobsarr.map(function(d) {return d.total_jobs;})
	  var supJobsPCT = (totJobs - adjJobs)/totJobs;

//Fixing Total Jobs...
data[2].forEach(d => {d.sum_jobs = +totJobs})


	  genCountChart(chartData2[0],chartData2[1],supJobsPCT,data[2],CTY,YEAR,dimChart); //Generates a bar chart
     }).catch(function(error){
		 console.log("Process Error genChartPromise");
	 });
 };  //end genChartPromise
 
 //genDownloadCountPromise Creates execures promises and downloads data

function genDownloadCountPromise(FIPS,YEAR,CTY,FNAME){

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");
var formatComma = d3.format(",");
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };

var numFIPS = +FIPS;

var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + YEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + YEAR;

var prom = [d3.json(jobsdataStr),d3.json(wagedataStr)];


Promise.all(prom).then(function(data){
	 
      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == '10' ? zero5(fixCODE("0")) : zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });

	  	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 

	  var chartData = buildData(data[0],data[1]); //These two function calls create the data set that will be charted

      var chartData2 = genData(chartData,1);
	
	  var adjJobs = createAdjData(chartData2[0]);

	  var totJobsarr = chartData2[0].filter(function(d) {return d.sector_id == "00000";});
	  var totJobs = totJobsarr.map(function(d) {return d.total_jobs;})
	  var supJobs = totJobs - adjJobs;
	  
	  var adjData = {
		  	"fips_code" : FIPS,
		    "county": CTY,
		    "sector_id" : "00000.1",
		    "job_sector" : "Non-Suppressed Total Jobs",
		    "wage_category" : "",
		    "year": YEAR,
		    "wage" : "",
		    "jobs": formatComma(Math.round(adjJobs))};

	  var supData = {
		"fips_code" : FIPS,
		"county": CTY,
		"sector_id" : "00000.2",
		"job_sector" : "Total Suppressed Jobs",
		"wage_category" : "",
		"year": YEAR,
		"wage" : "",
		"jobs": formatComma(Math.round(supJobs))};
			
	
	  var dataOut = chartData2[0].map(item => ({
		fips_code : item.area_code,
		county: CTY,
		sector_id : item.sector_id,
		job_sector : item.job_title,
		wage_category : item.category,
		year: item.population_year,
		wage : formatDollar(item.avg_wage),
		jobs: formatComma(Math.round(item.total_jobs))}));
		
if(chartData2[1].length > 1){ //Has supressions
		var suppressed = chartData2[1].map(item => ({
		fips_code : item.area_code,
		county: CTY,
		sector_id : item.sector_id,
		job_sector : item.job_title,
		wage_category : item.category,
		year: item.population_year,
		wage : (item.avg_wage == null) ? "Suppressed" : formatDollar(item.avg_wage), 
		jobs: "Suppressed"}));
		
		var dataOut = dataOut.concat(adjData).concat(supData).concat(suppressed).sort((a, b) => d3.ascending(a.sector_id, b.sector_id));
} else{
	  var dataOut = dataOut.concat(adjData).concat(supData).sort((a, b) => d3.ascending(a.sector_id, b.sector_id));
      }
		exportToCsv(FNAME, dataOut);
     }).catch(function(error){
		 console.log("Process Error genDownloadCountPromise");
	 });
 };  //end genDownloadCountPromise


 
 //genPCTPromise Creates execures promises and created charts

function genPCTPromise(FIPS,YEAR,CTY,dimChart){
//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");

var numFIPS = +FIPS;
 
var boundaryStr = "https://gis.dola.colorado.gov/lookups/wage_bound?county=" + FIPS + "&year=" + YEAR;
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + YEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + YEAR;

var prom = [d3.json(jobsdataStr),d3.json(wagedataStr),d3.json(boundaryStr)];

Promise.all(prom).then(function(data){

      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == "10" ? zero5(fixCODE("0")) : zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });
	  
	  	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 
	 

	  var chartData = buildData(data[0],data[1]); //These two function calls create the data set that will be charted
      var chartData2 = genData(chartData,0);
	  var chartData3 = chartData2[0]

      var supr = chartData2[1]
	  // Calculating the adjusted base

      var adjJobs = createAdjData(chartData3);

	  var totJobsarr = data[0].filter(function(d) {return d.sector_id == "00000";});
	  var totJobs = totJobsarr.map(function(d) {return d.total_jobs})
	  var supJobsPCT = (totJobs - adjJobs)/totJobs;
	  
	  
	   chartData3.forEach(function(d){
		  d.pct_jobs = +d.total_jobs/+totJobs;
	  });

	  genPCTChart(chartData3,supr,supJobsPCT,data[2],CTY,YEAR,dimChart); //Generates a bar chart
     }).catch(function(error){
		 console.log("Process Error genPCTPromise");
	 });
 };  //end genPCTPromise

//genDownloadPCTPromise Creates execures promises and created charts

function genDownloadPCTPromise(FIPS,YEAR,CTY,FNAME){

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");
var formatComma = d3.format(",");
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
var formatPercent = d3.format(".1%");

var numFIPS = +FIPS;
 
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + YEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + YEAR;

var prom = [d3.json(jobsdataStr),d3.json(wagedataStr)];


Promise.all(prom).then(function(data){
      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == '10' ? zero5(fixCODE("0")) : zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });
	 
	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 
	 
	  var chartData = buildData(data[0],data[1]); //These two function calls create the data set that will be charted
      var chartData2 = genData(chartData,1);

	  var chartData3 = chartData2[0];
 
      var adjJobs = createAdjData(chartData3);
	  var totJobsarr = chartData2[0].filter(function(d) {return d.sector_id == "00000";});
	  var totJobs = totJobsarr.map(function(d) {return d.total_jobs})	  

	  var adjData = {
		"fips_code" : FIPS,
		"county": CTY,
		"sector_id" : "00000.1",
		"job_sector" : "Non-Suppressed Total Jobs",
		"wage_category" : "",
		"year": YEAR,
		"wage" : "",
		"jobs": formatComma(Math.round(adjJobs)),
		"percentage" : formatPercent(adjJobs/totJobs)
		};
		
	  var supData = {
		"fips_code" : FIPS,
		"county": CTY,
		"sector_id" : "00000.2",
		"job_sector" : "Total Suppressed Jobs",
		"wage_category" : "",
		"year": YEAR,
		"wage" : "",
		"jobs": formatComma(Math.round(totJobs - adjJobs)),
		"percentage" : formatPercent((totJobs - adjJobs)/totJobs)};
			

	  
	  chartData3.forEach(function(d){
		  d.pct_jobs = +d.total_jobs/totJobs;
	  });
	  
	  var dataOut = chartData3.map(item => ({
		fips_code : item.area_code,
		county: CTY,
		sector_id : item.sector_id,
		job_sector : item.job_title,
		wage_category : item.category,
		year: item.population_year,
		wage : formatDollar(item.avg_wage),
		jobs: formatComma(Math.round(item.total_jobs)),
		percentage : formatPercent(item.pct_jobs)}));
		
if(chartData2[1].length > 1){
	var suppressed = chartData2[1].map(item => ({
		fips_code : item.area_code,
		county: CTY,
		sector_id : item.sector_id,
		job_sector : item.job_title,
		wage_category : item.category,
		year: item.population_year,
		wage : formatDollar(item.avg_wage),
		jobs: "Suppressed",
		percentage : "Suppressed"}));
	
		var dataOut = dataOut.concat(adjData).concat(supData).concat(suppressed).sort((a, b) => d3.ascending(a.sector_id, b.sector_id));
       } else {
	    var dataOut = dataOut.concat(adjData).concat(supData).sort((a, b) => d3.ascending(a.sector_id, b.sector_id));
       }
		exportToCsv(FNAME, dataOut);
     }).catch(function(error){
		 console.log("Process Error genDownloadPCTPromise");
	 });
 };  //end genDownloadPCTPromise


//genDiffPromise Creates execures promises and created charts

function genDiffPromise(FIPS,bYEAR,eYEAR,CTY,dimChart){

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");

var numFIPS = +FIPS;
 
var boundaryStr = "https://gis.dola.colorado.gov/lookups/wage_bound?county=" + FIPS + "&year=" + bYEAR + "," + eYEAR;
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + bYEAR + "," + eYEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + bYEAR + "," + eYEAR;

var prom = [d3.json(jobsdataStr),d3.json(wagedataStr),d3.json(boundaryStr)];


Promise.all(prom).then(function(data){

      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == "10" ? zero5(fixCODE("0")) : zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });
	  
	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 

	  var jobsbYR = data[0].filter(function(d){return d.population_year == bYEAR});
	  var jobseYR = data[0].filter(function(d){return d.population_year == eYEAR});
      
	  var wagebYR = data[1].filter(function(d) {return d.population_year == bYEAR});
	  var wageeYR = data[1].filter(function(d) {return d.population_year == eYEAR});


	  var cDatabYR = buildData(jobsbYR,wagebYR); 
	  var cDataeYR = buildData(jobseYR,wageeYR);
	  
      var outDatabYR = genData(cDatabYR,0);
	  var outDataeYR = genData(cDataeYR,0);

      var dataDiff = diffData(outDatabYR[0],outDataeYR[0]);
	  var dataDiff = dataDiff.filter(function(d){return ((d.total_jobs1 != 0) && (d.total_jobs2 != 0))});

	  //Generate unique supressed categories  outDatabYR[1] and outDataeYR[1] are the supresssed categories
	  if(outDataeYR[1].length <= 1){
		 var fullSup = outDatabYR[1];
	  } else if(outDatabYR[1].length <= 1){
		  var fullSup = outDataeYR[1];
	  } else {
	     var fullSup = outDatabYR[1].concat(outDataeYR[1]);
	  }
	  if (fullSup.length > 2) {
		  var fullSup2 = fullSup.map(item => ({
					job_title : item.job_title
		  }));
		  var uniqueSup = removeDups(fullSup2);
	  } else {
		  var uniqueSup = fullSup;
	  }
     //Calculating difference in Total Jobs
     var totalChng = Math.round(cDataeYR[0].total_jobs) - Math.round(cDatabYR[0].total_jobs);

	  genDiffChart(dataDiff,uniqueSup,totalChng,CTY,bYEAR,eYEAR,dimChart); //Generates a bar chart
     }).catch(function(error){
		 console.log("Process Error genDiffPromise");
	 });
 };  //end genDiffPromise
 
 //genDownloadDiffPromise Creates execures promises and created charts

function genDownloadDiffPromise(FIPS,bYEAR,eYEAR,CTY,FNAME){

//Formats
var zero3 = d3.format("03d");
var zero5 = d3.format("05d");
var formatComma = d3.format(",");
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };

var numFIPS = +FIPS;

var boundaryStr = "https://gis.dola.colorado.gov/lookups/wage_bound?county=" + FIPS + "&year=" + bYEAR + "," + eYEAR;
var jobsdataStr = "https://gis.dola.colorado.gov/lookups/jobs?county=" + numFIPS + "&year=" + bYEAR + "," + eYEAR;
var wagedataStr = "https://gis.dola.colorado.gov/lookups/wage?county="+ FIPS + "&year=" + bYEAR + "," + eYEAR;

var prom = [d3.json(jobsdataStr),d3.json(wagedataStr),d3.json(boundaryStr)];


Promise.all(prom).then(function(data){

      data[0].forEach(function(d){
		  d.area_code = zero3(d.area_code);
		  d.sector_id = d.sector_id == '10' ? zero5(fixCODE("0")) : zero5(fixCODE(d.sector_id));
		  d.sector_name = d.sector_name;
		  d.population_year = d.population_year;
		  d.total_jobs = +d.total_jobs;
	  });
	 
	 data[1].forEach(function(d){
		 d.area_code = zero3(d.area_code);
		 d.sector_id = zero5(fixCODE(d.sector_id));
         d.avg_wage = +d.avg_wage;
		 d.population_year = d.population_year;
		 d.category = d.category;
		 d.wage_source = d.wage_source;
		 d.wage_source_override = d.wage_source_override
	 }) 

	  var jobsbYR = data[0].filter(function(d){return d.population_year == bYEAR});
	  var jobseYR = data[0].filter(function(d){return d.population_year == eYEAR});
      
	  var wagebYR = data[1].filter(function(d) {return d.population_year == bYEAR});
	  var wageeYR = data[1].filter(function(d) {return d.population_year == eYEAR});

	  var cDatabYR = buildData(jobsbYR,wagebYR); 
	  var cDataeYR = buildData(jobseYR,wageeYR);
	  
      var outDatabYR = genData(cDatabYR,1);
	  var outDataeYR = genData(cDataeYR,1);
	  

      var adjJobsbYR = createAdjData(outDatabYR[0]);
      var adjJobseYR = createAdjData(outDataeYR[0]);
	  
	  //total jobs
	  var totJobsarrb = jobsbYR.filter(function(d) {return d.sector_id == "00000";});
	  var totJobsbYR = totJobsarrb.map(function(d) {return d.total_jobs})
	  var supJobsPCTbYR = (totJobsbYR - adjJobsbYR)/totJobsbYR;
	  
	  var totJobsarre = jobseYR.filter(function(d) {return d.sector_id == "00000";});
	  var totJobseYR = totJobsarre.map(function(d) {return d.total_jobs})
	  var supJobsPCTeYR = (totJobseYR - adjJobseYR)/totJobseYR;

	  var adjDatabYR = {
		  	"area_code" : FIPS,
		    "sector_id" : "00000.1",
			"county" : CTY,
		    "job_title" : "Non-Suppressed Total Jobs",
		    "avg_wage" : "",
		    "population_year": bYEAR,
		    "total_jobs": adjJobsbYR,
			"category" : ""};

	  var adjDataeYR = {
		  	"area_code" : FIPS,
		    "sector_id" : "00000.1",
			"county" : CTY,
		    "job_title" : "Non-Suppressed Total Jobs",
		    "avg_wage" : "",
		    "population_year": eYEAR,
		    "total_jobs": adjJobseYR,
			"category" : ""};
			
	var adjDatabYR_sup = {
		"area_code" : FIPS,
		"sector_id" : "00000.2",
		"county" : CTY,
		"job_title" : "Suppressed Total Jobs",
		"avg_wage" : "",
		"population_year": bYEAR,
		"total_jobs": totJobsbYR - adjJobsbYR,
		"category" : ""};

	  var adjDataeYR_sup = {
		  	"area_code" : FIPS,
		    "sector_id" : "00000.2",
			"county" : CTY,
		    "job_title" : "Suppressed Total Jobs",
		    "avg_wage" : "",
		    "population_year": eYEAR,
		    "total_jobs": totJobseYR - adjJobseYR,
			"category" : ""};
		
	  var outArrbYR = outDatabYR[0].filter(function(d) {return d.sector_id != "00000";})
	  outArrbYR.push(adjDatabYR)
	  outArrbYR.push(adjDatabYR_sup)
	  outArrbYR.forEach(function(d) {d.county = CTY;})
	  var outDatabYR2 = outArrbYR.sort((a, b) => d3.ascending(a.sector_id, b.sector_id))

	  
	  var outArreYR = outDataeYR[0].filter(function(d) {return d.sector_id != "00000";})
	  outArreYR.push(adjDataeYR)
	  outArreYR.push(adjDataeYR_sup)
	  outArreYR.forEach(function(d) {d.county = CTY;})
	  var outDataeYR2 = outArreYR.sort((a, b) => d3.ascending(a.sector_id, b.sector_id))

      var dataDiff = diffData(outDatabYR2,outDataeYR2);

var sup = "Suppressed";
	  
	  var dataOut = dataDiff.map(item => ({
		fips_code : item.area_code,
		county: item.county_name,
		sector_id : item.sector_id,
		job_sector : item.job_title1,
		year_1: item.population_year1,
		jobs_year_1: (item.total_jobs1 == 0) ? sup : Math.round(item.total_jobs1),
		wage_category_year_1 : item.category1,
		year_2: item.population_year2,
		jobs_year_2: (item.total_jobs2 == 0) ? sup : Math.round(item.total_jobs2),
		wage_category_year_2 : item.category2,
	    difference : (item.diffJobs == 0 || item.total_jobs1 == 0 || item.total_jobs2 == 0) ? sup : Math.round(item.diffJobs)
		}));
		

	 var dataOut = dataOut.sort((a, b) => d3.ascending(a.sector_id, b.sector_id));

		exportToCsv(FNAME, dataOut);
     }).catch(function(error){
		 console.log("Process Error genDownloadDiffPromise");
	 });
 };  //end genDownloadDiffPromise

//diffData calculates differences between two data sets

function diffData(data1, data2) {

//find missing records

var sector_list = [{ 'sector_id' : '00000'},
					{"sector_id" : "00000.1"},
					{"sector_id" : "00000.2"},
					{ 'sector_id' : '00001'},
					{ 'sector_id' : '00002'},
					{ 'sector_id' : '00003'},
					{ 'sector_id' : '00011'},
					{ 'sector_id' : '00021'},
					{ 'sector_id' : '00022'},
					{ 'sector_id' : '00023'},
					{ 'sector_id' : '00042'},
					{ 'sector_id' : '00051'},
					{ 'sector_id' : '00052'},
					{ 'sector_id' : '00053'},
					{ 'sector_id' : '00054'},
					{ 'sector_id' : '00055'},
					{ 'sector_id' : '00056'},
					{ 'sector_id' : '00061'},
					{ 'sector_id' : '00062'},
					{ 'sector_id' : '00071'},
					{ 'sector_id' : '00072'},
					{ 'sector_id' : '00081'},
					{ 'sector_id' : '00099'},
					{ 'sector_id' : '03133'},
					{ 'sector_id' : '04445'},
					{ 'sector_id' : '04849'}]



data1.sort(function(a, b){ return d3.ascending(a['sector_id'], b['sector_id']); });
var res1 = unmatchedArray(sector_list,data1);


data2.sort(function(a, b){ return d3.ascending(a['sector_id'], b['sector_id']); });
var res2 = unmatchedArray(sector_list,data2);


  var outData = join(res1,res2,"sector_id","sector_id", function(dat,col){
           return{
			   area_code : dat.area_code,
			   sector_id: dat.sector_id,
			   county: (dat != undefined) ? dat.county : col.county,
			   sector_id : (dat != undefined) ? dat.sector_id : col.sector_id,
			   job_title1:  col.job_title,
			   job_title2: dat.job_title,
			   population_year1: (col != undefined) ? col.population_year : 0,
			   population_year2: (dat != undefined) ? dat.population_year : 0,
			   total_jobs1 : (col != undefined) ? col.total_jobs : 0,
			   total_jobs2 : (dat != undefined) ? dat.total_jobs : 0,
			   category1 : col.category,
			   category2 : dat.category,
			   bar_color1 : col.bar_color,
			   bar_color2 : dat.bar_color
			   };
			   
			   
});

outData.forEach(function(d) { d.diffJobs = Math.round(d.total_jobs2) - Math.round(d.total_jobs1)});

//Fixing MISSING values
outData2 = outData.filter( function(d) { if(!((d.job_title1 == "MISSING" && d.job_title2 == "MISSING"))){ return d;}});

outData2.forEach( function(d) {d.job_title = fixMISS(d.job_title1,d.job_title2);});
outData2.forEach( function(d) {d.category = fixMISS(d.caregory1,d.category2);});
outData2.forEach( function(d) {d.bar_color = fixMISS(d.bar_color1,d.bar_color2);});

outData2.sort(function(a, b){ return d3.descending(+a['diffJobs'], +b['diffJobs']); })
return(outData2);
};



//DATA AND IMAGE DOWNLOAD FUNCTIONS
function dataDownload(chartType){
	
	var seldCTY = d3.select('#selCty option:checked').text();
	var seldFIPS = switchFIPS(seldCTY);
	var seldYEAR = eval(d3.select("#selYear").property('value'));
	if(seldCTY == "Broomfield County" && seldYEAR < 2010){
		seldYEAR = 2010;
		document.getElementById("selYear").value = 2010;
    };
		
if(chartType == 0){ //Count Data
     var fileName = "Jobs by Sector Counts " + seldCTY + " " + seldYEAR + ".csv";
     genDownloadCountPromise(seldFIPS,seldYEAR,seldCTY,fileName);
     };
	 
if(chartType == 1){ //Percentage Data
     var fileName = "Jobs by Sector Percentage " + seldCTY + " " + seldYEAR + ".csv";
     genDownloadPCTPromise(seldFIPS,seldYEAR,seldCTY,fileName);
}; 

if(chartType == 2) {  //Difference Data
		var begYEAR = eval(d3.select("#begYear").property('value'));
        var endYEAR = eval(d3.select("#endYear").property('value'));
		if(seldCTY == "Broomfield County" && begYEAR < 2010){
	        begYEAR = 2010;
			document.getElementById("begYear").value = 2010;
        };
        var fileName = "Jobs by Sector Differences " + seldCTY + " " + begYEAR + " to " + endYEAR + ".csv";

genDownloadDiffPromise(seldFIPS,begYEAR,endYEAR,seldCTY,fileName);
};
}; //end of dataDownload


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


function imageDownload(outFileName,dimChart,chartType) {

if(chartType == 0) {
	var count_node = d3.select("svg").node();
	count_node.setAttribute("viewBox", "40 20 1050 475");
	saveSvgAsPng(count_node, outFileName);
	updateCountChart(dimChart);
} else if(chartType == 1) {
	var pct_node = d3.select("svg").node();
	pct_node.setAttribute("viewBox", "40 20 1050 475");
	saveSvgAsPng(pct_node, outFileName);
	updatePCTChart(dimChart);
} else {
	var diff_node = d3.select("svg").node();
	diff_node.setAttribute("viewBox", "40 20 1050 475");
	saveSvgAsPng(diff_node, outFileName);
	updateDiffChart(dimChart);
};
}; //End of imageDownload


//CHART FUNCTIONS
//initialChart reads information from the dropdowns, updates the title block and calls genCountChart to produce the initial static chart
function initialChart(dimChart) {  

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'))

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};

genChartPromise(seldFIPS, seldYEAR, seldCTY, dimChart);
 
}; // initialChart

//updateCountChart reads information from the dropdowns, updates the title block and generates the updated static chart
function updateCountChart(dimChart) {

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'));

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
// Removes the chart

var graph = d3.select("svg").remove();

genChartPromise(seldFIPS, seldYEAR, seldCTY, dimChart);
 
}; //updateCountChart

//updatePCTChart reads information from the dropdowns, updates the title block and generates the updated percentage chart

function updatePCTChart(dimChart) {

var seldCTY = d3.select('#selCty option:checked').text();
var seldFIPS = switchFIPS(seldCTY);
var seldYEAR = eval(d3.select("#selYear").property('value'));

if(seldCTY == "Broomfield County" && seldYEAR < 2010){
	seldYEAR = 2010;
	document.getElementById("selYear").value = 2010;
};
// Removes the chart

var graph = d3.select("svg").remove();
genPCTPromise(seldFIPS,seldYEAR,seldCTY,dimChart)

 }; //updatePCTChart

//updateDiffChart reads information from the dropdowns, updates the title block and generates the updated percentage chart  HERE
function updateDiffChart(dimChart) {

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

//Updating margins
//dimChart.margin = "margin" : [{top: 20, right: 210, bottom: 40, left: 100}]

genDiffPromise(seldFIPS,begYEAR,endYEAR,seldCTY,dimChart);


 
}; //updateDiffChart

//genCountChart produces the Total Jobs chart
function genCountChart(outdata,suppressed,supp_pct,tabdata,CTY,YEAR,dimChart){ 

//Comma format
var formatComma = d3.format(",");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Date Format
var formatDate = d3.timeFormat("%m/%d/%Y");
//Percentage Format
var formatPercent = d3.format(".1%")
//defining the SVG, using the values from dimChart  

var yLen = (dimChart[0].barHeight + dimChart[0].barSpace) * (outdata.length);

var maxVal = d3.max(outdata, function(d) { return +d.total_jobs;} );

var x_axis = d3.scaleLinear()
                   .domain([0, maxVal])
				   .range([0,(dimChart[0].width - dimChart[0].margin[0].right)]);

var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

  var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [dimChart[0].viewBx[0].xVal, dimChart[0].viewBx[0].yVal, dimChart[0].viewBx[0].vWidth, dimChart[0].viewBx[0].vHeight])  //Sets Viewbox
		 .style("background-color", 'white');
//Title
var titStr = "Jobs by Sector: " + CTY +", "+ YEAR;
graph.append("text")
        .attr("x", (dimChart[0].width / 2))             
        .attr("y", dimChart[0].margin[0].top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16pt sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);

var bar = graph.selectAll("g")
                  .data(outdata)
                  .enter()
                  .append("g")
                  .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},50)`);

bar.append("rect")
       .attr("y", function(d) { return y_axis(d.job_title); })
       .attr("width", function(d) { return x_axis(+d.total_jobs); })
       .attr("height", dimChart[0].barHeight)
	   .style("fill", function(d) { return d.bar_color});

bar.append("text")
       .attr("x", function(d) { return x_axis(+d.total_jobs) + 3; })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatComma(Math.round(d.total_jobs)); })
	   .style("fill","black")
	   .style("font", "9pt sans-serif");

//X- axis
graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatComma));

//Y-axis
graph.append("g")
      .attr("class","Y-Axis")
      .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},50)`)
      .call(d3.axisLeft(y_axis));
	  

//captions


var captionStr = captionTxt(suppressed, supp_pct, yLen + 100);
var caption =  graph.append("g")
	     .attr("class","captionobj");
caption.selectAll("text")
        .data(captionStr)
		.enter()
        .append("text")
        .text(function(d) {return d.captxt})
	    .attr("x", 165)             
        .attr("y", function(d) {return d.ypos})
        .attr("text-anchor", "right")  
        .style("font", "9pt sans-serif");

//Table

var pos = x_axis(0);
var tabArray = jobsHdr(tabdata,YEAR,yLen,dimChart[0].barSpace,dimChart[0].barHeight,0,pos, 0);


    var rectanchorX = dimChart[0].width * .7;
 
var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX - 5;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  dimChart[0].barHeight)
    .attr("height", dimChart[0].barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 5;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9pt sans-serif");
	
return graph.node();
 
};  //end of genCountChart

//genPCTChart produces the Total Jobs chart
function genPCTChart(outdata,suppressed,supp_pct,tabdata,CTY,YEAR,dimChart){ 

//Comma format
var formatComma = d3.format(",");
//Dollar Format
var formatDecimalComma = d3.format(",.0f");
var formatDollar = function(d) { return "$" + formatDecimalComma(d); };
//Date Format
var formatDate = d3.timeFormat("%m/%d/%Y");
//Percentage Format
var formatPercent = d3.format(".1%")
//defining the SVG  Using the values of dimChart  

var yLen = (dimChart[0].barHeight + dimChart[0].barSpace) * (outdata.length);

var maxVal = d3.max(outdata, function(d) { return +d.pct_jobs;} );

var x_axis = d3.scaleLinear()
                   .domain([0,maxVal])
				   .range([0,(dimChart[0].width - dimChart[0].margin[0].right)]);


var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

  var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [dimChart[0].viewBx[0].xVal, dimChart[0].viewBx[0].yVal, dimChart[0].viewBx[0].vWidth, dimChart[0].viewBx[0].vHeight])
		 .style("background-color", 'white');

//Title
var titStr = "Jobs by Sector, Percentage: " + CTY +", "+ YEAR;
graph.append("text")
        .attr("x", (dimChart[0].width / 2))             
        .attr("y", dimChart[0].margin[0].top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16pt sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);

var bars = graph.selectAll("g")
                  .data(outdata)
                  .enter()
                  .append("g")
                  .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},50)`);

bars.append("rect")
       .attr("y", function(d) { return y_axis(d.job_title); })
       .attr("width", function(d) { return x_axis(+d.pct_jobs); })
       .attr("height", dimChart[0].barHeight)
	   .style("fill", function(d) { return d.bar_color});

bars.append("text")
       .attr("x", function(d) { return x_axis(+d.pct_jobs) + 5; })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatPercent(+d.pct_jobs); })
	   .style("fill","black")
	   .style("font", "9pt sans-serif");

//X- axis
graph.append("g")
      .attr("class","X-Axis")
      .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatPercent));

//Y-axis
graph.append("g")
      .attr("class","Y-Axis")
      .attr("transform", `translate(${dimChart[0].margin[0].left + dimChart[0].axisShift},50)`)
      .call(d3.axisLeft(y_axis));
	  

//caption
var captionStr = captionTxt(suppressed,yLen + 100);
var caption =  graph.append("g")
	     .attr("class","captionobj");
caption.selectAll("text")
        .data(captionStr)
		.enter()
        .append("text")
        .text(function(d) {return d.captxt})
	    .attr("x", 165)             
        .attr("y", function(d) {return d.ypos})
        .attr("text-anchor", "right")  
        .style("font", "9pt sans-serif");

//Table
var pos = x_axis(0);
var tabArray = jobsHdr(tabdata,supp_pct,YEAR,yLen,dimChart[0].barSpace,dimChart[0].barHeight,0,pos, 0);

   var rectanchorX = dimChart[0].width * .7;


var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX - 5;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  dimChart[0].barHeight)
    .attr("height", dimChart[0].barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 5;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9pt sans-serif");
	
return graph.node();
 
};  //end of genPCTChart

//genDiffChart produces the Difference Chart
function genDiffChart(outdata,suppressed,totalDiff,CTY,YEAR1,YEAR2,dimChart){ 

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
 

var cfg = {
      labelMargin: 5,
      xAxisMargin: 5,
      legendRightMargin: 0,
	  axisShift : 80
    }
var yLen = (dimChart[0].barHeight + dimChart[0].barSpace) * (outdata.length);

var scaleVal = extendAxis(d3.extent(outdata, function(d) {return d.diffJobs;}));

var x_axis = d3.scaleLinear()
                   .domain([scaleVal[0], scaleVal[1]])
				   .range([0,(dimChart[0].width - dimChart[0].margin[0].right)]);

var y_axis = d3.scaleBand()
     .domain(outdata.map(d => d.job_title))
	 .rangeRound([0,yLen]);


//Output code for chart 

var graph = d3.select("#chart")
	     .append("svg")
		 .attr("preserveAspectRatio", "xMinYMin meet")
         .attr("viewBox", [dimChart[0].viewBx[0].xVal, dimChart[0].viewBx[0].yVal, dimChart[0].viewBx[0].vWidth, dimChart[0].viewBx[0].vHeight]) 		 //This sets the viewBox to the size of the SVG
		 .style("background-color", 'white');

		 
if(YEAR1 == YEAR2) {
	var titStr = "The selected year values are equal.  Please adjust the 'Start Year' or 'End Year' values.";
	graph.append("text")
			.attr("x", (dimChart[0].width / 2))             
			.attr("y", dimChart[0].margin[0].top + 10 )
			.attr("text-anchor", "middle")  
			.style("font", "16pt sans-serif") 
			.style("text-decoration", "underline")  
			.text(titStr);
} else if((+YEAR1 > +YEAR2) && (+YEAR2 != 2001)) {
	var titStr = "The 'Start Year' value is greater than the 'End Year' value.  Please adjust the 'Start Year' or 'End Year' values.";
	graph.append("text")
			.attr("x", (dimChart[0].width / 2))             
			.attr("y", dimChart[0].margin[0].top + 10 )
			.attr("text-anchor", "middle")  
			.style("font", "16pt sans-serif") 
			.style("text-decoration", "underline")  
			.text(titStr);
} else if(+YEAR2 > 2001) {
//Title
var titStr = "Employment Change by Sector. " + CTY +" "+ YEAR1 +" to "+ YEAR2;
graph.append("text")
        .attr("x", (dimChart[0].width / 2))             
        .attr("y", dimChart[0].margin[0].top + 10 )
        .attr("text-anchor", "middle")  
        .style("font", "16pt sans-serif") 
        .style("text-decoration", "underline")  
        .text(titStr);
//Y Axis
     var yAxis = graph.append("g")
      	.attr("class", "y-axis")
      	.attr("transform", "translate(" + x_axis(0) + ",0)")
      	.append("line")
          .attr("y1", 0)
          .attr("y2", dimChart[0].height);

//X Axis
    graph.append("g")
      .attr("class","X-Axis")
	  .attr("transform", `translate(${dimChart[0].margin[0].left + cfg.axisShift},${yLen + 50})`)
      .call(d3.axisBottom(x_axis).tickFormat(formatComma));
      
//Bars

      var bars = graph.append("g")
      	.attr("class", "bars")
		.attr("transform", `translate(${dimChart[0].margin[0].left + cfg.axisShift},50)`);

 
      
      bars.selectAll("rect")
      	.data(outdata)
        .enter()
	    .append("rect")
      	.attr("class", "annual-growth")
      	.attr("x", function(d) {
       		return x_axis(Math.min(0, d.diffJobs));
      	})
      	.attr("y", function(d) { return y_axis(d.job_title); })
      	.attr("height", dimChart[0].barHeight)
      	.attr("width", function(d) { 
        	return Math.abs(x_axis(d.diffJobs) - x_axis(0))
      	})
      	.style("fill", function(d) { return d.bar_color;});
      	
   
	  bars.selectAll("text")  //This is the number of jobs
	    .data(outdata)
        .enter()
	    .append("text")
       .attr("x", function(d) { return d.diffJobs < 0 ? x_axis(+d.diffJobs) - 40 : x_axis(+d.diffJobs) + 10; })
       .attr("y", function(d,i) {return y_axis(d.job_title) + 5; })
       .attr("dy", ".35em")
       .text(function(d) { return formatComma(Math.round(d.diffJobs)); })
	   .style("fill","black")
	   .style("font", "8pt sans-serif");
	  
	  //Axis Labels
      var labels = graph.append("g")  //This is the job titles
      	.attr("class", "labels")
		.attr("transform", `translate(${dimChart[0].margin[0].left + cfg.axisShift},45)`);;
      
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
		.style("font", "8pt sans-serif");

//caption

var captionStr = captionTxt(suppressed,yLen + 100);

var caption =  graph.append("g")
	     .attr("class","captionobj");
caption.selectAll("text")
        .data(captionStr)
		.enter()
        .append("text")
        .text(function(d) {return d.captxt})
	    .attr("x", cfg.axisShift)             
        .attr("y", function(d) {return d.ypos})
        .attr("text-anchor", "right")  
        .style("font", "9pt sans-serif");

//Table, not really...

var pos = x_axis(0);
var tabArray = jobsHdr(outdata,0,yLen,dimChart[0].barSpace,dimChart[0].barHeight,totalDiff,pos, 1);


var rectanchorX = dimChart[0].width * .7;



var table =  graph.append("g")
	     .attr("class","tabobj");
		 
table.selectAll("rect")
    .data(tabArray)
	.enter()
	.append("rect")
    .attr("x", function(d) {return rectanchorX - 5;})
	.attr("y", function(d) {return d.ypos;})
    .attr("width",  dimChart[0].barHeight)
    .attr("height", dimChart[0].barHeight)
    .attr("fill", function(d) { return d.color;});

table.selectAll("text")
    .data(tabArray)
	.enter()
	.append("text")
    .attr("x", function(d) {return rectanchorX + 5;})
	.attr("y", function(d) {return d.ypos + 6;})
    .text( function(d) { return d.text;})
	.style("font", "9pt sans-serif");

} else {
	var titStr = "Please adjust the 'End Year' value.";
	graph.append("text")
			.attr("x", (dimChart[0].width / 2))             
			.attr("y", dimChart[0].margin[0].top + 10 )
			.attr("text-anchor", "middle")  
			.style("font", "16pt sans-serif") 
			.style("text-decoration", "underline")  
			.text(titStr);
}
	//Error Message
return graph.node();
 
};  //end of genDiffChart
 