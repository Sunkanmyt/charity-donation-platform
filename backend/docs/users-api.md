# Users API (admin)

## View all users (admin only)

**Endpoint:** `GET /api/users`

**Purpose:** Returns a list of all registered users, newest first, so an admin can browse accounts. To see what a particular user has donated, use `GET /api/donations/user/:userId`. Results come in pages.

**Authentication:** Required. Send the login token in the request header:

`Authorization: Bearer <token>`

**Authorization:** Admin only. Users with the role `donor` receive a 403 error.

### Request body

None. This is a GET request, so nothing is sent in the body.

### Parameters (query string)

| Parameter | Type | Required | Default | Rules |
|---|---|---|---|---|
| `page` | number | No | `1` | Anything below 1 or not a number becomes `1`. |
| `limit` | number | No | `10` | Minimum 1, maximum 50. Bigger values are reduced to 50. |

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
      "isActive": true,
      "lastLogin": "2026-09-21T14:07:03.713Z",
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

### Error responses

| Status | When it happens | `message` |
|---|---|---|
| 401 | No token was sent | `Not authorized to access this route. No token provided.` |
| 401 | The token is fake or expired | `Not authorized. Invalid or expired token.` |
| 403 | The user is logged in but is not an admin | `Forbidden: User role 'donor' is not authorized to perform this action.` |
| 500 | Something unexpected broke on the server | `Failed to fetch users` |