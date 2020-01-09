const Reciepe = require('../models/reciepe');

exports.getReciepes = (req, res, next) => {
  const currentPageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const findQuery = Reciepe.find({ 'isActive': true }, null, {sort: '-created_on'});
  let fetchedReciepes;
  if (currentPageSize && currentPage) {
    findQuery.skip(currentPageSize * (currentPage - 1)).limit(currentPageSize);
  }
  findQuery.then(documents => {
    fetchedReciepes = documents;
    return Reciepe.countDocuments();
  })
    .then(count => {
      res.status(200).json({
        reciepes: fetchedReciepes,
        message: 'Reciepes fetched successfully',
        maxCount: count
      });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Failed to fetch documents'
      });
    });
};

exports.createReciepe = (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const reciepe = new Reciepe({
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    imagePath: url + '/images/' + req.file.filename,
    createdBy: req.userData.userId
  });
  reciepe.save()
    .then(response => {
      res.status(201).json({
        message: 'Success, Reciepe Created!'
      });
    })
    .catch(err => {
      res.status(404).json({
        message: 'Post creation failed'
      });
    });
};

exports.updateReciepe = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (typeof imagePath !== 'string') {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const reciepe = new Reciepe({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    type: req.body.type,
    imagePath: imagePath
  });
  Reciepe.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, reciepe)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Reciepe updated',
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized'
        })
      }

    })
    .catch(err => {
      res.status(404).json({
        message: 'Some server side error occred',
      });
    });
};

exports.getSingleReciepe = (req, res, next) => {
  Reciepe.findById(req.params.id)
    .then((fetchedReciepe) => {
      res.status(200).json({
        reciepe: fetchedReciepe
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: 'Reciepe not with given id not found'
      });
    });
};

exports.deleteReciepe = (req, res, next) => {
  Reciepe.deleteOne({ _id: req.params.id, createdBy: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({
          message: 'Reciepe Deleted successfully',
        });
      } else {
        res.status(401).json({
          message: 'Unauthorized'
        })
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: 'Failed to delete reciepe'
      });
    })
};
