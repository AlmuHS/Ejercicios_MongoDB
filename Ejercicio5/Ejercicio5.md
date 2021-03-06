# Ejercicio 5: El *Aggregation Framework* de MongoDB

---

## Primera parte

Usaremos la colección zips (disponible en la web de la asignatura), que almacena información sobre ciudades y estados norteamericanos.

Resolver las siguientes consultas:

1. **Contar el número de documentos que tiene la colección**

		db.zips.count()
		
2. **Calcular el número de habitantes que tiene EEUU**

		db.zips.aggregate([
		    {$group:{
		        _id: '',
		        poblacion_total: {$sum: "$pop"}
		    }},
		    {$project:{_id:0}}
		    ])

3. **Calcular el número de habitantes de las 5 ciudades más pobladas, ordenadas de mayor a menor número de habitantes**

		db.zips.aggregate([
		    {$group:{
		        _id: "$city",
		        poblacion: {$sum:"$pop"}
		    }},
		    {$sort:{poblacion:-1}},
		    {$limit:5}
		    ])
		    
4. **De las ciudades que tengan un código postal mayor que 62015, mostrar las que tengan más de 5000 habitantes, ordenadas alfabéticamente (mostrar sólo las 5 primeras)**

		db.zips.aggregate([
		    {$match: {_id: {$gt:"62015"}}},
		    {$group:{
		       _id: "$city", 
		       habitantes: {$sum:"$pop"}
		    }},
		    {$match: {habitantes: {$gt: 5000}}},
		    {$sort:{_id: 1}},
		    {$limit: 5}
		])
		
5. **Obtener el valor medio de la población de cada estado.** Para ello hay que hacer dos agrupaciones en dos etapas. En una primera etapa se agrupa por "estado y ciudad" y se calcula su población total.  En la siguiente etapa se obtiene la  media  de la población realizando  otra  agrupación  y tomando  como entrada la  colección  anterior (mostrar los 5 primeros estados ordenados  de mayor a menor población)

		db.zips.aggregate([
		    {$group:{
		       _id: {estado: "$state", ciudad: "$city"},
		       habitantes: {$sum:"$pop"}
		    }},
		    {$group:{
		        _id: "$_id.estado",
		        media_habitantes: {$avg: "$habitantes"}
		    }},
		    {$sort: {media_habitantes: -1}},
		    {$limit: 5}
		])
		
6. **Por  cada  estado,  mostrar  el  nombre  y  la  población  de  la  ciudad  más  poblada  (mostrar  los  3 primeros resultados ordenados de mayor a menor según la población).** PISTA: operador $first

		db.zips.aggregate([
				    {$group:{
				       _id: {estado: "$state", ciudad: "$city"},
				       habitantes: {$sum:"$pop"}
				    }},
                    {$sort: {habitantes: -1}},
				    {$group:{
				        _id: "$_id.estado",
                        ciudad: {$first: "$_id.ciudad"},
				        habitantes: {$first: "$habitantes"}
				    }},
                    {$sort: {habitantes: -1}},
				    {$limit: 3}
				])
		
7. **Por  cada  estado,  mostrar  el nombre  y  la  población  de  la  ciudad  menos  poblada  (mostrar  los  3 primeros  resultados ordenados  de  menor  a  mayor  según  la  población y  alfabéticamente por el nombre de la ciudad)**

		db.zips.aggregate([
			    {$group:{
			       _id: {estado: "$state", ciudad: "$city"},
			       habitantes: {$sum:"$pop"}
			    }},
                {$sort: {habitantes: 1}},
			    {$group:{
			        _id: "$_id.estado",
                    ciudad: {$first: "$_id.ciudad"},
		       	   habitantes: {$first: "$habitantes"}
			    }},
                {$sort: {habitantes: 1, ciudad: 1}},
                {$limit: 3}
			])
			
8. **Unir ambas consultas en una única y, mediante el operador $project, hacer que los documentos de salida tengan la siguiente estructura**

		db.zips.aggregate([
		    {$group:{
		       _id: {estado: "$state", ciudad: "$city"},
		       habitantes: {$sum:"$pop"}
		    }},
            {$sort: {habitantes: -1}},
		    {$group:{
		        _id: "$_id.estado",
                ciudad_mayor: {$first: "$_id.ciudad"},
                habitantes_mayor: {$first: "$habitantes"},
                ciudad_menor: {$last: "$_id.ciudad"},
                habitantes_menor: {$last: "$habitantes"}
		    }},
            {$sort: {habitantes_mayor: -1, ciudad_mayor: 1}},
            {$project: {_id:0,
                        estado: "$_id",
                    	ciudad_mayor:{nombre: "$ciudad_mayor", poblacion: "$habitantes_mayor"},
                    	ciudad_menor: {nombre: "$ciudad_menor", poblacion: "$habitantes_menor"}}},
            {$limit: 3}
		])
				
9. **Mostrar el nombre del estado, su población total y un campo "situación" que muestre la cadena "superpoblado" si la población supera los 3.000.000 de habitantes, y la cadena "normal"en caso contrario (los 4 primeros ordenados alfabéticamente)**

		db.zips.aggregate([
			    {$group:{
			       _id: {estado: "$state"},
			       poblacion: {$sum:"$pop"}
			    }},
                {$project: {_id: "$_id",
                           poblacion: "$poblacion",
                           situacion: {$cond:[ {$gt:["$poblacion", 3000000]}, "SUPERPOBLADO", "NORMAL"]}
                 }},
                 {$sort:{_id: 1}},
                 {$limit:4}
			])
				
10. **Mostrar el nombre del estado, su población total y el número de códigos postales que tiene(solo de los 4 estados que menos códigos postales tienen)**

		db.zips.aggregate([
			    {$group:{
			       _id: {estado: "$state", zip: "$_id"},
			       poblacion: {$sum:"$pop"},
	                       numero_zips: {$sum: 1},
			    }},
	            {$group:{
	                _id: "$_id.estado",
	                poblacion_total: {$sum:"$poblacion"},
	                zips_total: {$sum: "$numero_zips"}
	            }},
	            {$project: {_id: "$_id",
		                   poblacion_total: "$poblacion_total",
		                   num_codigos: "$zips_total"
	               }},
	            {$sort: {"num_codigos": 1}},
	            {$limit: 4}
			])
				
11. **Crear una nueva  colección con  los  estados  que  tengan  más  de  1000 códigos  postales.  Cada documento tendrá el nombre del estado y el número de códigos postales.**

		db.zips.aggregate([
		    {$group:{
		       _id: {estado: "$state", zip: "$_id"},
                       numero_zips: {$sum: 1},
		    }},
                    {$group:{
                        _id: "$_id.estado",
                        zips_total: {$sum: "$numero_zips"}
                    }},
                    {$match:{zips_total: {$gt: 1000}}},
                    {$project: {_id: 0, estado: "$_id",
                               num_codigos: "$zips_total"
                    }},
                    {$out: {db: "estadosGrandes", coll: "estadosGrandes"}}
		])
		
12. **Sobre la colección anterior, mostrar los documentos con la siguiente estructura**

	{"estado" : "Estado de TX",   "num_códigos" : 1671.0}
	
		db.estadosGrandes.aggregate([
		    {$project:{
		        _id: 0,
		        estado: {$concat: ["Estado de ", "$estado"]},
		        num_codigos: "$num_codigos"
		    }}
		])
		
## Segunda parte

Para la segunda parte, usaremos una colección artificial (club) disponible en la web de la asignatura. Esta colección almacena a los socios de un club con los deportes elegidos para practicar

13. **Mostrar, únicamente, el nombre de los socios en mayúsculas y ordenados alfabéticamente**

		db.club.aggregate([
		    {$project:{
		        nombre: {$toUpper:"$nombre"}
		    }},
		    {$sort: {nombre: 1}}
		])

14. **Mostrar el año de alta y el nombre del socio, ordenados por antigüedad**

		db.club.aggregate([
		    {$project:{
		        nombre: "$nombre",
		        año_alta: {$year: "$alta"},
		        antiguedad: {$subtract:["$$NOW", "$alta"]},
		    }},
		    {$sort: {antiguedad: -1}},
		    {$project:{
		        _id: 0,
		        nombre: "$nombre",
		        año_alta: "$año_alta"
		    }}
		])

15. **Mostrar cuántos socios se han dado de alta cada año**

		db.club.aggregate([
		    {$group: {
		        _id: {id:"$_id", año_alta: {$year: "$alta"}},
		        socios: {$sum: 1}
		    }},
		    {$group:{
		        _id: "$_id.año_alta",
		        socios: {$sum: "$socios"}
		    }},
		    {$project:{
		        _id: 0,
		        año: "$_id",
		        socios: "$socios"
		    }}
		])
		
16. **Obtener  el  número  de  socios  que  practican  cada  deporte,  pero  solo  de  los  deportes  que  lo practican, al menos, 3 socios**

		db.club.aggregate([
		    {$group: {
		        _id: {deportes:"$deportes", id: "$_id"},
		        socios: {$sum: 1}
		    }},
		    {$unwind: "$_id.deportes"},
		    {$group:{
		        _id: "$_id.deportes",
		        socios: {$sum: "$socios"}
		    }},
		    {$match: {socios: {$gt: 2}}}
		])
		
17. **Obtener el nombre del socio que practica más deportes**

		db.club.aggregate([
		    {$project:{
		        _id: 0,
		        nombre: "$nombre",
		        num_deportes: {$size: "$deportes"}
		    }},
		    {$sort:{num_deportes: -1}},
		    {$limit: 1}
		])
		
18. **Mostrar la  siguiente  información,  añadiendo  el  campo  "cuota"  y  teniendo  en  cuenta que cada deporte cuesta 50€:**

		db.club.aggregate([
		    {$project:{
		        _id: 0,
		        nombre: "$nombre",
		        fecha: {$dateToString:{
		            format: "%d-%m-%Y",
		            date: "$alta"}},
		        num_deportes: {$size: "$deportes"},
		        cuota: {$multiply: [50, {$size: "$deportes"}]}
		    }}
		])