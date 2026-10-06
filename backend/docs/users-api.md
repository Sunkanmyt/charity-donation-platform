# Users API

Base path: `/api/users`

Every error uses the same basic shape:

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

Some 500 errors also include an `error` field with technical details.

---

## 1. Register

**Endpoint:** `POST /api/users/register`

**Purpose:** Creates a new account with the role `donor` and logs the user in straight away by returning a token. A verification email is sent to the address provided.

**Authentication:** None. Public.

### Request body (JSON)

| Field       | Type   | Required | Rules                                               |
| ----------- | ------ | -------- | --------------------------------------------------- |
| `firstName` | string | Yes      |                                                     |
| `lastName`  | string | Yes      |                                                     |
| `email`     | string | Yes      | Must not already be registered. Saved in lowercase. |
| `password`  | string | Yes      | Stored securely hashed, never returned.             |
| `phone`     | string | No       |                                                     |

### Example request

```json
{
  "firstName": "Ada",
  "lastName": "Obi",
  "email": "ada@example.com",
  "password": "MySecurePass123!",
  "phone": "08012345678"
}
```

### Successful response: 201 Created

```json
{
  "success": true,
  "message": "Registration successful. Please check your email to verify your account.",
  "token": "<jwt token>",
  "user": {
    "id": "64b7f0c2a1b2c3d4e5f60718",
    "firstName": "Ada",
    "lastName": "Obi",
    "email": "ada@example.com",
    "phone": "08012345678",
    "role": "donor",
    "profileImageUrl": "/default-avatar.png",
    "isVerified": false
  }
}
```

New accounts start with the default avatar (`/default-avatar.png`) until a photo is uploaded through **Update my profile**.

### Error responses

| Status | When it happens                          | `message`                                            |
| ------ | ---------------------------------------- | ---------------------------------------------------- |
| 400    | A required field is missing              | `First name, Last name, email and password required` |
| 409    | The email is already registered          | `User with this email already exists`                |
| 500    | Something unexpected broke on the server | `Registration failed`                                |

---

## 2. Login

**Endpoint:** `POST /api/users/login`

**Purpose:** Checks the email and password and returns a token. Send this token with later requests as `Authorization: Bearer <token>`. Tokens expire after 1 hour.

**Authentication:** None. Public.

### Request body (JSON)

| Field      | Type   | Required |
| ---------- | ------ | -------- |
| `email`    | string | Yes      |
| `password` | string | Yes      |

### Example request

```json
{
  "email": "ada@example.com",
  "password": "MySecurePass123!"
}
```

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Login Successful",
  "token": "<jwt token>",
  "user": {
    "id": "64b7f0c2a1b2c3d4e5f60718",
    "firstName": "Ada",
    "lastName": "Obi",
    "email": "ada@example.com",
    "phone": "08012345678",
    "role": "donor",
    "profileImageUrl": "https://res.cloudinary.com/...",
    "isVerified": true
  }
}
```

### Error responses

| Status | When it happens                          | `message`                           |
| ------ | ---------------------------------------- | ----------------------------------- |
| 400    | Email or password is missing             | `Email and Password are Required`   |
| 401    | Email not found or password is wrong     | `Invalid email or password`         |
| 403    | The account has been deactivated         | `Your account has been deactivated` |
| 500    | Something unexpected broke on the server | `Login failed`                      |

---

## 3. View my profile

**Endpoint:** `GET /api/users/profile`

**Purpose:** Returns the details of the logged-in user. The password is never included.

**Authentication:** Required. Send `Authorization: Bearer <token>`. Any logged-in user can call this.

### Request body

None.

### Successful response: 200 OK

```json
{
  "success": true,
  "user": {
    "_id": "64b7f0c2a1b2c3d4e5f60718",
    "firstName": "Ada",
    "lastName": "Obi",
    "email": "ada@example.com",
    "phone": "08012345678",
    "role": "donor",
    "profileImageUrl": "https://res.cloudinary.com/...",
    "isVerified": true,
    "isActive": true,
    "lastLogin": "2026-10-06T08:00:00.000Z",
    "createdAt": "2026-09-01T10:00:00.000Z",
    "updatedAt": "2026-10-06T08:00:00.000Z"
  }
}
```

### Error responses

| Status | When it happens                          | `message`                                                 |
| ------ | ---------------------------------------- | --------------------------------------------------------- |
| 401    | No token was sent                        | `Not authorized to access this route. No token provided.` |
| 401    | The token is fake or expired             | `Not authorized. Invalid or expired token.`               |
| 404    | The user no longer exists                | `User not found`                                          |
| 500    | Something unexpected broke on the server | `Failed to fetch profile`                                 |

---

## 4. Update my profile

**Endpoint:** `PUT /api/users/profile`

**Purpose:** Changes the logged-in user's details and/or uploads a new profile photo. Send only the fields you want to change. Fields you leave out stay as they are. A new `profileImageUrl` file replaces the old photo.

**Authentication:** Required. Send `Authorization: Bearer <token>`.

### Request body

Send as **`multipart/form-data`** when uploading a photo (in Postman: Body, then form-data), or as raw JSON for text-only changes.

| Field             | Type | Required | Rules                                                                                                           |
| ----------------- | ---- | -------- | --------------------------------------------------------------------------------------------------------------- |
| `firstName`       | text | No       |                                                                                                                 |
| `lastName`        | text | No       |                                                                                                                 |
| `phone`           | text | No       |                                                                                                                 |
| `profileImageUrl` | file | No       | An image file (JPG, JPEG, PNG or WEBP), maximum 5 MB. Stored on Cloudinary. The field must be a file, not text. |

### Example request (JSON)

```json
{
  "phone": "08099998888"
}
```

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "64b7f0c2a1b2c3d4e5f60718",
    "firstName": "Ada",
    "lastName": "Obi",
    "email": "ada@example.com",
    "phone": "08099998888",
    "role": "donor",
    "profileImageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v.../avatar.jpg"
  }
}
```

### Error responses

| Status | When it happens                                | `message`                                                                                                |
| ------ | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 401    | No token, or the token is fake or expired      | `Not authorized to access this route. No token provided.` or `Not authorized. Invalid or expired token.` |
| 404    | The user no longer exists                      | `User not found`                                                                                         |
| 500    | The image upload or the database update failed | `Failed to update profile`                                                                               |

---

## 5. Change my password

**Endpoint:** `PUT /api/users/password`

**Purpose:** Changes the logged-in user's password. The current password must be correct.

**Authentication:** Required. Send `Authorization: Bearer <token>`.

### Request body (JSON)

| Field             | Type   | Required | Rules                             |
| ----------------- | ------ | -------- | --------------------------------- |
| `currentPassword` | string | Yes      | Must match the existing password. |
| `newPassword`     | string | Yes      | At least 6 characters.            |

### Example request

```json
{
  "currentPassword": "MySecurePass123!",
  "newPassword": "EvenBetterPass456!"
}
```

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

### Error responses

| Status | When it happens                               | `message`                                                                                                |
| ------ | --------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 400    | Either password is missing                    | `Current password and new password are required`                                                         |
| 400    | The new password is shorter than 6 characters | `New password must be at least 6 characters`                                                             |
| 401    | No token, or the token is fake or expired     | `Not authorized to access this route. No token provided.` or `Not authorized. Invalid or expired token.` |
| 401    | The current password is wrong                 | `Current password is incorrect`                                                                          |
| 404    | The user no longer exists                     | `User not found`                                                                                         |
| 500    | Something unexpected broke on the server      | `Failed to change password`                                                                              |

---

## 6. View all users (admin only)

**Endpoint:** `GET /api/users`

**Purpose:** Returns a list of all registered users, newest first, so an admin can browse accounts. To see what a particular user has donated, use `GET /api/donations/user/:userId`. Results come in pages.

**Authentication:** Required. Send the login token in the request header:

`Authorization: Bearer <token>`

**Authorization:** Admin only. Users with the role `donor` receive a 403 error.

### Request body

None. This is a GET request, so nothing is sent in the body.

### Parameters (query string)

| Parameter | Type   | Required | Default | Rules                                                   |
| --------- | ------ | -------- | ------- | ------------------------------------------------------- |
| `page`    | number | No       | `1`     | Anything below 1 or not a number becomes `1`.           |
| `limit`   | number | No       | `10`    | Minimum 1, maximum 50. Bigger values are reduced to 50. |

### Example request

`GET /api/users?page=1&limit=10`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Users retrieved",
  "users": [
    {
      "_id": "64b7f0c2a1b2c3d4e5f60718",
      "firstName": "Ada",
      "lastName": "Obi",
      "email": "ada@example.com",
      "phone": "08012345678",
      "role": "donor",
      "profileImageUrl": "/default-avatar.png",
      "isActive": true,
      "lastLogin": "2026-10-06T08:00:00.000Z",
      "createdAt": "2026-09-01T10:00:00.000Z"
    }
  ],
  "page": 1,
  "totalPages": 1,
  "total": 1
}
```

Notes on the response:

- The password and security tokens are never included.
- `lastLogin` is missing for users who have never logged in.
- `phone` is missing for users who didn't provide one.
- `profileImageUrl` is `/default-avatar.png` for users who have not uploaded a photo.

### Error responses

| Status | When it happens                           | `message`                                                                |
| ------ | ----------------------------------------- | ------------------------------------------------------------------------ |
| 401    | No token was sent                         | `Not authorized to access this route. No token provided.`                |
| 401    | The token is fake or expired              | `Not authorized. Invalid or expired token.`                              |
| 403    | The user is logged in but is not an admin | `Forbidden: User role 'donor' is not authorized to perform this action.` |
| 500    | Something unexpected broke on the server  | `Failed to fetch users`                                                  |
