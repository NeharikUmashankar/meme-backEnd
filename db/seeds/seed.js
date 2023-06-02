const db = require("../connection");
const format = require("pg-format");
const {
	convertTimestampToDate,
	createRef,
	formatComments,
} = require("./utils");



const seed = async (data) => {
	const { commentData, memeData } = data;
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS memes;`);


    await db.query(`
  CREATE TABLE memes (
    meme_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL, 
    meme_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    created_at TIMESTAMP DEFAULT NOW(),
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    meme_id INT REFERENCES memes(meme_id) NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
  );`);

  const formattedMemeData = memeData.map(convertTimestampToDate);

  const insertMemesQueryStr = format(
    "INSERT INTO reviews (title, meme_url, created_at, votes) VALUES %L RETURNING *;",
    formattedMemeData.map(({title, meme_url, created_at, votes}) =>[title, meme_url, created_at, votes])
  )

  const memeRows = await db.query(insertMemesQueryStr).then((result) => result.rows);
  const memeIdLookup = createRef(memeRows, "title", "meme_id");
  const formattedCommentData = formatComments(commentData, memeIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments(body, meme_id, votes, created_at) VALUES %L, RETURNING *;",
    formattedCommentData.map(({body, meme_id, votes = 0, created_at}) => {body, meme_id, votes, created_at})

  );

  return db.query(insertCommentsQueryStr).then((result)=> {return result.rows;});

}

module.exports = seed;

