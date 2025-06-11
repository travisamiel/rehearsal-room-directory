import './style.css'
import Spaces from './allspaces.jsx'

function createStudioDirectory() {
  const app = document.querySelector('#app')
  
  // Create main container
  const container = document.createElement('div')
  container.className = 'container'
  
  // Add header
  const header = document.createElement('header')
  header.className = 'header'
  header.innerHTML = `
    <h1>NYC Rehearsal Studios Directory</h1>
    <p>Find the perfect rehearsal space in New York City</p>
  `
  
  // Create filters section
  const filters = document.createElement('div')
  filters.className = 'filters'
  
  // Get unique boroughs
  const boroughs = [...new Set(Spaces.map(space => space.borough))].sort()
  
  // Initial neighborhoods (all)
  let neighborhoods = [...new Set(Spaces.map(space => space.neighborhood))].sort()
  const bookingModes = [...new Set(Spaces.map(space => space.modeOfBooking))].sort()
  
  // Create filter HTML
  filters.innerHTML = `
    <div class="filter-group">
      <label for="borough">Borough</label>
      <select id="borough">
        <option value="">All Boroughs</option>
        ${boroughs.map(borough => `<option value="${borough}">${borough}</option>`).join('')}
      </select>
    </div>
    
    <div class="filter-group">
      <label for="neighborhood">Neighborhood</label>
      <select id="neighborhood">
        <option value="">All Neighborhoods</option>
        ${neighborhoods.map(neighborhood => `<option value="${neighborhood}">${neighborhood}</option>`).join('')}
      </select>
    </div>
    
    <div class="filter-group">
      <label for="booking">Booking Method</label>
      <select id="booking">
        <option value="">Any Method</option>
        ${bookingModes.map(mode => `<option value="${mode}">${mode}</option>`).join('')}
      </select>
    </div>
    
    <div class="filter-group">
      <label for="cost">Cost</label>
      <select id="cost">
        <option value="">Any Cost</option>
        <option value="Cheap">Cheap</option>
        <option value="Not Cheap">Not Cheap</option>
      </select>
    </div>
    
    <div class="filter-group">
      <label for="search">Search</label>
      <input type="text" id="search" placeholder="Search by name or description">
    </div>
  `
  
  // Create studios grid
  const studiosGrid = document.createElement('div')
  studiosGrid.className = 'studios-grid'
  
  // Create calendar dialog
  const dialog = document.createElement('dialog')
  dialog.className = 'calendar-dialog'
  dialog.innerHTML = `
    <div class="dialog-content">
      <div class="dialog-header">
        <h2 class="dialog-title"></h2>
        <button class="close-button">&times;</button>
      </div>
      <div class="calendar-container"></div>
    </div>
  `
  document.body.appendChild(dialog)
  
  // Close dialog when clicking close button
  dialog.querySelector('.close-button').addEventListener('click', () => {
    dialog.close()
  })
  
  // Add everything to the container
  container.appendChild(header)
  container.appendChild(filters)
  container.appendChild(studiosGrid)
  app.appendChild(container)
  
  // Function to update neighborhood options based on selected borough
  function updateNeighborhoods(selectedBorough) {
    const neighborhoodSelect = document.getElementById('neighborhood')
    const filteredNeighborhoods = selectedBorough
      ? [...new Set(Spaces.filter(space => space.borough === selectedBorough)
          .map(space => space.neighborhood))].sort()
      : [...new Set(Spaces.map(space => space.neighborhood))].sort()
    
    neighborhoodSelect.innerHTML = `
      <option value="">All Neighborhoods</option>
      ${filteredNeighborhoods.map(neighborhood => 
        `<option value="${neighborhood}">${neighborhood}</option>`
      ).join('')}
    `
    // Reset neighborhood selection when borough changes
    neighborhoodSelect.value = ''
  }
  
  // Function to show calendar dialog
  function showCalendarDialog(studio) {
    const dialog = document.querySelector('.calendar-dialog')
    dialog.querySelector('.dialog-title').textContent = `${studio.name} Calendar`
    dialog.querySelector('.calendar-container').innerHTML = studio.iframe
    dialog.showModal()
  }
  
  // Filter and render functions
  function filterStudios() {
    const borough = document.getElementById('borough').value
    const neighborhood = document.getElementById('neighborhood').value
    const booking = document.getElementById('booking').value
    const cost = document.getElementById('cost').value
    const search = document.getElementById('search').value.toLowerCase()
    
    const filteredSpaces = Spaces.filter(space => {
      return (!borough || space.borough === borough) &&
             (!neighborhood || space.neighborhood === neighborhood) &&
             (!booking || space.modeOfBooking === booking) &&
             (!cost || space.cost === cost) &&
             (!search || 
              space.name.toLowerCase().includes(search) ||
              space.description.toLowerCase().includes(search))
    })
    
    renderStudios(filteredSpaces)
  }
  
  function renderStudios(studios) {
    studiosGrid.innerHTML = studios.length ? studios.map(studio => `
      <div class="studio-card">
        <h2 class="studio-name">${studio.name}</h2>
        <div class="studio-location">${studio.neighborhood}, ${studio.borough}</div>
        <div class="studio-description">${studio.description || 'No description available.'}</div>
        <div class="studio-details">
          <span class="studio-tag">${studio.modeOfBooking}</span>
          <span class="studio-tag">${studio.cost}</span>
        </div>
        <div class="studio-buttons">
          <a href="${studio.url}" target="_blank" class="studio-link">Visit Website</a>
          ${studio.iframe ? `
            <button class="calendar-button" data-studio-id="${studio.key}">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2H4C2.89543 2 2 2.89543 2 4V12C2 13.1046 2.89543 14 4 14H12C13.1046 14 14 13.1046 14 12V4C14 2.89543 13.1046 2 12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 6H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 2V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              View Calendar
            </button>
          ` : ''}
        </div>
      </div>
    `).join('') : '<div class="no-results">No studios found matching your criteria</div>'

    // Add click handlers for calendar buttons
    const calendarButtons = document.querySelectorAll('.calendar-button')
    calendarButtons.forEach(button => {
      button.addEventListener('click', () => {
        const studioId = parseInt(button.dataset.studioId)
        const studio = studios.find(s => s.key === studioId)
        if (studio) {
          showCalendarDialog(studio)
        }
      })
    })
  }
  
  // Add event listeners
  document.getElementById('borough').addEventListener('change', (e) => {
    updateNeighborhoods(e.target.value)
    filterStudios()
  })
  document.getElementById('neighborhood').addEventListener('change', filterStudios)
  document.getElementById('booking').addEventListener('change', filterStudios)
  document.getElementById('cost').addEventListener('change', filterStudios)
  document.getElementById('search').addEventListener('input', filterStudios)
  
  // Initial render
  renderStudios(Spaces)
}

// Initialize the directory
createStudioDirectory()