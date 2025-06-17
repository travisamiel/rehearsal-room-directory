class FilterBar extends HTMLElement {
    connectedCallback() {
    // Create filters section
    const filters = document.createElement('div')
    
    // Get unique boroughs and neighborhoods
    const boroughs = [...new Set(Spaces.map(space => space.borough))].sort()
    const neighborhoods = [...new Set(Spaces.map(space => space.neighborhood))].sort()
    const bookingModes = [...new Set(Spaces.map(space => space.modeOfBooking))].sort()
    
    this.innerHTML = `
        <div class="filters">
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
        <input type="text" id="search" placeholder="By name or description">
        </div>
        </div>
    `
    }

}
customElements.define('filter-bar', FilterBar);