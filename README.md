# Nodejs Blog Exercise

RESTful API built with Node.js, Express.js, and MongoDB


## Checklist

### Create API
- [x] Sign-In
- [x] Sign-up with email-password validation
- [ ] Sign-out
- [x] Mars
- [X] CRUD comment

### Create the API based on authorization
- [x] Get the list of comments
- [x] Post a comment
- [x] Delete a comment

### Additional Feature
- Account Confirmation with OTP
- SMTP Helper
- JWT Tokens Based Authentication
- Post CRUD
- Postman API Collections

## Software Requirements

-   Node.js **8+**
-   MongoDB **3.6+**

## Tools
-   Visual Studio Code
-   Postman (for API testing)

## Project Structure
```sh
.
├── app.js
├── package.json
├── bin
│   └── www
├── controllers
│   ├── AuthController.js
│   ├── CommentController.js
│   ├── PostController.js
│   └── PublicController.js
├── models
│   ├── CommentModel.js
│   ├── PostModel.js
│   └── UserModel.js
├── routes
│   ├── api.js
│   ├── auth.js
│   ├── index.js
│   ├── post.js
│   └── public.js
├── middlewares
│   ├── jwt.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```

## How to install

### Using Git

1.  Clone this project from github/bitbucket.

```bash
git clone 
```

### Install npm dependencies

```bash
cd myproject
npm install
```

### Environments Setup

1.  Find `.env.example` on root directory of this project.
2.  Copy and paste `.env.example` and rename it to `.env`
3.  Change the values to suit your environment.


## How to run

### Running API server on localhost

```bash
npm run dev
```

##  API Documentation

### Auth

#### Register

Request
| Name           | Method | Descriptions                                          |
|----------------|--------|-------------------------------------------------------|
| /auth/register |  POST  | Register a new user and send OTP to new user's email. |


#### Login

Request
| Name        | Method | Descriptions |
|-------------|--------|--------------|
| /auth/login |  POST  | User Login   |


#### Verify OTP

Request
| Name             | Method | Descriptions            |
|------------------|--------|-------------------------|
| /auth/verify-otp |  POST  | Verify -digits OTP Code |


#### Resend OTP

Request
| Name                    | Method | Descriptions                   |
|-------------------------|--------|--------------------------------|
| /auth/resend-verify-otp |  POST  | Resend OTP to specified Email. |



### Public
#### Show All Post

Request
| Name    | Method | Descriptions                       |
|---------|--------|------------------------------------|
| /public |   GET  | Show All Post created by all user. |


#### Show All Comment Based On Specific Post

Request
| Name                  | Method | Descriptions                                               |
|-----------------------|--------|------------------------------------------------------------|
| /public/{id}/comments |   GET  | Show all comments created on a post identified by post id. |



### Post CRUD
#### Post List

Request
| Name  | Method | Descriptions                             |
|-------|--------|------------------------------------------|
| /post |   GET  | Get all post created by authorized user. |

#### Post Store

Request
| Name  | Method | Descriptions                          |
|-------|--------|---------------------------------------|
| /post |  POST  | Create a new post by authorized user. |

#### Post Detail

Request
| Name       | Method | Descriptions                                     |
|------------|--------|--------------------------------------------------|
| /post/{id} |   GET  | View a specific post created by authorized user. |

#### Post Update

Request
| Name       | Method | Descriptions                                     |
|------------|--------|--------------------------------------------------|
| /post/{id} |   PUT  | Edit a specific post created by authorized user. |

#### Post Delete

Request
| Name       | Method | Descriptions                                       |
|------------|--------|----------------------------------------------------|
| /post/{id} | DELETE | Delete a specific post created by authorized user. |



### Comment CRUD
#### Comment List

Request
| Name                | Method | Descriptions                 |
|---------------------|--------|------------------------------|
| /post/{id}/comments |   GET  | Show all comments on a post. |

#### Comment Store

Request
| Name                | Method | Descriptions                                              |
|---------------------|--------|-----------------------------------------------------------|
| /post/{id}/comments |  POST  | Create a comment on a post (all logged in user can post). |

#### Comment Update

Request
| Name                             | Method | Descriptions                         |
|----------------------------------|--------|--------------------------------------|
| /post/{id}/comments/{comment_id} | update | Delete a comment by authorized user. |

#### Comment Delete

Request
| Name                             | Method | Descriptions                         |
|----------------------------------|--------|--------------------------------------|
| /post/{id}/comments/{comment_id} | delete | Delete a comment by authorized user. |
