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
	var query = 
		"PREFIX dbr: <http://dbpedia.org/resource/> \n" + 
		"PREFIX dbo: <http://dbpedia.org/ontology/> \n" + 
		"PREFIX db: <http://dbpedia.org/> \n" + 
		"CONSTRUCT \n" + 
		"{ \n" + 
		"	?place a dbo:Place . \n" + 
		"} \n" + 
		"WHERE \n" + 
		"{ \n" + 
		"	?societalEvent a dbo:SocietalEvent . \n" + 
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
		
		// New, set an identifier on our <pre> tag		
		pre.attr('id','linktarget1');
				
		var rdf_data = $('#linktarget1').text();				
		$.post('/store',data={'data': rdf_data}, function(data)
		{
			var pre = $('<pre></pre>');
			pre.text(data);
			$('#linktarget1').html(pre);
		})		
	});
}


function getSpecificKindOfPlaceFromOurTripleStore(subclassOfPlaceWhereSocietalEventHappened) 
{	
	var query = "PREFIX map: <http://www.semanticweb.org/gabriel/ontologies/FinalProject#> \n"+
				"SELECT ?x WHERE \n"+
				"{ \n"+
					"  ?x a map:"+subclassOfPlaceWhereSocietalEventHappened+" . \n"+
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
					var name = v_value.substring(v_value.indexOf('#')+1);
					li.append("<table width=\"100%\">"+
								"<tr>"+
									"<td align=\":left\">"+
										name.replace(/_/g," ")+
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
			$('#linktarget2').html('Something went wrong!');
		}		
	});	
}