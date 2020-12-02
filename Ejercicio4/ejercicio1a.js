var cursor = db.noticias.find({etiqueta_principal: "MARTE"}, {_id:1})
var vID = cursor.next()

db.noticias.update({_id: vID._id},
   {$set:{comentarios:[
       {
           autor: "Luis",
           fecha: ISODate("2015-03-06"),
           comentario: "¿A donde vamos a ir a parar?"}]
       }
   });
   
db.noticias.update({_id: vID._id},
   {$push:{comentarios:
       {
           autor: "Sandra",
           fecha: ISODate("2015-03-07"),
           comentario: "Yo me iba a Marte con tal de quitarme de aquí jeje",
           respuestas:[
           {
               autor: "Tomás",
               fecha: ISODate("2015-03-07"),
               comentario: "¿A cuánto sale el billete de ida y vuelta?"
           }]
       }
       }
   });
   
db.noticias.update({_id: vID._id},
   {$set:{comentarios:[
       {
           autor: "Carmen",
           fecha: ISODate("2015-03-10"),
           comentario: "Pero si son todos amarillos!!!!!"
       },
       {
           autor: "Tomás",
           fecha: ISODate("2015-03-11"),
           comentario: "¿Para cuándo un emoticono de un corte de mangas?",
           respuestas:[
               {
                   autor: "Lucas",
                   fecha: ISODate("2015-03-11"),
                   comentario: "Por lo menos una peineta, jajaja"
               },
           
               {
                   autor: "Pili",
                   fecha: ISODate("2015-03-11"),
                   comentario: "Seguro que sería el mas usado"
               }
           ]
        }
    ]
    }});
