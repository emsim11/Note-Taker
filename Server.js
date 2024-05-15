// Import Dependencies
const Express = require('express');
const HTMLRoutes = require('./Routes/HTML-Routes');
const APIRoutes = require('./Routes/API-Routes');

// Initialize the App and Create a Port
const App = Express();
const PORT = process.env.PORT || 3001;

// Set Up Body Parsing, Static Assets, and Route Middleware
App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));
App.use(Express.static('Public'));
App.use('/', HTMLRoutes);
App.use('/API', APIRoutes);

// Start the Server on the Port
App.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
});