# qb-support-ticket

Sistema de tickets de soporte para servidores **FiveM** con **QBCore**. Este recurso permite a los jugadores abrir un ticket de soporte a través de la tecla **F9**, comunicarse con los administradores y hacer seguimiento de sus solicitudes. Las funcionalidades se han diseñado para mantener la privacidad: únicamente el creador del ticket y los administradores pueden ver y comentar en el ticket.

## Características

- **Interfaz accesible con F9**: abre un panel a la derecha de la pantalla con tus tickets y un botón para crear uno nuevo.
- **Creación de tickets**: los usuarios escriben un asunto y descripción del problema; los tickets se enumeran en la lista para referencia futura.
- **Comentarios y seguimiento**: dentro de cada ticket se muestran los mensajes publicados; tanto el jugador como el administrador pueden escribir comentarios.
- **Asignación y cierre por administradores**: los administradores pueden reclamar un ticket (asignarlo a sí mismos) y cerrarlo cuando esté resuelto.
- **Confidencialidad**: cada ticket es visible únicamente para su creador y para los administradores con permisos (`admin` o `god`). Otros jugadores no pueden ver ni editar tickets ajenos.

## Instalación

1. Asegúrate de tener un servidor FiveM con la framework **QBCore** configurada.
2. Descarga o clona este repositorio en la carpeta `resources` de tu servidor. Por ejemplo:
   ```bash
   cd resources
   git clone https://github.com/Dvstrada/qb-support-ticket.git
   ```
3. Abre tu archivo `server.cfg` y añade la siguiente línea para iniciar el recurso:
   ```cfg
   ensure qb-support-ticket
   ```
4. Reinicia el servidor o usa el comando `refresh` y luego `ensure qb-support-ticket` en la consola para cargar el recurso.

## Uso

- Los jugadores pueden pulsar **F9** para abrir el panel de soporte. Desde ahí pueden:
  - Ver su lista de tickets existentes.
  - Pulsar en “Nuevo ticket” para abrir un formulario donde introducir **Asunto** y **Descripción**. Al enviar, el ticket se crea y aparece en la lista.
  - Seleccionar un ticket para ver los mensajes y añadir comentarios.
- Los administradores (usuarios con permisos `admin` o `god` en QBCore) verán todos los tickets que no están cerrados y podrán:
  - **Reclamar** un ticket para asignárselo.
  - **Responder** a los comentarios del jugador.
  - **Cerrar** el ticket una vez resuelto.
- Cuando un ticket se actualiza (nuevo comentario, cambio de estado), se envía una notificación al jugador y al administrador correspondiente.

## Personalización

- Puedes editar los archivos en `html/style.css` para cambiar los colores y el aspecto de la interfaz.
- El fichero `fxmanifest.lua` hace referencia a `client/main.lua` y `server/main.lua`. Ajusta la lista de archivos si añades más componentes.
- Si deseas cambiar la tecla que abre el panel, modifica el mapeo en `client/main.lua` (se registra `F9` mediante `RegisterKeyMapping`).

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
