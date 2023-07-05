const e = require("express");
const { query } = require("./db/connection");
const db = require("./db/connection");

exports.selectUsers = (req, res) => {
    return db.query("SELECT * FROM users;").then(({rows}) => {return rows;})
}

exports.selectMemes = () => {
    return db.query("SELECT * FROM  memes;")
    .then(({rows}) => {return rows;})
}

exports.insertMeme = (memeBody) => {
    const {title, meme_url} = memeBody;

    return db.query(`INSERT INTO memes (title, meme_url, votes) 
    VALUES ($1, $2, $3) RETURNING *;`,
    [title, meme_url, 0])
    .then(({rows}) => {
        return rows[0]
    })
}

exports.selectMemeByID = (ID) => {
    if (Number(ID) === NaN) {
      return Promise.reject({ status: 400, msg: "Bad request" });
    }
  
    return db
      .query(
        `
      SELECT * FROM memes WHERE meme_id = $1;`,
        [ID]
      )
  
      .then(({ rows }) => {
        if (rows.length === 0)
          return Promise.reject({ status: 404, message: "Path not found" });
        else return rows[0];
      });
  };
  

exports.removeMemeByID = (memeID) => {
    return db.query('DELETE FROM memes where meme_id = $1 RETURNING *;', [memeID])
    .then((info) => {return db.query("SELECT * FROM memes;")})
    .then(({rows}) => {remainingMemes = rows})
    
}

exports.updateMemeByID = (update, ID) => {
    const {inc_votes, newTitle} = update;
    console.log(inc_votes, newTitle, '<<<< model file')

    if (inc_votes && newTitle) {
        return db.query(`
        UPDATE memes
        SET title = $1, votes = votes + $2
        WHERE meme_id = $3
        RETURNING *`, [newTitle, inc_votes, ID])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'ID not found'})
            }
            else return rows[0];
        })

    } else if (inc_votes && ! newTitle) {   
        return db.query(`
        UPDATE memes
        SET votes = votes + $1
        WHERE meme_id = $2
        RETURNING *`, [inc_votes, ID])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'ID not found'})
            }
            else return rows[0];
        })  
    } else {
        return db.query(`
        UPDATE memes
        SET title = $1
        WHERE meme_id = $2
        RETURNING *`, [newTitle, ID])
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({status: 404, msg: 'ID not found'})
            }
            else return rows[0];
        })  
    }
}