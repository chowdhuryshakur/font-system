document.addEventListener('DOMContentLoaded', () => {
    //global fonts variable
    let globalFonts = []

    //Font Upload Functionality
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('font-upload');
    
    //Handle click on drop zone
    dropZone.addEventListener('click', () => {
      fileInput.click();
    });
    
    //Handle file selection
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length) {
        uploadFont(e.target.files[0]);
      }
    });
    
    //Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropZone.classList.add('border-blue-400', 'bg-blue-50');
    }
    
    function unhighlight() {
      dropZone.classList.remove('border-blue-400', 'bg-blue-50');
    }
    
    //Handle dropped files
    dropZone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const file = dt.files[0];
      
      if (file && file.name.endsWith('.ttf')) {
        uploadFont(file);
      } else {
        alert('Only .ttf files are allowed');
      }
    });


    //Dynamic font loading for preview
    function loadFontForPreview(font) {
        const fontFace = new FontFace(font.name, `url(${font.path})`);
        
        fontFace.load()
            .then(() => {
            document.fonts.add(fontFace);
            //Update preview elements with this font
            document.querySelectorAll(`.font-preview[data-font="${font.id}"]`)
                .forEach(el => {
                el.style.fontFamily = font.name;
                });
            })
            .catch(err => {
            console.error(`Failed to load font ${font.name} for preview:`, err);
            //Show a fallback style for failed fonts
            document.querySelectorAll(`.font-preview[data-font="${font.id}"]`)
                .forEach(el => {
                el.style.fontFamily = 'sans-serif';
                el.style.opacity = '0.7';
                });
            });
        }
    
    //load all fonts
      async function loadFonts() {
        const loader = document.getElementById('upload-loader');
        loader.style.display = 'block'; 
        try {
        const response = await fetch('/api/fonts');
        if (response.ok) {
            const loadedFonts = await response.json();
            globalFonts = [...loadedFonts]; //Update global fonts array
            renderFonts(loadedFonts);
            
            //Load all fonts for preview
            loadedFonts.forEach(font => {
            loadFontForPreview(font);
            });
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to load fonts');
        }
        } catch (err) {
        console.error('Failed to load fonts:', err);
        alert('Network error: Failed to load fonts');
        } finally {
            loader.style.display = 'none';
        }
    }
    
    //Upload font to server
    async function uploadFont(file) {  
      const loader = document.getElementById('upload-loader');
      loader.style.display = 'block'; 
      const formData = new FormData();
      formData.append('font', file);
      
      try {
        const response = await fetch('/api/fonts', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const font = await response.json();
          alert(`Font "${font.name}" uploaded successfully!`);
          loadFonts(); //Refresh font list
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to upload font');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Network error: Failed to upload font');
      } finally {
        loader.style.display = 'none';
      }
    }

    async function deleteFont(fontId) {
        if (!confirm('Are you sure you want to delete this font?')) return;
        //showLoader();
        try {
        const response = await fetch(`/api/fonts/${fontId}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Font deleted successfully!');
            loadFonts(); //Refresh font list
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to delete font');
        }
        } catch (err) {
        console.error('Delete error:', err);
        alert('Network error: Failed to delete font');
        } finally {
        //hideLoader();
        }
    }
    
    //Render fonts in the table
    function renderFonts(fonts) {
        const fontsList = document.getElementById('fonts-list');
        fontsList.innerHTML = '';
        
        fonts.forEach(font => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${font.name}</td>
            <td class="py-2 px-4 border-b">
                <p class="font-preview" data-font="${font.id}" style="font-family: '${font.name}'">Example Style</p>
            </td>
            <td class="py-2 px-4 border-b">
                <button class="text-red-500 hover:text-red-700 delete-font" data-id="${font.id}"><svg fill="#f23636" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#f23636"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M432,96h-48V32c0-17.672-14.328-32-32-32H160c-17.672,0-32,14.328-32,32v64H80c-17.672,0-32,14.328-32,32v32h416v-32 C464,110.328,449.672,96,432,96z M192,96V64h128v32H192z"></path> <path d="M80,480.004C80,497.676,94.324,512,111.996,512h288.012C417.676,512,432,497.676,432,480.008v-0.004V192H80V480.004z M320,272c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M240,272 c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M160,272c0-8.836,7.164-16,16-16 s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z"></path> </g> </g></svg></button>
            </td>
        `;
        fontsList.appendChild(row);
        });
        
        //event listeners to delete buttons
        document.querySelectorAll('.delete-font').forEach(button => {
        button.addEventListener('click', (e) => {
            const fontId = e.currentTarget.getAttribute('data-id');
            deleteFont(fontId);
        });
        });
    }
    
    //Initialize the page
    loadFonts();

    //Font Group Creation Functionality
    let fontGroupRows = 1;

    document.getElementById('add-row-btn').addEventListener('click', () => {
        addFontGroupRow();
    });

    function addFontGroupRow(fontId = '') {
        const rowsContainer = document.getElementById('font-group-rows');
        const rowId = `font-row-${fontGroupRows}`;
        
        const row = document.createElement('div');
        row.className = 'font-group-row mb-4 p-4 border rounded';
        row.id = rowId;
        
        //Generate options HTML from current fonts array
        const optionsHtml = globalFonts.map(font => 
          `<option value="${font.id}" ${fontId === font.id ? 'selected' : ''}>${font.name}</option>`
        ).join('');
        
        row.innerHTML = `
          <div class="flex items-center mb-2">
            <label class="mr-2">Font Name</label>
            <button class="ml-auto text-red-500 delete-row" data-row="${rowId}">X</button>
          </div>
          <select class="font-select w-full px-3 py-2 border rounded mb-2">
            <option value="">Select a Font</option>
            ${optionsHtml}
          </select>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block mb-1">Specific Size</label>
              <input type="number" class="size-input w-full px-3 py-2 border rounded" value="1.00" step="0.01" min="0.1" disabled>
            </div>
            <div>
              <label class="block mb-1">Price Change</label>
              <input type="number" class="price-input w-full px-3 py-2 border rounded" value="0" disabled>
            </div>
          </div>
        `;
        
        rowsContainer.appendChild(row);
        fontGroupRows++;
        
        //event listeners
        row.querySelector('.delete-row').addEventListener('click', (e) => {
          e.target.closest('.font-group-row').remove();
          validateGroupForm();
        });
        
        row.querySelector('.font-select').addEventListener('change', validateGroupForm);
    }

    //Validate group form
    function validateGroupForm() {
    const selectedFonts = Array.from(document.querySelectorAll('.font-select'))
        .map(select => select.value)
        .filter(Boolean);
    
    const validationMsg = document.getElementById('group-validation');
    
    if (selectedFonts.length < 2) {
        validationMsg.classList.remove('hidden');
        return false;
    } else {
        validationMsg.classList.add('hidden');
        return true;
    }
    }

    //Create font group
    document.getElementById('create-group-btn').addEventListener('click', async () => {
    if (!validateGroupForm()) return;
    
    const title = document.getElementById('group-title').value.trim();
    const fontIds = Array.from(document.querySelectorAll('.font-select'))
        .map(select => select.value)
        .filter(Boolean);
    //showLoader()
    try {
        const response = await fetch('/api/font-groups', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title,
            fonts: fontIds
        })
        });
        
        if (response.ok) {
        const group = await response.json();
        alert(`Group "${group.title}" created successfully!`);
        loadFontGroups();
        resetGroupForm();
        } else {
        const error = await response.json();
        alert(error.error || 'Failed to create group');
        }
    } catch (err) {
        console.error('Group creation error:', err);
        alert('Network error: Failed to create group');
    } finally {
        //hideLoader();
    }
    });

    //Reset group form
    function resetGroupForm() {
    document.getElementById('group-title').value = '';
    document.getElementById('font-group-rows').innerHTML = '';
    fontGroupRows = 1;
    }

    //Load and render font groups
    async function loadFontGroups() {
    try {
        const response = await fetch('/api/font-groups');
        if (response.ok) {
        const groups = await response.json();
        renderFontGroups(groups);
        }
    } catch (err) {
        console.error('Failed to load font groups:', err);
    }
    }

    function renderFontGroups(groups) {
        const groupsList = document.getElementById('groups-list');
        groupsList.innerHTML = '';
        
        groups.forEach(group => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';
        row.innerHTML = `
            <td class="py-2 px-4 border-b">${group.title}</td>
            <td class="py-2 px-4 border-b">${group.fonts.map(f => f.name).join(', ')}</td>
            <td class="py-2 px-4 border-b">${group.fonts.length}</td>
            <td class="py-2 px-4 border-b">
                <button class="text-blue-500 hover:text-blue-700 edit-group mr-2" data-id="${group.id}"><svg viewBox="0 0 24.00 24.00" fill="none" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg" stroke="#fcfcfc" stroke-width="0.384"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M21.1213 2.70705C19.9497 1.53548 18.0503 1.53547 16.8787 2.70705L15.1989 4.38685L7.29289 12.2928C7.16473 12.421 7.07382 12.5816 7.02986 12.7574L6.02986 16.7574C5.94466 17.0982 6.04451 17.4587 6.29289 17.707C6.54127 17.9554 6.90176 18.0553 7.24254 17.9701L11.2425 16.9701C11.4184 16.9261 11.5789 16.8352 11.7071 16.707L19.5556 8.85857L21.2929 7.12126C22.4645 5.94969 22.4645 4.05019 21.2929 2.87862L21.1213 2.70705ZM18.2929 4.12126C18.6834 3.73074 19.3166 3.73074 19.7071 4.12126L19.8787 4.29283C20.2692 4.68336 20.2692 5.31653 19.8787 5.70705L18.8622 6.72357L17.3068 5.10738L18.2929 4.12126ZM15.8923 6.52185L17.4477 8.13804L10.4888 15.097L8.37437 15.6256L8.90296 13.5112L15.8923 6.52185ZM4 7.99994C4 7.44766 4.44772 6.99994 5 6.99994H10C10.5523 6.99994 11 6.55223 11 5.99994C11 5.44766 10.5523 4.99994 10 4.99994H5C3.34315 4.99994 2 6.34309 2 7.99994V18.9999C2 20.6568 3.34315 21.9999 5 21.9999H16C17.6569 21.9999 19 20.6568 19 18.9999V13.9999C19 13.4477 18.5523 12.9999 18 12.9999C17.4477 12.9999 17 13.4477 17 13.9999V18.9999C17 19.5522 16.5523 19.9999 16 19.9999H5C4.44772 19.9999 4 19.5522 4 18.9999V7.99994Z" fill="#0a5ecd"></path> </g></svg></button>
                
                <button class="text-red-500 hover:text-red-700 delete-group" data-id="${group.id}"><svg fill="#f23636" height="20px" width="20px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve" stroke="#f23636"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M432,96h-48V32c0-17.672-14.328-32-32-32H160c-17.672,0-32,14.328-32,32v64H80c-17.672,0-32,14.328-32,32v32h416v-32 C464,110.328,449.672,96,432,96z M192,96V64h128v32H192z"></path> <path d="M80,480.004C80,497.676,94.324,512,111.996,512h288.012C417.676,512,432,497.676,432,480.008v-0.004V192H80V480.004z M320,272c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M240,272 c0-8.836,7.164-16,16-16s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z M160,272c0-8.836,7.164-16,16-16 s16,7.164,16,16v160c0,8.836-7.164,16-16,16s-16-7.164-16-16V272z"></path> </g> </g></svg></button>
            </td>
        `;
        groupsList.appendChild(row);
        });
        
        //event listeners to delete buttons
        document.querySelectorAll('.delete-group').forEach(button => {
        button.addEventListener('click', (e) => {
            const groupId = e.currentTarget.getAttribute('data-id');
            deleteFontGroup(groupId);
        });
        });
        
        //event listeners to edit buttons
        document.querySelectorAll('.edit-group').forEach(button => {
        button.addEventListener('click', (e) => {
            const groupId = e.currentTarget.getAttribute('data-id');
            editFontGroup(groupId);
        });
        });
    }

    //Delete font group
    async function deleteFontGroup(groupId) {
    if (!confirm('Are you sure you want to delete this group?')) return;
    //showLoader()
    try {
        const response = await fetch(`/api/font-groups/${groupId}`, {
        method: 'DELETE'
        });
        
        if (response.ok) {
        alert('Group deleted successfully!');
        loadFontGroups();
        } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete group');
        }
    } catch (err) {
        console.error('Group deletion error:', err);
        alert('Network error: Failed to delete group');
    } finally {
        //hideLoader();
    }
    }

    // Modal functions
    function openEditModal(group) {
        const modal = document.getElementById('edit-group-modal');
        document.getElementById('edit-group-title').value = group.title;
        
        // Clear existing rows
        const rowsContainer = document.getElementById('edit-group-rows');
        rowsContainer.innerHTML = '';
        
        // Add rows for each font in the group
        group.fonts.forEach(font => {
        addEditGroupRow(font.id);
        });
        
        // Store current group ID
        modal.dataset.groupId = group.id;
        modal.classList.remove('hidden');
    }
  
    function closeEditModal() {
        document.getElementById('edit-group-modal').classList.add('hidden');
    }
  
    // Add row to edit modal
    function addEditGroupRow(fontId = '') {
        const rowsContainer = document.getElementById('edit-group-rows');
        const row = document.createElement('div');
        row.className = 'edit-group-row mb-4 p-4 border rounded';
        
        // Generate options HTML from current fonts array
        const optionsHtml = globalFonts.map(font => 
        `<option value="${font.id}" ${fontId === font.id ? 'selected' : ''}>${font.name}</option>`
        ).join('');
        
        row.innerHTML = `
        <div class="flex items-center mb-2">
            <label class="mr-2">Font Name</label>
            <button class="ml-auto text-red-500 delete-edit-row">X</button>
        </div>
        <select class="edit-font-select w-full px-3 py-2 border rounded mb-2">
            <option value="">Select a Font</option>
            ${optionsHtml}
        </select>
        <div class="grid grid-cols-2 gap-4">
            <div>
            <label class="block mb-1">Specific Size</label>
            <input type="number" class="edit-size-input w-full px-3 py-2 border rounded" value="1.00" step="0.01" min="0.1" disabled>
            </div>
            <div>
            <label class="block mb-1">Price Change</label>
            <input type="number" class="edit-price-input w-full px-3 py-2 border rounded" value="0" disabled>
            </div>
        </div>
        `;
        
        rowsContainer.appendChild(row);
        
        // Add event listeners
        row.querySelector('.delete-edit-row').addEventListener('click', () => {
        row.remove();
        });
    }
  
    // Update the editGroup function
    async function editFontGroup(groupId) {
        // showLoader('Loading group data...');
        try {
        const response = await fetch(`/api/font-groups/${groupId}`);
        if (response.ok) {
            const group = await response.json();
            openEditModal(group);
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to load group for editing');
        }
        } catch (err) {
        console.error('Failed to load group for editing:', err);
        alert('Network error: Failed to load group for editing');
        } finally {
        //  hideLoader();
        }
    }
  
  // Add event listeners for modal
  document.getElementById('close-edit-modal').addEventListener('click', closeEditModal);
  document.getElementById('add-edit-row-btn').addEventListener('click', () => addEditGroupRow());
  
  // Update group functionality
  document.getElementById('update-group-btn').addEventListener('click', async () => {
    const modal = document.getElementById('edit-group-modal');
    const groupId = modal.dataset.groupId;
    const title = document.getElementById('edit-group-title').value.trim();
    const fontIds = Array.from(document.querySelectorAll('.edit-font-select'))
      .map(select => select.value)
      .filter(Boolean);
    
    if (fontIds.length < 2) {
      alert('You must select at least two fonts');
      return;
    }
    
        // showLoader('Updating group...');
        try {
        const response = await fetch(`/api/font-groups/${groupId}`, {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({
            title,
            fonts: fontIds
            })
        });
        
        if (response.ok) {
            const group = await response.json();
            alert(`Group "${group.title}" updated successfully!`);
            loadFontGroups();
            closeEditModal();
        } else {
            const error = await response.json();
            alert(error.error || 'Failed to update group');
        }
        } catch (err) {
        console.error('Update error:', err);
        alert('Network error: Failed to update group');
        } finally {
            // hideLoader();
        }
    });

    //Initialize the page with one font group row
    loadFontGroups();
});