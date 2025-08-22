local QBCore = exports['qb-core']:GetCoreObject()

local Tickets = {}
local TicketCounter = 0

local function isAdmin(src)
    return QBCore.Functions.HasPermission(src, 'admin') or QBCore.Functions.HasPermission(src, 'god')
end

local function getPlayerTickets(src)
    local admin = isAdmin(src)
    local list = {}
    for id, ticket in pairs(Tickets) do
        if admin or ticket.createdBy == src then
            table.insert(list, ticket)
        end
    end
    return list
end

RegisterServerEvent('support:getTickets')
AddEventHandler('support:getTickets', function()
    local src = source
    TriggerClientEvent('support:receiveTickets', src, getPlayerTickets(src), isAdmin(src))
end)

RegisterServerEvent('support:createTicket')
AddEventHandler('support:createTicket', function(subject, description)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    if not Player then return end
    TicketCounter = TicketCounter + 1
    local id = TicketCounter
    Tickets[id] = {
        id = id,
        subject = subject,
        description = description,
        status = 'open',
        createdBy = src,
        creatorName = Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname,
        assigned = nil,
        messages = {}
    }
    -- Send updated tickets to user
    TriggerClientEvent('support:receiveTickets', src, getPlayerTickets(src), false)
    -- Update all admins
    for _, v in ipairs(QBCore.Functions.GetPlayers()) do
        if isAdmin(v) then
            TriggerClientEvent('support:receiveTickets', v, getPlayerTickets(v), true)
        end
    end
end)

RegisterServerEvent('support:claimTicket')
AddEventHandler('support:claimTicket', function(id)
    local src = source
    if not isAdmin(src) then return end
    local ticket = Tickets[id]
    if ticket and not ticket.assigned then
        ticket.assigned = src
        ticket.status = 'claimed'
        -- Notify participants
        local participants = {ticket.createdBy, src}
        for _, p in ipairs(participants) do
            if p then TriggerClientEvent('support:updateTicket', p, ticket) end
        end
    end
end)

RegisterServerEvent('support:addComment')
AddEventHandler('support:addComment', function(id, message)
    local src = source
    local ticket = Tickets[id]
    if not ticket then return end
    if ticket.createdBy ~= src and not isAdmin(src) then return end
    local Player = QBCore.Functions.GetPlayer(src)
    local name = Player and (Player.PlayerData.charinfo.firstname .. ' ' .. Player.PlayerData.charinfo.lastname) or ('ID ' .. tostring(src))
    table.insert(ticket.messages, {
        author = name,
        authorId = src,
        message = message,
        time = os.time()
    })
    local participants = {ticket.createdBy}
    if ticket.assigned then table.insert(participants, ticket.assigned) end
    for _, p in ipairs(participants) do
        if p then TriggerClientEvent('support:updateTicket', p, ticket) end
    end
end)

RegisterServerEvent('support:closeTicket')
AddEventHandler('support:closeTicket', function(id)
    local src = source
    local ticket = Tickets[id]
    if not ticket then return end
    if ticket.createdBy ~= src and not isAdmin(src) then return end
    ticket.status = 'closed'
    local participants = {ticket.createdBy}
    if ticket.assigned then table.insert(participants, ticket.assigned) end
    for _, p in ipairs(participants) do
        if p then TriggerClientEvent('support:updateTicket', p, ticket) end
    end
end)
