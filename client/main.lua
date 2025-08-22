local QBCore = exports['qb-core']:GetCoreObject()

local supportOpen = false

RegisterKeyMapping('openSupport', 'Abrir men\u00fa de soporte', 'keyboard', 'F9')

RegisterCommand('openSupport', function()
    if supportOpen then
        supportOpen = false
        SetNuiFocus(false, false)
        SendNUIMessage({action = 'close'})
    else
        supportOpen = true
        SetNuiFocus(true, true)
        SendNUIMessage({action = 'open'})
        TriggerServerEvent('support:getTickets')
    end
end, false)

RegisterNetEvent('support:receiveTickets')
AddEventHandler('support:receiveTickets', function(tickets, isAdmin)
    SendNUIMessage({action = 'updateTickets', tickets = tickets, isAdmin = isAdmin})
end)

RegisterNetEvent('support:updateTicket')
AddEventHandler('support:updateTicket', function(ticket)
    SendNUIMessage({action = 'updateTicket', ticket = ticket})
end)

-- NUI Callbacks
RegisterNUICallback('createTicket', function(data, cb)
    TriggerServerEvent('support:createTicket', data.subject, data.description)
    cb('ok')
end)

RegisterNUICallback('addComment', function(data, cb)
    TriggerServerEvent('support:addComment', data.id, data.message)
    cb('ok')
end)

RegisterNUICallback('claimTicket', function(data, cb)
    TriggerServerEvent('support:claimTicket', data.id)
    cb('ok')
end)

RegisterNUICallback('closeTicket', function(data, cb)
    TriggerServerEvent('support:closeTicket', data.id)
    cb('ok')
end)

RegisterNUICallback('requestTickets', function(_, cb)
    TriggerServerEvent('support:getTickets')
    cb('ok')
end)

RegisterNUICallback('close', function(_, cb)
    supportOpen = false
    SetNuiFocus(false, false)
    cb('ok')
end)
