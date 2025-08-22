fx_version 'cerulean'
game 'gta5'

author 'Dvstrada'
description 'Sistema de tickets de soporte para QBCore con interfaz F9 para usuarios y administradores.'
version '1.0.0'

lua54 'yes'

client_scripts {
    'client/main.lua'
}

server_scripts {
    'server/main.lua'
}

ui_page 'html/index.html'

files {
    'html/index.html',
    'html/style.css',
    'html/script.js'
}
