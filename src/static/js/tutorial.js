function initMap() 
{
	var map = new google.maps.Map(document.getElementById('map'), 
	{
		zoom: 2,
		center: {lat: 0, lng: 0 }
	});
	map.addListener('click', function(e) 
	{
			constructPlacesWhereSocietalEventsHappenedFromCoordinatesAndPost(e);
			map.panTo(e.latLng);
	});
}

function constructPlacesWhereSocietalEventsHappenedFromCoordinatesAndPost(e) 
{	
	lat = e.latLng.lat();
	lng = e.latLng.lng();
	subclassOfSocietalEvent = $('#option').val();
	var query = 
		"PREFIX dbr: <http://dbpedia.org/resource/> \n" + 
		"PREFIX dbo: <http://dbpedia.org/ontology/> \n" + 
		"PREFIX db: <http://dbpedia.org/> \n" + 
		"PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n" +
		"PREFIX : <http://www.semanticweb.org/gabriel/ontologies/FinalProject#> \n"+
		"CONSTRUCT \n" + 
		"{ \n" + 
		"	?place a :Place . \n" + 
		"	?place geo:lat ?lat . \n" + 
		"	?place geo:long ?long . \n" + 
		"	?societalEvent a :"+subclassOfSocietalEvent+" .  \n" + 
		"	?societalEvent :place ?place . \n" + 
		"} \n" + 
		"WHERE \n" + 
		"{ \n" + 
		"	?societalEvent a dbo:"+subclassOfSocietalEvent+" .  \n" + 
		"	?societalEvent dbo:place ?place . \n" + 
		"	?place geo:lat ?lat . \n" + 
		"	?place geo:long ?long . \n" + 
		"	FILTER ( ?long > "+lng+" - 5 \n" + 
		"		  && ?long < "+lng+" + 5  \n" + 
		"		  && ?lat > "+lat+" - 5  \n" + 
		"		  && ?lat < "+lat+" + 5) \n" + 
		"}";
	var endpoint = 'http://live.dbpedia.org/sparql';
	var format = 'RDF';	
	$.get('/sparql',data={
							'endpoint': endpoint, 
						  	'query': query, 
						  	'format': format, 
						  }, function(data)
	{
		var pre = $('<pre></pre>');
		pre.text(data);
		$('#linktarget1').html(pre);			
		pre.attr('id','linktarget1');				
		var rdf_data = $('#linktarget1').text();				
		$.post('/store',data={'data': rdf_data}, function(data)
		{
			var pre = $('<pre></pre>');
			pre.text(data);
			getSpecificKindOfPlaceFromCoordinatesFromOurTripleStore(subclassOfSocietalEvent, lng, lat);
		})		
	});
}


function getSpecificKindOfPlaceFromCoordinatesFromOurTripleStore(subclassOfSocietalEvent, lng, lat)
{	
	var query = "PREFIX : <http://www.semanticweb.org/gabriel/ontologies/FinalProject#> \n" +
				"PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#> \n" +
				"SELECT ?place WHERE \n"+
				"{ \n"+
				"	?place a :PlaceWhere" + subclassOfSocietalEvent + "Happened . \n" +
				"	?place geo:lat ?lat . \n" + 
				"	?place geo:long ?long . \n" + 
				"	FILTER ( ?long > "+lng+" - 5 \n" + 
				"		  && ?long < "+lng+" + 5  \n" + 
				"		  && ?lat > "+lat+" - 5  \n" + 
				"		  && ?lat < "+lat+" + 5) \n" + 		
				"}";
	var endpoint = 'http://localhost:5820/tutorial/query';
	var format = 'JSON';	
	$.get('/sparql',data={
							'endpoint': endpoint, 
							'query': query, 
							'format': format, 
							'reasoning': true
						}, function(json)
	{
		console.log(json);		
		try 
		{
			var vars = json.head.vars;		
			var ul = $('<ul></ul>');
			ul.addClass('list-group');		
			$.each(json.results.bindings, function(index,value)
			{
				var li = $('<li></li>');
				li.addClass('list-group-item');			
				$.each(vars, function(index, v)
				{
					var v_value = (value[v]['value']);

					/*
						We do a substring(28) here to 
							remove the "http://dbpedia.org/resource/"
					*/
					var name = v_value.substring(28);
					li.append("<table width=\"100%\">"+
								"<tr>"+
									"<td align=\":left\">"+
										"<a href=\"http://en.wikipedia.org/wiki/"+name+"\">"+
											name.replace(/_/g," ")+
										"</a>"+
									"</td>"+
								"</tr>"+
							"</table>"+
							"<br/>");	
				});
				ul.append(li);			
			});			
			$('#linktarget2').html(ul);
		} 
		catch(err) 
		{
			alert(err);
			$('#linktarget2').html('Something went wrong!');
		}		
	});	
}