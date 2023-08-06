## ✨원티드 프리온보딩 백엔드 인턴쉽 사전 과제✨

#### 목차
1. [정보](#1-지원자-성명--김민지)
2. [어플리케이션 실행방법](#2-애플리케이션의-실행-방법-엔드포인트-호출-방법-포함)
3. [데이터베이스 테이블 구조](#3-데이터베이스-테이블-구조)
4. [구현한 API의 동작을 촬영한 데모 영상 링크](#4-구현한-api의-동작을-촬영한-데모-영상-링크)
5. [구현 방법 및 이유에 대한 간략한 설명](#5-구현-방법-및-이유에-대한-간략한-설명)
6. [API 명세(request/response 포함)](#6-api-명세requestresponse-포함)
7. [가산점 요소 추가 실행방법](#7-가산점-요소-추가-실행방법)

<hr/>

## 1. 지원자 성명 : 김민지

<hr/>

## 2. 애플리케이션의 실행 방법 

#### 1. **AWS 배포 주소**
http://13.209.87.140:3000/


    
#### 2. **DEV docker-compose 환경 실행 방법**
- docker 환경이 반드시 셋팅되어 있어야 합니다. 
    참고 :https://hub.docker.com/ 
- git clone
    ```
    git clone https://github.com/mandy0529/wanted-pre-onboarding-backend.git
    ```
- .env.dev 파일 생성
    ```
    touch .env.dev
    ```
- .env.dev 파일 구성 예제
    ```
    DATABASE_URL="mysql://root:devrootpassword@dev-db:3306/database"
    JWT_SECRET=jwtsecret   
    ```
-  docker-compose.dev.yml 파일 생성
    ```
    touch docker-compose.dev.yml
    ```
-  docker-compose.dev.yml 파일 구성 예제
    ```
    version: "3"
    services:
      # dev DB
      dev-db:
        profiles:
          - dev
        container_name: dev-db
        build:
          context: ./db
        environment:
          MYSQL_ROOT_PASSWORD: devrootpassword
          MYSQL_PASSWORD: password
          MYSQL_DATABASE: database
          MYSQL_USER: user
        ports:
          - "3306:3306"
        networks:
          - wanted-work

      # node app DB
      dev-app:
        container_name: dev-app
        build:
          context: .
          target: dev
        ports:
          - "3000:3000"
        networks:
          - wanted-work
        restart: on-failure:6 
        env_file:
          - .env.dev
    networks:
      wanted-work:
    ```
- docker compose dev.yml파일에서 dev-db를 먼저 up 시킵니다.
    ```
    yarn db:dev:up
        or 
    npm run db:dev:up
    ```
- docker compose dev.yml 파일에서 app을 up 시킵니다.
    ```
    yarn app:dev:up
        or 
    npm run app:dev:up
    ```
- 해당 server에서 listening 하고있는 port로 켜집니다.

#### 3. **TEST docker-compose 환경 실행 방법**
- git clone
    ```
    git clone https://github.com/mandy0529/wanted-pre-onboarding-backend.git
    ```
- .env.test 파일 생성
    ```
    touch .env.test
    ```
- .env.test 파일 구성 예제
    ```
    DATABASE_URL="mysql://root:testrootpassword@test-db:3306/database"
    JWT_SECRET=jwtsecret   
    ```
-  docker-compose.test.yml 파일 생성
    ```
    touch docker-compose.test.yml
    ```

-  docker-compose.test.yml 파일 구성 예제
    ```
    version: "3"
    services:
       # test DB
      test-db:
        profiles:
          - test
        container_name: test-db
        build:
          context: ./db
        environment:
          MYSQL_ROOT_PASSWORD: testrootpassword
          MYSQL_PASSWORD: password
          MYSQL_DATABASE: database
          MYSQL_USER: user
        ports:
          - "3307:3306"
        networks:
          - wanted-work

      # node app DB
      test-app:
        container_name: test-app
        build:
          context: .
          target: test
        ports:
          - "3001:3000"
        networks:
          - wanted-work
        restart: on-failure:6 
        env_file:
          - .env.test
    networks:
      wanted-work:
    ```
- docker compose test.yml파일에서 test-db를 먼저 up 시킵니다.
    ```
    yarn db:test:up
    or 
    npm run db:test:up
    ```
- docker compose test.yml 파일에서 app을 up 시킵니다.
    ```
    yarn app:test:up
    or 
    npm run app:test:up
    ```
- 해당 server에서 listening 하고있는 port로 켜지고, mocha test code가 실행됩니다.


#### 4. **endpoint 호출 방법**
   1. User
        - 회원가입 
        
        ```
        POST /api/v1/user/register 
              -d '{ "email": "test@gmail.com", "password": "password1234" }
        ```
        - 로그인 
        ```
        POST /api/v1/user/login
            -d '{ "email": "test@gmail.com", "password": "password1234" }
        ```
    2. Post
        - 게시글 글쓰기 
                <span style='color:red'> * 게시글을 작성할 때는 Bearer Token이 필요합니다. <br/> * Authorization 헤더에 유효한 Bearer Token을 포함하여 요청하세요.</span>
        ```
        POST /api/v1/post
            -H "Authorization: Bearer ${token}"" 
            -d '{ "title": "새로운 게시글", "content": "이것은 새로운 게시글 내용입니다." }
        ```
        - 모든 게시글 불러오기 ( pagenation 포함 )
        ```
        GET /api/v1/post?page=1
        ```
        - 해당 게시글 불러오기
        ```
        GET /api/v1/post/:id
        ```
        - 해당 게시글 수정하기
                <span style='color:red'> * 게시글을 수정할 때는 Bearer Token이 필요합니다. <br/> * Authorization 헤더에 유효한 Bearer Token을 포함하여 요청하세요.</span>
        ```
        PATCH /api/v1/post/:id
            -H "Authorization: Bearer ${token}" 
            -d '{ "title": "edit title", "content": "edit content" }
        ```
        - 해당 게시글 삭제하기 
                <span style='color:red'> * 게시글을 삭제할 때는 Bearer Token이 필요합니다. <br/> * Authorization 헤더에 유효한 Bearer Token을 포함하여 요청하세요.</span>
        ```
        DELETE /api/v1/post/:id
              -H "Authorization: Bearer ${token}" 
        ```
<hr/>   

## 3. 데이터베이스 테이블 구조
#### 1. **User**
-   이 테이블은 애플리케이션의 사용자 정보를 저장합니다.
- id: UUID 형식으로 생성되는 사용자의 고유 식별자입니다.
- email: 사용자 이메일 주소로, 유일한 값이며 최대 255자까지 저장됩니다.
- password: 사용자 비밀번호로, 최대 255자까지 저장됩니다.
- Post: User와 Post 테이블 간의 관계를 나타내며, 하나의 사용자가 여러 개의 게시글을 작성할 수 있습니다.

#### 2. **Post**
- 이 테이블은 애플리케이션의 게시글 정보를 저장합니다.
- id: 자동으로 증가하는 게시글의 고유 식별자입니다.
- title: 게시글의 제목으로, 최대 255자까지 저장됩니다.
- content: 게시글의 내용으로, 최대 1000자까지 저장됩니다.
- author: 게시글과 User 테이블 간의 관계를 나타내며, 게시글의 작성자를 참조합니다.
- authorId: 게시글 작성자의 고유 식별자인 User 테이블의 id와 연결됩니다.
<hr/>

## 4. 구현한 API의 동작을 촬영한 데모 영상 링크
[데모영상](https://drive.google.com/file/d/1kNPlbChNEV_2jJfSo68auxgj3zQy0zjD/view?usp=drive_link)
<hr/>

## 5. 구현 방법 및 이유에 대한 간략한 설명
1. **Prisma와 ORM 사용 이유**: Prisma는 타입 세이프한 쿼리 빌더로 데이터베이스 스키마와의 강력한 통합이 가능하다는 이유로 선택했습니다.

2. **Docker를 활용한 mysql 사용 이유**: Docker는 애플리케이션의 독립성과 확장성을 높여서 배포와 관리를 용이하게 만들어준다는 이유로 선택했습니다.

3. **JWT 인증 방식 선택** : JWT는 토큰 기반의 인증 방식으로 서버에 상태를 유지하지 않아도 되며, 확장성이 용이하다는 이유로 선택했습니다.

4. **RESTful API 디자인**: RESTful API는 자원 기반의 구조를 가지며, 간결하고 직관적인 API 디자인을 제공하여 API의 사용성을 높여준다는 이유로 선택했습니다.

5. **폴더 구조 설명** 
    1. **src**: 프로젝트의 소스 코드들이 모두 위치하는 폴더입니다. 이 폴더는 프로젝트의 핵심 부분으로, 애플리케이션의 로직과 기능을 담당하는 코드들이 위치합니다.
    2. **prisma**: 데이터베이스 모델과 관련된 파일들이 위치하는 폴더입니다.
    3. **controllers**: API 엔드포인트들과 그에 대응하는 로직을 처리하는 파일입니다.
    4. **db**: docker로 실행한 Mysql의 환경변수를 집어넣어 연결하는 db파일입니다.
    5. **errors**: 프로젝트에서 발생할 수 있는 오류에 대한 종류와 처리 방법을 모아둔 폴더입니다.
    6. **lib**: password를 hash하거나 token을 생성하고, verify하는 utils 담당 폴더입니다.
    7. **middlewares**: 요청과 응답 사이에 실행되는 함수로, 인증, 로깅, 에러 처리 등을 담당합니다.
    8. **routes**: API 엔드포인트들과 해당하는 컨트롤러를 매핑하는 역할을 합니다.
    9. **tests**: 테스트 코드들이 위치하는 폴더입니다. 유닛 테스트나 통합 테스트 등을 관리하며, 코드의 안정성과 기능을 검증하는데 사용됩니다.
    10. **public**: 정적 파일들(css, 이미지, 동영상)이 위치하는 폴더입니다. 

6. **auth 미들웨어 로직 구성** : 
        - **authenticateUser** : 이 미들웨어는 사용자 인증을 처리하는 역할을 합니다. 보통 로그인된 사용자인지를 확인하고, 인증된 사용자라면 해당 사용자에 대한 정보를 요청 객체에 추가하여 후속 처리에서 활용합니다. 
        - **unauthorizedUser** :  이 미들웨어는 인증되지 않은 사용자에 대한 처리를 담당합니다. 인증되지 않은 사용자가 보호된 리소스에 접근하는 경우, 해당 사용자에 대한 액세스를 제한하거나 로그인 페이지로 리다이렉션하는 등의 처리를 할 수 있습니다. 

7. **password hash bcrypt사용** :  안전한 비밀번호 저장하고, 해싱 알고리즘의 강도를 조절할 수 있고, 비밀번호 검증이 가능하고, 단방향 해시로 더 안전하게 hash시킬수있는 bcrypt를 이용해서 Password를 hash 시켰습니다.

8. **email, password 유효성 검사 validator 라이브러리 사용** : 라이브러리는 사용하기 쉽고, 다양한 유효성 검사 함수를 제공하여 데이터 유효성 검사를 간편하게 수행할 수 있기 때문에 선택했습니다.

9. **pagenation 구현** : 
    -  게시글 목록을 페이지네이션 처리하여 클라이언트에게 반환합니다. 
    - pagenation은 데이터를 페이지로 나누어 한 번에 표시할 데이터 양을 제한하는 기법으로, 사용자 경험을 향상시키고 데이터를 효율적으로 관리하는데 사용됩니다.
    - page 쿼리 파라미터를 전달하여 원하는 페이지 번호를 지정하여 data를 가져옵니다.
<hr/>

## 6. API 명세(request/response 포함)
#### 1. **User**
- **register user**
    - end point:
      ```
        POST /api/v1/user/register
            -d '{ "email": "test@gmail.com", "password": "password1234" }
        ```
     - Request 
        - Body: {
            "email": "test@email.com" ,
            "password": "12341234"
        }
     - Success Response
        - 201 Created => 유저 성공적으로 생성, 유저 생성했다는 문구 반환
    - Error Response 
        - 400 Bad Request => 요청이 잘못 or 필수 정보 누락 or 유효성 검사 탈락 or duplicate email error
        - 500 Internal Server Error => 서버 오류로 유저 생성에 실패
        <hr/>

- **login user**
    - end point:
        ```
        POST /api/v1/user/login
            -d '{ "email": "test@gmail.com", "password": "password1234" }
        ```
     - Request 
        - Body: {
            "email": "test@email.com" ,
            "password": "12341234"
        }
     - Success Response
        - 200 Ok: 유저 성공적으로 로그인, jwt를 이용해서 생성한 token 반환
    - Error Response
        - 400 Bad Request: 요청이 잘못 or 필수 정보 누락 or 유효성 검사 탈락
        - 500 Internal Server Error: 서버 오류로 로그인 실패
        <hr/>
#### 2. **Post**
- **create post**
    - end point:
        ```
        POST /api/v1/post
            -H "Authorization: Bearer ${token}"" 
            -d '{ "title": "새로운 게시글", "content": "이것은 새로운 게시글 내용입니다." }
        ```

     - Request 
        - Body: {
            "title": "게시글 제목",
            "content": "게시글 내용"
        }
        - Headers: {
            Authorization: Bearer {token}
        }

     - Success Response:
        - 201 Created: 게시글이 성공적으로 생성, 생성 성공 했다는 문구 반환

     - Error Response:
        - 401 UnauthenticatedError: 로그인 하지 않은 유저 unauthenticated error로 게시글 생성 실패
        - 500 Internal Server Error: 서버 오류로 게시글 생성 실패
        <hr/>

- **get all post**
    - end point:
        ```
        GET /api/v1/post?page=1
        ```
    - Success Response
        - 200 OK: 요청에 성공, 게시글 목록 반환
    - Error Response
        - 400 Bad Request: 요청이 잘못 
        - 500 Internal Server Error: 서버 오류로 게시글 목록을 불러오는데 실패
        <hr/>

- **get single post**
    - end point:
        ```
        GET /api/v1/post/:id
        ```
    - Success Response
        - 200 OK: 요청에 성공하고 해당 ID의 게시글을 반환
    - Error Response
        - 400 Bad Request: 요청이 잘못 
        - 404 Not Found: 해당 ID의 게시글이 존재 ❌
        - 500 Internal Server Error: 서버 오류로 게시글 조회에 실패
        <hr/>

- **edit single post**
    - end point:
        ```
        PATCH /api/v1/post/:id
            -H "Authorization: Bearer ${token}" 
            -d '{ "title": "edit title", "content": "edit content" }
        ```
    - Request 
        - Body: {
            "title": "수정된 게시글 제목",
            "content":"수정된 게시글 내용"
            }
        - Headers: {
            Authorization: Bearer {token}
        }
    - Success Response
        - 200 OK: 요청에 성공하고 게시글이 수정
    - Error Response
        - 400 Bad Request: 요청이 잘못되었거나 필수 정보가 누락
        - 403 Forbidden : UnauthorizedError 게시물 작성자가 아닐 경우 에러
        - 404 Not Found: 해당 ID의 게시글이 존재❌
        - 500 Internal Server Error: 서버 오류로 게시글 수정에 실패
        <hr/>
- **delete single post**
    - end point:
        ```
        DELETE /api/v1/post/:id
              -H "Authorization: Bearer ${token}" 
        ```
    - Success Response:
        - 204 No Content: 요청에 성공하고 게시글이 삭제
    - Error Response
        - 403 Forbidden : UnauthorizedError 게시물 작성자가 아닐 경우 에러
        - 404 Not Found: 해당 ID의 게시글이 존재❌
        - 500 Internal Server Error: 서버 오류로 게시글 삭제에 실패
    
<hr/>

## 7. 가산점 요소 추가 설명

#### 1. 통합테스트 추가
- mocha, supertest, chai를 이용해 user, post 통합 테스트를 실행 했습니다.
- 개발환경과 test 환경을 따로 구축하여 테스트코드를 실행할때마다 prisma test database를 reset시키고, test 실행 하였습니다.
- package.json에서 dotenv-cli를 이용해서 test 환경과 dev 환경 env를 다른 파일을 바라보도록 설정하여 구성 하였습니다.

#### 2. docker compose 이용해서 어플리케이션 환경 구성
- docker-compose 를 이용해 실행방법 [어플리케이션 실행방법](#2-애플리케이션의-실행-방법-엔드포인트-호출-방법-포함) 적어놨습니다.
- docker-compose.yml 파일을 dev, test, prd로 나눠 각각 환경에 맞게 env 파일, port, build할 image를 바라보게 조정하여 구성하였습니다.

#### 3. 클라우드 환경(AWS, GCP)에 배포 환경을 설계하고 애플리케이션을 배포한 경우 (README.md파일에 배포된 API 주소와 설계한 AWS 환경 그림으로 첨부)
- AWS 환경 설계 및 배포 과정:
    -  ECR(Elastic Container Registry)에 Docker 이미지 db와 app을 각각 docker로 build한 나의 이미지들을 업로드합니다. 
    -  ECS 클러스터를 생성합니다.
    - 클러스터를 생성할때 key pair를 해줘서 ssh에 접근할 수 있도록 만듭니다.
    - IAM 역할을 생성하여 ECS가 ECR에 접근하고 RDS에 접근할 수 있도록 권한을 부여합니다.
    - ECS 클러스터에 작업정의 db, app에 관한 작업 정의 2개를 지정 해줍니다.
    - 컨테이너를 실행할 EC2 인스턴스를 준비합니다.
    - pem 파일을 이용해 내 EC2 인스턴스 안에 접근합니다.
    - 올려져있는 docker images들을 확인하고,
    - 잘 올라가있으면 이제 docker images들 실행해주기 위한 docker-compose.yml파일을 생성합니다
    - docker-compose.yml파일에는 우리의 환경변수들이나 docker container를 실행시키기 위한 내앱에 필요한 환경변수, port mapping, network 설정을 지정해줍니다.
    - docker-compose 명령어를 써주기 위해 다운 받고,
    - docker compose up -d detach모드로 db, app을 실행시키고, app이 잘 열리는지와 prisma가 잘 연결되었는지 확인 합니다.
    - 잘 열리면 내 api가 잘 완성되었습니다 !



