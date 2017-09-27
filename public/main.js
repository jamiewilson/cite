// Load all quotes from the database
getAllQuotes()

// FETCH from /quotes and append to DOM
function getAllQuotes() {
  fetch('/quotes')
  .then(quotes => quotes.json())
  .then(quotes => {
    const quotesList = document.querySelector('.js-quotes-list')
    const sortedQuotes = quotes.sort((a, b) => a.time < b.time ? 1 : -1)
    quotesList.innerHTML = ''
    sortedQuotes.forEach(quote => {
      quotesList.innerHTML += `
        <li>
          <span class="delete js-delete" data-id="${quote.quoteId}">×</span>
          <div class="body">${quote.body}</div>
          ${quote.link 
            ? `<a class="source link" href="${quote.link}">${quote.source}</a>` 
            : `<span class="source">${quote.source}</span>`
          }
        </li>
      `
    })
  })

  // Then add eventListeners to all delete buttons
  .then(() => {
    const deleteButtons = document.querySelectorAll('.js-delete')
    deleteButtons.forEach(button => {
      button.addEventListener('click', () => confirmDelete(button))
    })
  })
}

// POST the form inputs to /quotes with params
const form = document.querySelector('.js-form')
form.addEventListener('submit', e => {
  e.preventDefault()
  const body = document.querySelector('.js-body').value.trim()
  const source = document.querySelector('.js-source').value.trim()
  const link = document.querySelector('.js-link').value.trim()
  const time = Date.now()
  const params = new URLSearchParams(Object.entries({ body, source, link, time }))
  fetch('/quotes?' + params, { method: 'POST' }).then(() => afterSubmit())
})

// Reruns getAllQuotes and resets and focuses the form
function afterSubmit() {
  getAllQuotes()
  form.reset()
  form.elements[0].focus()
}

// Make sure the user really wants to delete this
function confirmDelete(button) {
  button.classList.add('confirm')
  button.addEventListener('click', deleteQuote)
  setTimeout(() => {
    button.classList.remove('confirm')
    button.removeEventListener('click', deleteQuote)
  }, 2000)
}

// Actually remove it from the db and remove dom element
function deleteQuote() {
  const quoteEl = this.parentNode
  const quoteId = this.getAttribute('data-id')
  const params = new URLSearchParams(Object.entries({ quoteId }))
  fetch('/delete?' + params, { method: 'POST' })
    .then(() => {
      quoteEl.classList.add('fadeOut-300ms')
      setTimeout(() => quoteEl.parentNode.removeChild(quoteEl), 300)
    }) 
}

// Reset the database to the default data
const restore = document.querySelector('.js-restore')
restore.addEventListener('click', () => fetch('/restore').then(() => getAllQuotes()))
