
En el protocolo HTTP hay metodos de consulta:

GET: Obtener recursos del servidor
POST: Enviar recursos al servidor
PUT: Actualizar un recurso del servidor
DELETE: Eliminar un recurso del servidor

Los metodos/verbos http son teoricos, es decir teoricamente el GET debe traer recursos pero REALMENTE quien define que hace el GET...DELETE es en ultima instancia el programador




En el protocolo HTTP tenemos status de respuesta HTTP
Los estatus basicamente sirven para saber rapidamente como fue una consulta
EN ULTIMA INSTANCIA QUIEN ELIGE CUMPLIR CON LOS SIGNIFICADOS ES EL PROGRAMADOR

2.x.x: Suele significar que salio correctamente
    200: OK, todo salio como esperabamos
    201: Creado, el recurso se creo correctamente

4.x.x: Suele significar un error del lado de quien consulta (Client-side)
    400: BAD REQUEST, Algo de tu lado salio mal, nos mandaste algo mal, nose fijate!
    401: Unauthorized, No podes acceder sin autorizacion
    403: Forbidden, NO tenes permiso para esta operacion
    404: Not found, ese recurso que pedis no existe

5.x.x: Suele significar un error del lado del servidor (Server-side)
    500: Error interno del servidor
    502: Bad Gateway, el servidor esta mal enlazado
    503: Service unaviable, ese servicio no esta diponible
    504: Gateway timeout, el tiempo de espera de respuesta se agoto
