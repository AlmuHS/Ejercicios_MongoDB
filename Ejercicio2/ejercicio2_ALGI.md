# Ejercicio 2 ALGI: Un poquito de JSON

## Autora: Almudena García Jurado-Centurión

**1.  Escribe el código JSON del documento "libros", correspondiente a la captura de pantalla realizada con JsonViewer**
		
		{
			"libros": [
					{
						"titulo": "El latido de la tierra",
						"autor": "Luz Gabas",
						"genero": "novela",
						"informacion": {
							"editorial": "Editorial Planeta",
							"idioma": "Castellano",
							"paginas": 448
						},
						"precios": [{
								"tipo": "Tapa dura",
								"precio": 21
							},
							{
								"tipo": "eBook",
								"precio": 11
							}
						]
					},
					{
						"titulo": "Come comida real",
						"autor": "Carlos Rios",
						"genero":{
							"0":"Autoayuda",
							"1": "Dieta",
							"2": "Nutricion",
							"3": "Salud"
							},
						"informacion": {
							"editorial": "Ediciones Paidos",
							"idioma": "Castellano", 
							"paginas": 360
						},
						"precios": [
							{
								"tipo": "Rustica con solapas",
								"precio": 17
							},
							{
								"tipo": "eBook",
								"precio": 9.99
							},
							{
								"tipo": "audiolibro",
								"precio": 5.99
							}
						]
					},
					{
						"titulo": "La casa alemana",
						"autor": "Annete Hess",
						"genero": "Novela literaria",
						"informacion":{
							"editorial": "Editorial Planeta",
							"idioma":{
								"0": "Inglés",
								"1": "Castellano"
							},
							"paginas":464
						},
						"precios":[
							{
								"tipo": "Tapa dura con sobrecubiertas",
								"precio": 17
							}
						]
					}
				]
		}		
				
**2. Contesta a las siguientes preguntas**

- **¿De qué tipo es el campo "libros"? ¿Cuántos elementos tiene?**
	
	El campo es un array de 3 elementos.

- **¿Cuántos elementos tiene el campo "precios" del objeto con título "Come comida real"?**

	El campo "precios" tiene 3 elementos
	
- **¿Cuántos elementos tiene el campo "información" del objeto con autor "Annette Hess"?**

	El campo "información" tiene 3 elementos
	
- **Escribe el path para extraer la siguiente información. Puedes comprobar el resultado con un "path extractor" como, por ejemplo, https://jsonpath.com**

	- **Los géneros del libro "Come comida real"**
	
			$.libros[?(@.titulo == "Come comida real")].genero
	
	- **El precio del eBook del libro "El latido de la tierra"**
	
			$.libros[?(@.titulo == "El latido de la tierra")].precios[?(@.tipo == "eBook")].precio
			
	- **Los idiomas del libro "La casa alemana"**
	
			$.libros[?(@.titulo == "La casa alemana")].informacion.idioma
			
	- **Los libros de género "Novela"**
	
			$.libros[?(@.genero == "novela")]
			
	- **La información de los libros de más de 400 páginas**
	
			$.libros[:][?(@.paginas > 400)]
			
	- **La información de los libros de más de 400 páginas y que estén escritos en castellano (deben salir 2 libros)**
	
			$.libros[:][?(@.paginas > 400 && @.idioma contains "Castellano")
			
		(Probada en https://jsonpath.curiousconcept.com/)