# Ejercicio 6: Trabajando con índices en MongoDB

1. **Crear un índice ascendente sobre el campo "etiqueta_principal" y llamarlo "etiqueta_up"**

		db.noticias.createIndex({"etiqueta_principal":1}, {name: "etiqueta_up"})

2. **Crear un índice descendente sobre el campo "etiqueta_principal" y llamarlo "etiqueta_down"**

		db.noticias.createIndex({"etiqueta_principal":-1}, {name: "etiqueta_down"})
		
3. **Obtener  la  colección  de  documentos  sin  utilizar  ningún  índice (se  hace  mediante la  sentencia hint({$natural:1})) y utilizando los índices creados en los ejercicios anteriores. Comprobad cómo cambia el resultado de la consulta.**

		db.noticias.find().hint({$natural: 1})
		
	En este primer caso, la primera noticia mostrada es "MARTE"
		
		db.noticias.find().hint("etiqueta_up")
		
	En el segundo, la primera noticia es "Cartas al director"
		
		db.noticias.find().hint("etiqueta_down")
		
	Con este último, la primera noticia es "WhatsApp"
	
4. **Obtener el documento "FÍSICA"e indicad cual ha sido el plan elegido y el rechazado**

	Primero probamos sin indicar índice

		db.noticias.find({etiqueta_principal: "FÍSICA"})

	Con este plan, la búsqueda tarda 0,002 segundos
	
	Repetimos la búsqueda sin utilizar índices
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint({$natural:1})
	
	Con este nuevo plan, reducimos el tiempo a 0,001 segundos, con picos de 0.004 segundos.
	
	Probamos de nuevo, esta vez usando los índices recién creados  
	  
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_up")
		
	Este índice ofrece unos tiempos muy variables, llegando a 0,005 segundos en ciertas ocasiones. Aunque, en la mayoría de ejecuciones, los tiempos son de 0.001 segundos.
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_down")
		
	Con este índice parecen bajar un poco los tiempos, reduciéndose el pico superior a 0,004 segundos, y llegando a un pico inferior de 0 segundos. El tiempo medio parece oscilar entre 0.001 y 0.002 segundos.
	
	Y con los dos combinados
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_down","etiqueta_up")
		
	Este parece mantener los tiempos del anterior, aunque bajando un poco mas el pico superior a 0.003 segundos. Los tiempos habituales rondan entre 0 y 0.001 segundos.
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_up", "etiqueta_down")
		
	Este se mantiene en los tiempos del anterior, aunque con una media de ejecución mas estable, entre 0 y 0.001 segundos.
		
	Por estas razones, elegiremos el último plan, y rechazaremos los anteriores. Aunque la diferencia no es sustancial entre los planes, los primeros demuestran unos tiempos pico algo superiores a los últimos.
	
5. **Obtener el documento "FÍSICA" sin usar índices y usando los índices creados. Mediante el método explain(), observad cuántas claves y cuántos documentos necesita comprobar MongoDB en cada caso**

	Para ver los datos de ejecución usaremos la opción "executionStats" sobre el método `explain()`

	Empezamos con la búsqueda por defecto, sin índicar índices
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).explain("executionStats")

	Este plan ha requerido consultar 1 documento y 1 clave.
	
	Ahora repetiremos la búsqueda, pero sin índices:

		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint({$natural:1}).explain("executionStats")
		
	Usando este plan, se han necesitado consultar 5 documentos y 0 claves.
	
	Repetimos el proceso, pero con los índices creados anteriormente
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_up").explain("executionStats")
		
	Esta búsqueda ha necesitado de 1 clave y 1 documento.
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_down").explain("executionStats")
		
	Esta muestra el mismo resultado que la anterior, con 1 clave y 1 documento.
	
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_up","etiqueta_down").explain("executionStats")
		
		db.noticias.find({etiqueta_principal: "FÍSICA"}).hint("etiqueta_down","etiqueta_up").explain("executionStats")
		
	Lo mismo con estas dos combinaciones, con 1 clave y 1 documento.
	
6. **Usando la  colección zips,  obtener  los  documentos  de  las  ciudades  "MONSON"  y,  mediante  el  método explain(),  observad  cuántos  documentos  necesita  comprobar  MongoDB y  cuántos  milisegundos  ha consumido para ejecutar la consulta.**

		db.getCollection('zips').find({city: "MONSON"}).explain("executionStats")

	La búsqueda ha requerido de 29353 documentos y 16 milisegundos.
	
7.  **Crear un índice ascendente sobre el campo "ciudad" y volver a realizar la consulta para ver si se reduce el tiempo y el número de documentos examinados**

	Creamos el índice con `createIndex()`, con el nombre *city_index*. 

		db.getCollection('zips').createIndex({city:1}, {name: "city_index"})
		
	Repetimos la búsqueda especificando dicho índice.
		
		db.getCollection('zips').find({city: "MONSON"}).hint("city_index").explain("executionStats")
		
	Vemos que la búsqueda se ha reducido a 2 documentos, con 2 claves, y un tiempo de ejecución de 0 milisegundos.
	
8. **En  la  colección noticias,  crear  un  índice único sobre el  campo  "autor".  Comprobad  que  no  se  puede introducir un documento cuyo autor ya exista en la colección**

	Creamos el índice, activando la opción `unique` para restringir la repetición de sus claves.

		db.noticias.createIndex({"autor": 1}, {unique: true})

	Intentamos añadir esta noticia  
	  
		{
	    "etiqueta_principal" : "Noticia nueva",
	    "titular" : "Esta es una noticia de prueba",
	    "autor" : "Manuel Ansede",
	    "fecha" : ISODate("2015-03-05T21:32:00.000Z"),
	    "etiquetas" : [ 
	        "Prueba"
	    ],
	    "noticia" : "Esta es una noticia de prueba"
		}
	
	Ejecutamos el comando `insert()` para ello
	
			db.noticias.insert(
		    {
		    "etiqueta_principal" : "Noticia nueva",
		    "titular" : "Esta es una noticia de prueba",
		    "autor" : "Manuel Ansede",
		    "fecha" : ISODate("2015-03-05T21:32:00.000Z"),
		    "etiquetas" : [ 
		        "Prueba"
		    ],
		    "noticia" : "Esta es una noticia de prueba"
		    }
			)
			
	Vemos como se nos muestra un error, indicando que hay una clave duplicada. 
	
		E11000 duplicate key error collection: elPais.noticias index: autor_1 dup key: { autor: "Manuel Ansede" }

	En el error se nos indica que la clave duplicada corresponde al autor "Manuel Ansede".
	
9. **Crear una consulta para obtener los documentos que contengan la palabra "emoticonos". Comprobad el error que se produce si no se crea, previamente, un índice de texto.**

	Intentamos ejecutar la búsqueda con el comando `find()`	
	
		db.noticias.find({$text: {$search: "emoticono"}})
	
	Se nos muestra un error, indicando que es necesario un índice de texto para dicha búsqueda
	
		Error: error: {
		"ok" : 0,
		"errmsg" : "text index required for $text query",
		"code" : 27,
		"codeName" : "IndexNotFound"
		}
		
10. **Crear un índice de tipo texto en el campo "noticia" y volver a obtener los documentos que contengan la palabra "emoticonos"**

	Creamos el índice
	
		db.getCollection('noticias').createIndex({noticia: "text"})
		
	Repetimos la búsqueda anterior:
	
		db.noticias.find({$text: {$search: "emoticono"}})
		
	Tras la búsqueda, obtenemos la noticia "WhatsApp"
	
11. **Obtener los documentos que contengan la palabra "billete". ¿Se obtiene algún documento?¿Por qué?**

		db.noticias.find({$text: {$search: "billete"}})

	No se obtiene ningún documento, porque las ocurrencias de esta palabra están en el campo "comentarios", y nuestro índice solo busca en "noticia".
	
12. **Crear un índice de tipo texto sobre el campo "comentario". ¿Qué tipo de error se produce?**
	
	Intentamos crear el índice
	
		db.getCollection('noticias').createIndex({comentarios: "text"})
		
	Nos aparece un error:
	
		/* 1 */
		{
		    "ok" : 0.0,
		    "errmsg" : "Index: { v: 2, key: { _fts: \"text\", _ftsx: 1 }, name: \"comentarios_text\", weights: { comentarios: 1 }, default_language: \"english\", language_override: \"language\", textIndexVersion: 3 } already exists with different options: { v: 2, key: { _fts: \"text\", _ftsx: 1 }, name: \"noticia_text\", weights: { noticia: 1 }, default_language: \"english\", language_override: \"language\", textIndexVersion: 3 }",
		    "code" : 85,
		    "codeName" : "IndexOptionsConflict"
		}
		
	El error nos dice que hay un conflicto entre los índices, indicando que ya existe un índice de texto con diferentes opciones. 
	
13. **Buscar una solución para poder buscar palabras tanto en el campo "noticia"y en el campo "comentario" de los comentarios y de las respuestas**

	Como primera solución, hemos usando la *wildcard* `$**` para crear un índice compuesto por cada campo de texto del documento
	
		db.noticias.createIndex({"$**": "text"})

	Con este obtenemos un resultado satisfactorio, encontrando el documento "MARTE" con la consulta:
	
		db.noticias.find({$text: {$search: "billete"}})

	Otra forma mas precisa es filtrar únicamente los campos que nos interesan.
	En nuestro caso, lo hemos conseguido con este índice:
	
		db.noticias.createIndex(
		{ noticia:"text", "comentarios.comentario":"text", "comentarios.respuestas.comentario":"text" },
		{ name: "TextIndex" } )


14. **Obtener los documentos que tengan la frase "paso a paso"**

		db.noticias.find({$text: {$search: "paso a paso"}})
		
15. **Obtener los documentos que contengan la palabra "la". ¿Cuántos documentos devuelve?**

		db.noticias.find({$text: {$search: "la"}})
		
	La consulta devuelve 5 documentos.
	
16. **Eliminar  el  índice  anterior  y  volver  a  crearlo  especificando  el  lenguaje  español.  Volver  a  recuperar  los documentos que contengan la palabra "la". ¿Cuántos documentos devuelve? ¿Por qué?**

	Borramos el índice anterior con la función `dropIndex()`
	
		db.noticias.dropIndex("TextIndex")

	Creamos el índice con el atributo `default_language`	
		
		db.noticias.createIndex(
				{noticia:"text", "comentarios.comentario":"text", "comentarios.respuestas.comentario":"text" },
                {default_language: "spanish"} )
		
	Repetimos la búsqueda:
	
		db.noticias.find({$text: {$search: "la"}})
	
	Esta vez, la búsqueda no devuelve ningún documento. Es posible que el índice haya eliminado las palabras no relevantes del castellano, estando el artículo "la" entre ellas.