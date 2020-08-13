*TWITTER VERSION 2 EN NODEJS*

*PAQUETES*
    -dotenv
    -express
    -mongoose
    -body-parser
    -jwt-simple
    -bcrypt-nodejs
    -moment

**DevDependences**
    -nodemon

Para Iniciar el proyecto, debemos iniciar una terminal del proyecto y escribir "npm start"

El proyecto por medidas de seguridad, cuenta con Enviroments (.env) en el se tendran que encontrar las siguientes:
Ejemplo:
    **PORT = 1111**
    **MONGO_URL = 'mongodb://111.1.1.1:12121/dbname'**

*Rutas*

para que podamos correr nuestra app en Postman, colocaremos la URL siguiente:
**localhost:1111/twitter-V2**
donde el puerto que hemos escrito en nuestro archivo .env será el que colocaremos en nuestra URL de postman

nuestra app esta basada en la utilizacion de una sola ruta, es decir comandos, por ende el body de nuestro Postman debería llevar lo siguente:

    -Key = **comands**
    -Value = esto dependera de la acción que querramos realizar, esas son las siguentes:

+ Agregar un usuario: **register nombre correo usuario contraseña**

*ejemplo: register prueba prueba@prueba.com prueba prueba*

+ Login: **login usuario contraseña** ó **login correo contraseña**

*ejemplo: login prueba prueba / prueba@prueba.com prueba*

ojo, la app cuenta con una creación de tokens para que se valide el logeo del usuario
Si solo nos logeamos asi, unicamente devolvera la data del usuario logeado. Para que nos devuelta el token debemos escribir al final de value la palabra **true**

*ejemplo: prueba prueba true*

las siguentes acciones, se podran realizar unicamente si ingresamos el token que nos genera el login. Dicho token debera ir en nuestro postman **Headers** con los siguentes valores:

key = Authorization
value = token

de esta manera podremos realizar estas acciones

+ Agregar tweet: **add_tweet** y luego el contenido de nuestro tweet

*ejemplo: add_tweet Este proyecto merece un 100 :)*

+ Editar tweet: **edit_tweet** luego id del tweet a editar

*ejemplo: edit_tweet 1231234532345 por Favor profesor un 100 :)*

+ Eliminar tweet: **delete_tweet** luego id del tweet a eliminar

*ejemplo: delete_tweet 12341234134*

+ ver tweets: **view_tweets** seguido del usuario al que queremos ver sus tweets

*ejemplo: view_tweets prueba*

+ follow: **follow** luego el usuario a seguir

*ejemplo: follow prueba*

+ unfollow: **unfollow** luego del usuario a dejar de seguir

*ejemplo: unfollow prueba*

+ ver perfil: **profile** seguido del usuario a visitar

*ejemplo: profile prueba*

+ dar Likes : **like** luego el tweet a dar like

*ejemplo: like 12234234234*

+ dar disLikes: **dislike** luego el tweet a dar dislike

*ejemplo: dislike 12234234234*

Para estas dos anteriores acciones (like, dislike) debemos seguir al creador del tweet para completar la acción

+ comentar: **comment** seguido de el id del tweet y nuestro comentario

*ejemplo: comment 23423512 ya me gradue señores 7u7*

+ retweetear: **retweet** seguido del id del tweet a retweetear

*ejemplo: retweet 123123223*

*----------------------------------------------*

Estas son las acciones que podemos realizas por medio de comandos en nuestra app.

Desarrollador: Máynor Alvarez
Fecha: 13-08-2020