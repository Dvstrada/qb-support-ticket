(() => {
  const supportContainer = document.getElementById('supportContainer');
  const btnClose = document.getElementById('btnClose');
  const btnNewTicket = document.getElementById('btnNewTicket');
  const ticketForm = document.getElementById('ticketForm');
  const btnSubmitTicket = document.getElementById('btnSubmitTicket');
  const btnCancelTicket = document.getElementById('btnCancelTicket');
  const ticketListDiv = document.getElementById('ticketList');
  const ticketView = document.getElementById('ticketView');
  const ticketSubject = document.getElementById('ticketSubject');
  const ticketDescription = document.getElementById('ticketDescription');
  const ticketStatus = document.getElementById('ticketStatus');
  const ticketAssigned = document.getElementById('ticketAssigned');
  const messagesDiv = document.getElementById('messages');
  const commentArea = document.getElementById('commentArea');
  const commentInput = document.getElementById('comment');
  const btnSendComment = document.getElementById('btnSendComment');
  const adminActions = document.getElementById('adminActions');
  const btnClaim = document.getElementById('btnClaim');
  const btnCloseTicket = document.getElementById('btnCloseTicket');
  const btnBack = document.getElementById('btnBack');

  let currentTicketId = null;
  let isAdmin = false;
  let tickets = [];

  function post(action, data) {
    fetch(`https://qb-support-ticket/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data || {})
    });
  }

  function renderTicketList() {
    ticketListDiv.innerHTML = '';
    tickets.forEach(ticket => {
      const item = document.createElement('div');
      item.className = 'ticket-item';
      item.dataset.id = ticket.id;
      item.textContent = `#${ticket.id} - ${ticket.subject} (${ticket.status})`;
      item.addEventListener('click', () => {
        showTicket(ticket);
      });
      ticketListDiv.appendChild(item);
    });
  }

  function showTicket(ticket) {
    currentTicketId = ticket.id;
    ticketSubject.textContent = ticket.subject;
    ticketDescription.textContent = ticket.description;
    ticketStatus.textContent = ticket.status;
    ticketAssigned.textContent = (ticket.assigned && ticket.assigned.name) ? ticket.assigned.name : 'Sin asignar';
    messagesDiv.innerHTML = '';
    if (ticket.messages) {
      ticket.messages.forEach(msg => {
        const div = document.createElement('div');
        div.className = 'message';
        const author = document.createElement('span');
        author.className = 'author';
        author.textContent = `${msg.author}: `;
        const content = document.createElement('span');
        content.textContent = msg.message;
        div.appendChild(author);
        div.appendChild(content);
        messagesDiv.appendChild(div);
      });
    }
    // show comment input
    commentArea.classList.remove('hidden');
    commentInput.value = '';
    // admin actions
    if (isAdmin) {
      adminActions.classList.remove('hidden');
      if (ticket.assigned && ticket.assigned.id) {
        btnClaim.textContent = 'Liberar Ticket';
      } else {
        btnClaim.textContent = 'Tomar Ticket';
      }
    } else {
      adminActions.classList.add('hidden');
    }
    // hide list and form
    ticketListDiv.classList.add('hidden');
    btnNewTicket.classList.add('hidden');
    ticketForm.classList.add('hidden');
    ticketView.classList.remove('hidden');
  }

  function resetView() {
    currentTicketId = null;
    ticketView.classList.add('hidden');
    ticketListDiv.classList.remove('hidden');
    btnNewTicket.classList.remove('hidden');
    ticketForm.classList.add('hidden');
  }

  btnClose.addEventListener('click', () => {
    post('close');
  });

  btnNewTicket.addEventListener('click', () => {
    ticketForm.classList.remove('hidden');
    btnNewTicket.classList.add('hidden');
  });

  btnCancelTicket.addEventListener('click', () => {
    ticketForm.classList.add('hidden');
    btnNewTicket.classList.remove('hidden');
  });

  btnSubmitTicket.addEventListener('click', () => {
    const subject = document.getElementById('subject').value;
    const description = document.getElementById('description').value;
    if (subject.trim() !== '' && description.trim() !== '') {
      post('createTicket', { subject, description });
      document.getElementById('subject').value = '';
      document.getElementById('description').value = '';
      ticketForm.classList.add('hidden');
      btnNewTicket.classList.remove('hidden');
    }
  });

  btnSendComment.addEventListener('click', () => {
    const message = commentInput.value;
    if (currentTicketId && message.trim() !== '') {
      post('addComment', { id: currentTicketId, message });
      commentInput.value = '';
    }
  });

  btnClaim.addEventListener('click', () => {
    if (currentTicketId) {
      post('claimTicket', { id: currentTicketId });
    }
  });

  btnCloseTicket.addEventListener('click', () => {
    if (currentTicketId) {
      post('closeTicket', { id: currentTicketId });
    }
  });

  btnBack.addEventListener('click', () => {
    resetView();
  });

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.action === 'open') {
      supportContainer.classList.remove('hidden');
      // Request latest tickets when opening
    } else if (data.action === 'close') {
      supportContainer.classList.add('hidden');
      resetView();
    } else if (data.action === 'updateTickets') {
      tickets = data.tickets || [];
      isAdmin = data.isAdmin || false;
      renderTicketList();
    } else if (data.action === 'updateTicket') {
      const tIndex = tickets.findIndex(t => t.id === data.ticket.id);
      if (tIndex !== -1) {
        tickets[tIndex] = data.ticket;
      } else {
        tickets.push(data.ticket);
      }
      renderTicketList();
      if (currentTicketId === data.ticket.id) {
        showTicket(data.ticket);
      }
    }
  });
})();
