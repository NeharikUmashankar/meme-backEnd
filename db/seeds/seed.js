const db = require("../connection");
const format = require("pg-format");
const {
	convertTimestampToDate,
	createRef,
	formatComments,
} = require("./utils");



const seed = async (data) => {
	const { commentData, memeData, userData } = data;
	await db.query(`DROP TABLE IF EXISTS comments;`);
	await db.query(`DROP TABLE IF EXISTS memes;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR
  );`);
  
    await db.query(`
  CREATE TABLE memes (
    meme_id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL, 
    meme_url VARCHAR DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
    votes INT DEFAULT 0 NOT NULL
  );`);

  await db.query(`
  CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    body VARCHAR NOT NULL,
    votes INT DEFAULT 0 NOT NULL,
    author VARCHAR NOT NULL,
    meme_id INT REFERENCES memes(meme_id) NOT NULL
  );`);

  const insertUsersQueryStr = format(
		"INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *;",
		userData.map(({ username, name, avatar_url }) => [
			username,
			name,
			avatar_url,
		])
	);

  const usersPromise = await db
		.query(insertUsersQueryStr)
		.then((result) => result.rows);

  
  const formattedMemeData = memeData.map(convertTimestampToDate);

  const insertMemesQueryStr = format(
    "INSERT INTO memes (title, meme_url, votes) VALUES %L RETURNING *;",
    formattedMemeData.map(({title, meme_url, votes}) =>[title, meme_url, votes])
  )

  const memeRows = await db.query(insertMemesQueryStr).then((result) => result.rows);
  const memeIdLookup = createRef(memeRows, "title", "meme_id");
  const formattedCommentData = formatComments(commentData, memeIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments(body, votes, author, meme_id) VALUES %L RETURNING *;",
    formattedCommentData.map(({body, votes = 0, author, meme_id}) => [body, votes, author, meme_id])

  );

  return db.query(insertCommentsQueryStr).then((result)=> {return result.rows;});

}

module.exports = seed;

