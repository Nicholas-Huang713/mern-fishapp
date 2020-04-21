const express = require("express");
const app = express();
const db = require('./models');
const path = require('path');
const PORT = process.env.PORT || 5005;
// const bodyParser = require('body-parser');

app.use(express.urlencoded({extended: true}));
app.use(express.json());

const apiRoutes = require("./routes/apiRoutes");
app.use('/api', apiRoutes);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}

app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname, './client/build/index.html'), function(err) {
      if (err) {
        res.status(500).send(err)
      }
    })
});

db.sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
}); 