const axios = require('axios');

axios.get('http://localhost:3001/Inventory/personnel')
    .then(response => {
        console.log(response.data); // Log the retrieved personnel data
    })
    .catch(error => {
        console.error(error); // Log any errors
    });
