* Description
	
		This is our project for navigating around Google Maps 
	and seeing important events that happened wherever you click.

		You can choose to see the following types of events:
			- Military conflicts
			- Attacks
			- Conventions
			- Rebellions
			- Space missions
			- Sports events

		After choosing one of them  from the drop-down menu 
	(Military Conflicts is the default option) the user 
	just clicks	the map and awaits for the results on 
	the second grey box.

		After the click, we run a CONSTRUCT query agains dbpedia 
	(you can check our queries on resources/Queries.sparql) 
	and show the results on the first grey box. We then post 
	this to our triple store and run a SELECT query against it, 
	searching for places where the specific type of event that 
	the user selected happened, and that's something inferred.
 
* How to run

	- Create stardog database called "tutorial"
	- Upload resources/Ontology.ttl
	- Go to http://127.0.0.1:5000/
	- Click on the map!

* Resources

	- You can check our queries on resources/Queries.sparql 
	and our ontology on resources/Ontology.ttl

	- There are some old RDFs and SPARQL queries on 
	resources/old but it's all obsolete and useless now

* Students

	Gabriel Romero Ricardo
	Elisa Dell'Arriva