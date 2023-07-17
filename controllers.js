const {selectUsers, selectMemes, insertMeme, removeMemeByID, updateMemeByID, selectMemeByID} = require('./model')

exports.getUsers = (req, res, next) => {
    selectUsers()
    .then((users) => {
        res.status(200).send({users});
    })
}

//Fetch memes
exports.getMemes = (req, res) => {
    selectMemes()
    .then((memes) => {
        res.status(200).send({memes})
    })
}

exports.postMeme = (req, res) => {
    insertMeme(req.body).then((meme) => res.status(201).send({meme}))
};

exports.getMemeByID = (req, res, next) => {
    const ID = req.params.meme_id;
    console.log(ID)
  
    selectMemeByID(ID)
      .then((meme) => {
        res.status(200).send({ meme });
      })
      .catch((err) => {
        next(err);
      });
  };
  

exports.deleteMemeByID = (req, res) => {
    // const id = Number(req.url.split('/').at(-1));
    console.log(req.params.meme_id, '<<<<<<<<IDs')
    removeMemeByID(req.params.meme_id).then(() => res.status(204).send({}))
};

exports.patchMemeByID = (req, res, next) => {
    updateMemeByID(req.body, req.params.meme_id)
      .then((updatedMeme) => res.status(200).send({ updatedMeme }))
      .catch((err) => {
        next(err);
      });
};





//Post memes:

// .then(({ body }) => {
//     const { users } = body;
//     expect(users).toHaveLength(4);