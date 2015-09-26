function getResultsOnMenuDiv(reasoning) 
{	
	var optionFromSelect = $('#query').val();
	var query = "PREFIX meal: <http://www.semanticweb.org/gabriel/ontologies/2015/8/Products#>\nSELECT ?x WHERE \n{\n  ?x a meal:"+optionFromSelect+" .\n}";
	var endpoint = 'http://localhost:5820/tutorial/query';
	var format = 'JSON';	
	$.get('/sparql',data={'endpoint': endpoint, 'query': query, 'format': format, 'reasoning': reasoning}, function(json)
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
					var v_type = value[v]['type'];
					var v_value = value[v]['value'];
					v_value = v_value.substring(v_value.indexOf('#')+1).replace(/_/g," ");		
					// If the value is a URI, create a hyperlink
					if (v_type == 'uri')
					{
						var a = $('<a></a>');
						a.attr('href',v_value);
						a.text(v_value);
						li.append(a);
					// Else we're just showing the value.
					} 
					else 
					{
						li.append(v_value);
					}
					li.append('<br/>');
					
				});
				ul.append(li);			
			});			
			$('#linktarget').html(ul);
		} 
		catch(err) 
		{
			$('#linktarget').html('Something went wrong!');
		}		
	});	
}


// ############
//    With Reasoning
// ############
$('#link_1').on('click', function(e)
{
	getResultsOnMenuDiv(true);
});

// ############
//    Without Reasoning
// ############
$('#link_2').on('click', function(e)
{
	getResultsOnMenuDiv(false);
});