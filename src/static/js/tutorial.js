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
					var v_value = (value[v]['value']);
					var name = v_value.substring(v_value.indexOf('#')+1);
					li.append("<table width=\"100%\">"+
								"<tr>"+
									"<td align=\":left\">"+
										name.replace(/_/g," ")+
									"</td>"+
									"<td align=\"right\">"+
										"<img src=\"/static/css/images/icons/"+name+".png\" style=\"width:128px;height:128px;\">"+
									"</td>"+
								"</tr>"+
							"</table>"+
							"<br/>");	
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