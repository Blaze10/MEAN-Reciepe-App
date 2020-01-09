const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const ReciepeController = require('../controllers/reciepe');


router.get('', ReciepeController.getReciepes);

router.post('', authCheck, extractFile, ReciepeController.createReciepe);

router.put('/:id', authCheck, extractFile, ReciepeController.updateReciepe);

// get reciepe by id
router.get('/:id', ReciepeController.getSingleReciepe);


// Delete reciepe
router.delete('/:id', authCheck, ReciepeController.deleteReciepe);

module.exports = router;
