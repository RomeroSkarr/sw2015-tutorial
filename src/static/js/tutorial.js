function initMap() 
{
	var map = new google.maps.Map(document.getElementById('map'), 
		{
			zoom: 2,
			center: {lat: 0, lng: 0 }
		}
	);
	map.addListener('click', function(e) 
		{
			getPlacesFromCoordinates(e);
			getThumbnailsFromCoordinates(e);
   			map.panTo(e.latLng);
		}
	);
}

function testFunction()
{
	alert("Teste!");
}

function getPlacesFromCoordinates(e) 
{	
	lat = e.latLng.lat();
	lng = e.latLng.lng();	
	var query = 
		"PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n"+
		"PREFIX dbo: <http://dbpedia.org/ontology/> \n"+
		"PREFIX db: <http://dbpedia.org/> \n"+
		"SELECT ?s WHERE \n"+
		"{\n"+
		"    ?s a dbo:Place .\n"+
		"    ?s geo:lat ?lat .\n"+
		"    ?s geo:long ?long .\n"+
		"    FILTER ( ?long > "+lng+" - 5 && ?long < "+lng+" + 5 && ?lat > "+lat+" - 5 && ?lat < "+lat+" + 5) \n"+
		"} LIMIT 100";		
	//var endpoint = 'http://localhost:5820/tutorial/query';
	var endpoint = 'http://live.dbpedia.org/sparql';
	var format = 'JSON';	
	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': true}, function(json)
		{
			console.log(json);		
			try 
			{
				var vars = json.head.vars;	
				console.log(vars);		
				var ul = $('<ul></ul>');
				ul.addClass('list-group');		
				$.each(json.results.bindings, function(index,value)
					{
						var li = $('<li></li>');
						li.addClass('list-group-item');			
						$.each(vars, function(index, v)
						{
							var v_value = (value[v]['value']);
							var name = v_value/*.substring(v_value.indexOf('/')+1)*/;
							li.append("<table width=\"100%\">"+
										"<tr>"+
											"<td align=\":left\">"+
												name.replace(/_/g," ")+
											"</td>"+
											"<td align=\"right\">"+
												"<button onclick=\"testFunction()\">Teste</button>"+
											"</td>"+
											/*
											"<td align=\"right\">"+
												"<img src=\"/static/css/images/icons/"+name+".png\" style=\"width:128px;height:128px;\">"+
											"</td>"+
											*/
										"</tr>"+
									"</table>"+
									"<br/>");	
						});
						ul.append(li);			
					}
				);			
				$('#linktarget1').html(ul);
			} 
			catch(err) 
			{
				$('#linktarget1').html(err);
			}		
		}
	);	
}

function getThumbnailsFromCoordinates(e) 
{	
	lat = e.latLng.lat();
	lng = e.latLng.lng();	
	var query = 
		"PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n"+
		"PREFIX dbo: <http://dbpedia.org/ontology/> \n"+
		"PREFIX db: <http://dbpedia.org/> \n"+
		"PREFIX dbp: <http://dbpedia.org/property/> \n"+
		"SELECT ?thumbnail WHERE \n"+
		"{ \n"+
			"?person dbp:birthPlace ?s . \n"+
			"?person dbo:thumbnail ?thumbnail . \n"+
	  		"?s a dbo:Place . \n"+
	  		"?s geo:lat ?lat . \n"+
	  		"?s geo:long ?long . \n"+
  		"FILTER ( ?long > "+lng+" - 5 && ?long < "+lng+" + 5 && ?lat > "+lat+" - 5 && ?lat < "+lat+" + 5) \n"+
		"} LIMIT 100";		
	//var endpoint = 'http://localhost:5820/tutorial/query';
	var endpoint = 'http://live.dbpedia.org/sparql';
	var format = 'JSON';	
	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': true}, function(json)
		{
			console.log(json);		
			try 
			{
				var vars = json.head.vars;	
				console.log(vars);		
				var ul = $('<ul></ul>');
				ul.addClass('list-group');		
				$.each(json.results.bindings, function(index,value)
					{
						var li = $('<li></li>');
						li.addClass('list-group-item');			
						$.each(vars, function(index, v)
						{
							var v_value = (value[v]['value']);
							var name = v_value/*.substring(v_value.indexOf('/')+1)*/;
							li.append("<table width=\"100%\">"+
										"<tr>"+
											"<td align=\":left\">"+
												"<img src=\""+name+"\">"+
											"</td>"+
											"<td align=\"right\">"+
												"<button onclick=\"testFunction()\">Teste</button>"+
											"</td>"+
											/*
											"<td align=\"right\">"+
												"<img src=\"/static/css/images/icons/"+name+".png\" style=\"width:128px;height:128px;\">"+
											"</td>"+
											*/
										"</tr>"+
									"</table>"+
									"<br/>");	
						});
						ul.append(li);			
					}
				);			
				$('#linktarget2').html(ul);
			} 
			catch(err) 
			{
				$('#linktarget2').html(err);
			}		
		}
	);	
}