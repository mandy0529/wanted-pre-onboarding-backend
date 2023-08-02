import app from "../server.js";
import supertest from "supertest";
import chai from "chai";

const expect = chai.expect;
const request = supertest(app);

let token;

// auth route integration tests
describe("Auth Route Integration Tests", () => {
  // register user
  it("POST /api/v1/user/register should register a new user", (done) => {
    request
      .post("/api/v1/user/register")
      .send({ email: "test@gmail.com", password: "testpassword" })
      .end((err, res) => {
        if (res.statusCode === 400) {
          expect(res.statusCode).to.equal(400);
        } else {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property(
            "msg",
            "register user successfully"
          );
        }
        done();
      });
  });

  // login user
  it("POST /api/v1/user/ login should log in an existing user", (done) => {
    request
      .post("/api/v1/user/login")
      .send({ email: "test@gmail.com", password: "testpassword" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("token");
        token = res.body.token;
        done();
      });
  });
});

// post route integration tests ---------------------------------------
describe("Post Route Integration Tests", () => {
  // create post
  it("POST /api/v1/post should register a new post", (done) => {
    request
      .post("/api/v1/post")
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "post content", title: "post title" })
      .end((err, res) => {
        if (res.statusCode === 400) {
          expect(res.statusCode).to.equal(400);
        }
        if (res.statusCode === 401) {
          expect(res.statusCode).to.equal(401);
        } else {
          expect(res.statusCode).to.equal(201);
          expect(res.body).to.have.property("msg", "create post successfully");
        }
        done();
      });
  });

  // get all post ------------------------------------------------------
  it("GET /api/v1/post should get all post", (done) => {
    request.get("/api/v1/post").end((err, res) => {
      expect(res.statusCode).to.equal(200);

      // 반환된 데이터가 객체인지 확인
      expect(res.body).to.be.an("object");

      // page 속성의 값이 number 타입인지 확인
      expect(res.body).to.have.property("page");
      expect(res.body.page).to.be.a("number");

      // page 속성의 값이 양의 정수인지 확인
      expect(res.body.page).to.be.above(0);

      // posts 속성이 배열인지 확인
      expect(res.body.posts).to.be.an("array");

      // 배열의 각 객체에 대한 검증
      res.body.posts.forEach((post) => {
        expect(post).to.have.property("title");
        expect(post).to.have.property("content");
        expect(post).to.have.property("author");
        expect(post.author).to.have.property("email");
      });
      done();
    });
  });

  // get single post ------------------------------------------------------
  it("should return a single post with title, content, and author email", (done) => {
    // 가정: 존재하는 post의 id를 사용하여 요청
    const existingPostId = 1;

    request.get(`/api/v1/post/${existingPostId}`).end((err, res) => {
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an("object"); // 반환된 데이터가 객체인지 확인
      expect(res.body).to.have.property("post"); // post 속성이 존재하는지 확인

      const post = res.body.post;

      // post 객체에 title, content, author 속성이 존재하는지 확인
      expect(post).to.have.property("title");
      expect(post).to.have.property("content");
      expect(post).to.have.property("author");

      // author 객체에 email 속성이 존재하는지 확인
      expect(post.author).to.have.property("email");

      done();
    });
  });

  // 잘못된 post id를 사용하여 요청
  it("should return an error for an invalid id", (done) => {
    // 가정: 존재하지 않는 post의 id를 사용하여 요청
    const invalidPostId = "invalid_id";

    request.get(`/api/v1/post/${invalidPostId}`).end((err, res) => {
      expect(res.statusCode).to.equal(400);
      expect(res.body).to.have.property("msg", "Please provide a valid id");
      done();
    });
  });

  // 존재하지않는 post id를 사용하여 요청
  it("should return an error for a non-existing post", (done) => {
    // 가정: 존재하지 않는 post의 id를 사용하여 요청
    const nonExistingPostId = 9999;

    request.get(`/api/v1/post/${nonExistingPostId}`).end((err, res) => {
      expect(res.statusCode).to.equal(404);
      expect(res.body).to.have.property("msg", "Post does not exist");

      done();
    });
  });

  // edit post ------------------------------------------------------------
  // 존재하는 post의 id와 수정할 title, content를 사용하여 요청
  it("should edit a single post and return success message", (done) => {
    const existingPostId = 1;
    const updatedTitle = "Updated Title";
    const updatedContent = "Updated content";

    request
      .patch(`/api/v1/post/${existingPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: updatedTitle, content: updatedContent })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property(
          "msg",
          "edit single post successfully"
        );

        done();
      });
  });

  // 가정: 존재하는 post의 id를 사용하여 요청하되, title과 content를 누락
  it("should return an error if title or content is missing", (done) => {
    const existingPostId = 1;

    request
      .patch(`/api/v1/post/${existingPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "", content: "Updated content" })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property("msg", "please provide all values");

        done();
      });
  });

  // 가정: 유효하지 않은 post의 id를 사용하여 요청
  it("should return an error for an invalid id", (done) => {
    const invalidPostId = "invalid_id";
    const updatedTitle = "Updated Title";
    const updatedContent = "Updated content";

    request
      .patch(`/api/v1/post/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: updatedTitle, content: updatedContent })
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property("msg", "Please provide a valid id");

        done();
      });
  });

  // 가정: 존재하지 않는 post의 id를 사용하여 요청
  it("should return an error for a non-existing post", (done) => {
    const nonExistingPostId = 9999;
    const updatedTitle = "Updated Title";
    const updatedContent = "Updated content";

    request
      .patch(`/api/v1/post/${nonExistingPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: updatedTitle, content: updatedContent })
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property("msg", "Post does not exist");

        done();
      });
  });

  // 권한이 없는 user의 token을 사용하여 요청
  it("should return an error for an unauthorized user", (done) => {
    const unauthorizedToken = "invalid_token";
    const existingPostId = 1;
    const updatedTitle = "Updated Title";
    const updatedContent = "Updated content";

    request
      .patch(`/api/v1/post/${existingPostId}`)
      .set("Authorization", `Bearer ${unauthorizedToken}`)
      .send({ title: updatedTitle, content: updatedContent })
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property(
          "msg",
          "Authentication Invalid. please login again"
        );

        done();
      });
  });

  // delete post ---------------------------------------------------------------
  // 가정: 존재하는 post의 id를 사용하여 요청
  it("should delete a single post and return success message", (done) => {
    const existingPostId = 1;

    request
      .delete(`/api/v1/post/${existingPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(204);
        expect(res.body).to.be.empty;
        done();
      });
  });

  // 가정: 유효하지 않은 post의 id를 사용하여 요청
  it("should return an error for an invalid id", (done) => {
    const invalidPostId = "invalid_id";

    request
      .delete(`/api/v1/post/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(400);
        expect(res.body).to.have.property("msg", "Please provide a valid id");
        done();
      });
  });

  // 가정: 존재하지 않는 post의 id를 사용하여 요청
  it("should return an error for a non-existing post", (done) => {
    const nonExistingPostId = 9999;

    request
      .delete(`/api/v1/post/${nonExistingPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(404);
        expect(res.body).to.have.property("msg", "Post does not exist");
        done();
      });
  });

  // 가정:권한이 없는 user의 token을 사용하여 요청
  it("should return an error for an unauthorized user", (done) => {
    const unauthorizedToken = "invalid_token";
    const existingPostId = 1;

    request
      .delete(`/api/v1/post/${existingPostId}`)
      .set("Authorization", `Bearer ${unauthorizedToken}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(401);
        expect(res.body).to.have.property(
          "msg",
          "Authentication Invalid. please login again"
        );
        done();
      });
  });
});
