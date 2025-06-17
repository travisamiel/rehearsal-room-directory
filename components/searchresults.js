class SearchResults extends HTMLElement {
    connectedCallback() {
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
            <h2 class="studio-name">${studio.name} ${getEmoji(studio.modeOfBooking)}</h2>
            <div class="studio-location">${studio.neighborhood}, ${studio.borough}</div>
            <div class="studio-description">${studio.description || 'No description available.'}</div>
            <div class="studio-details">
            <span class="studio-tag">${studio.cost}</span>
            </div>
            <div class="studio-buttons">
                ${studio.iframe ? `
                <button class="calendar-button" data-studio-id="${studio.key}">
                    <span class="calendar-icon">📅</span>
                    View Calendar
                </button>
                ` : ''}
                <a href="${studio.url}" target="_blank" class="studio-link">Visit Website →</a>
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

        function getEmoji(bookingMode) {
        if (bookingMode === "Email") {
            return '📧';
        } else if (bookingMode === "Phone") {
            return '☎️';
        } else if (bookingMode === "Online") {
            return '🌐';
        } else return bookingMode;
        }
    
        this.appendChild(studiosGrid);
        
        // Initial render
        renderStudios(Spaces)
    }
}
customElements.define('search-results', SearchResults);