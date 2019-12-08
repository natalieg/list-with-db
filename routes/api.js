const express = require('express');
const router = express.Router();

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const adapter = new FileSync('data/data.json');
const db = low(adapter);

let list = db.get('datatable');

router.get('/', function (req, res, next) {
    res.json(list);
})

// Add new Entry
router.post('/post', function (req, res) {
    let id = parseInt(req.body.id);
    let task = req.body.task;
    let time = parseInt(req.body.time);
    let calcEnd = '';
    let finished = false;
    // not sure about calcend and finished

    db.get('datatable').push({
        id: id,
        task: task,
        time: time,
        finished: finished
    }).write()
    //res.status(200).send("Inserted Data");
    res.redirect('/')
})

// toogle Marked
router.post('/done', function (req, res, next) {
    let id = parseInt(req.body.id);
    let taskState = db.get('datatable').find({ id: id }).value().finished;

    console.log("Toggle status ", id, taskState)

    db.get('datatable')
        .find({ id: id })
        .assign({ finished: !taskState })
        .write()
        res.send('Status changed')
});

// Delete
router.post('/delete', function (req, res, next) {
  
    db.get('datatable')
        .remove({finished: true})
        .write()
        res.send('Finished Deleted')
})


module.exports = router;