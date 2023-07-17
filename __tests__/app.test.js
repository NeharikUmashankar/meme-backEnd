const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");

const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
beforeEach(() => seed(testData));

afterAll(() => {
    if (db.end) db.end();
})

describe("GET api/users", () => {
    test('status 200: returns users', () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({body}) => {
            const {users} = body;
            expect(users).toHaveLength(3);
            

            users.forEach((user) => {
                expect(user).toEqual(
                    expect.objectContaining({
                        username: expect.any(String),
                        name: expect.any(String), 
                        avatar_url: expect.any(String)
                    })
                )
            })
        })
        
    })

    test("status 200: memes", () => {
        return request(app)
          .get("/api/memes")
          .expect(200)
          .then(({body}) => {
            const {memes} = body;
            console.log(memes);
          })
    })

})

describe("GET api/memes/:meme_id,", () => {
  test("Responds with a single meme as per specified ID", () => {
    const ID = 1;
    return request(app)
      .get(`/api/memes/${ID}`)
      .expect(200)
      .then(({ body }) => {
        const { meme } = body;
        console.log(body)

        expect(meme).toEqual({
          meme_id: 1,
          title: "jesseh",
          votes: 4,
          meme_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRpSiXBADmxkVqp_QW_sHd3PM5mBXscQ-EBA&usqp=CAU',
        });
      });
  });
});

describe('POST /api/memes', () => {
    test('status:201, responds with meme newly added to the database', () => {
      const newMeme = {
        title: "M'bloat's aesthetic mogging knows no bounds",
        meme_url: 'https://i.redd.it/sm90hfj385l91.jpg'
      };

      return request(app)
        .post('/api/memes')
        .send(newMeme)
        .expect(201)
        .then(({ body }) => {
            console.log(body.meme)
        //   expect(body.meme).toEqual({
        //     meme_id: 4,
        //     ...newMeme,
        //   });
        });
    });
  });

describe('DELETE /memes/:id', () => {
    test.only('status:204, responds with an empty response body', () => {
      return request(app).delete('/api/memes/2').expect(204);
    });
  });

describe("PATCH /api/memes/:meme_id", () => {
    test("status:200, responds with the updated meme", () => {
      const memeUpdate = { inc_votes: 23, newTitle: 'jese' };
      return request(app)
        .patch("/api/memes/1")
        .send(memeUpdate)
        .expect(200)
        .then(({ body }) => {
          console.log(body , '<<< testing suite')
          expect(body.updatedMeme).toEqual({
            meme_id: 1,
            title: 'jese',
            meme_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRpSiXBADmxkVqp_QW_sHd3PM5mBXscQ-EBA&usqp=CAU", 
            votes: 27
        });
        });
    });

    test("status:200, responds with the updated meme", () => {
      const memeUpdate = { inc_votes: 23};
      return request(app)
        .patch("/api/memes/1")
        .send(memeUpdate)
        .expect(200)
        .then(({ body }) => {
          console.log(body , '<<< testing suite')
          expect(body.updatedMeme).toEqual({
            meme_id: 1,
            title: 'jesseh',
            meme_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRpSiXBADmxkVqp_QW_sHd3PM5mBXscQ-EBA&usqp=CAU", 
            votes: 27
        });
        });
    });
  })

// describe('5. PATCH /api/memes/:meme_id', () => {
//     test('status:200, responds with the updated meme title', () => {
//       const memeUpdate = {
//         meme_title: 
//       };
//       return request(app)
//         .patch('/api/parks/3')
//         .send(parkUpdates)
//         .expect(200)
//         .then(({ body }) => {
//           expect(body.park).toEqual({
//             park_id: 3,
//             year_opened: 1987,
//             ...parkUpdates,
//           });
//         });
//     });
//   });
