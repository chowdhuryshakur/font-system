# Font Group Management System  

A responsive single-page application for managing font groups with real-time previews and drag-and-drop uploads. Built with **Node.js**, **Express**, and vanilla JavaScript.  

## Features  
✅ **Font Upload**  
- Drag-and-drop or click-to-upload TTF files  
- Real-time validation (TTF only)  

✅ **Font Management**  
- List all uploaded fonts with live previews  
- Delete fonts with confirmation  

✅ **Font Groups**  
- Create groups with 2+ fonts  
- Edit/delete existing groups  
- Responsive table display  

✅ **UX Enhancements**  
- Loading indicators for async operations  
- Toast notifications for errors/success  
- No page reloads (SPA behavior)  

## Tech Stack  
- **Backend**: Node.js, Express, Multer (file uploads)  
- **Frontend**: Vanilla JS, Tailwind CSS  
- **Storage**: Local filesystem (fonts), in-memory DB (groups)  

## Setup  
1. Clone the repo:
   ```bash
   git clone [https://github.com/chowdhuryshakur/font-system.git](https://github.com/chowdhuryshakur/font-system.git)
   ```
3. Install dependencies:
   ```bash
   cd font-group-system
   npm install
   ```
5. Start the server:
   ```bash
   npm run dev
   ```
7. Open http://localhost:5000

## API Endpoints
```bash
**Endpoint**	  **Method** **Description**
/api/fonts	      POST	    Upload a font
/api/fonts	      GET	    List all fonts
/api/fonts/:id	   DELETE	 Delete a font
/api/font-groups  POST	    Create a group
/api/font-groups  GET	    List all groups
```

## Project Structure
```bash
font-group-system/
├── public/          # Frontend assets
│   ├── css/
│   ├── fonts/       # Uploaded fonts storage
│   └── js/
├── server/          # Backend
│   ├── controllers  # All backend controllers
│   ├── routes       # All api routes
│   ├── server.js    # Express app
│   └── uploads/     # Multer temp files
└── README.md
```
