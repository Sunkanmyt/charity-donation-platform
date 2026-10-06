# Campaigns API

Base path: `/api/campaigns`

Most errors use this shape:

```json
{
  "success": false,
  "message": "Campaign not found",
  "data": null
}
```

The exception is upload errors (wrong file type or file too large), which return an HTML error page instead. See the Create section.

## Campaign fields

| Field          | Type    | Rules                                                                                                            |
| -------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`        | string  | Required. Maximum 120 characters.                                                                                |
| `description`  | string  | Required.                                                                                                        |
| `category`     | string  | Required. Exactly one of `Education`, `Healthcare`, `Disaster Relief`, `Community Development` (case-sensitive). |
| `targetAmount` | number  | Required. At least 10.                                                                                           |
| `raisedAmount` | number  | Starts at 0. Increases automatically when donations are made.                                                    |
| `imageUrl`     | string  | Defaults to a standard placeholder image if none is given.                                                       |
| `status`       | string  | `active` or `completed`. Defaults to `active`. Only `active` campaigns accept donations.                         |
| `createdBy`    | user ID | Set automatically to the admin who created the campaign.                                                         |
| `isDeleted`    | boolean | Defaults to `false`. Set to `true` when an admin deletes (archives) the campaign.                                |
| `deletedAt`    | date    | `null` by default. Set to the deletion time when the campaign is archived.                                       |

---

## 1. List campaigns

**Endpoint:** `GET /api/campaigns`

**Purpose:** Returns campaigns, newest first, with optional category filter and title search. Results come in pages. Deleted (archived) campaigns are never included.

**Authentication:** None. Public.

### Parameters (query string)

| Parameter  | Type   | Required | Default | Rules                                                                       |
| ---------- | ------ | -------- | ------- | --------------------------------------------------------------------------- |
| `page`     | number | No       | `1`     | Which page to return.                                                       |
| `limit`    | number | No       | `6`     | Campaigns per page. Minimum 1, maximum 50. Bigger values are reduced to 50. |
| `category` | string | No       | all     | One of the four categories, spelled exactly. `All` means no filter.         |
| `search`   | string | No       | none    | Matches part of the title, ignoring upper/lower case.                       |

### Example request

`GET /api/campaigns?page=1&limit=6&category=Education&search=school`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Campaigns retrieved successfully",
  "data": {
    "campaigns": [
      {
        "_id": "6ab1390f98f8da19b8b3143e",
        "title": "Help Build a School",
        "description": "Funds for a new classroom block.",
        "category": "Education",
        "targetAmount": 500000,
        "raisedAmount": 7000,
        "imageUrl": "https://...",
        "status": "active",
        "isDeleted": false,
        "createdBy": {
          "_id": "64b7f0c2a1b2c3d4e5f60700",
          "email": "admin@charity.org"
        },
        "createdAt": "2026-09-20T09:00:00.000Z",
        "updatedAt": "2026-09-21T14:30:11.204Z"
      }
    ],
    "totalCampaigns": 1,
    "totalPages": 1,
    "currentPage": 1
  }
}
```

Notes:

- `createdBy` currently shows only the creator's `_id` and `email`.
- If nothing matches, the request still succeeds with `"campaigns": []` and `"totalPages": 1`.

### Error responses

| Status | When it happens                                                         | `message`                         |
| ------ | ----------------------------------------------------------------------- | --------------------------------- |
| 500    | Something unexpected broke, for example a search that is not valid text | The error message from the server |

---

## 2. View one campaign

**Endpoint:** `GET /api/campaigns/:id`

**Purpose:** Returns a single campaign. A deleted (archived) campaign is treated as not found.

**Authentication:** None. Public.

### Parameters (URL)

| Parameter | Type   | Required | Rules              |
| --------- | ------ | -------- | ------------------ |
| `id`      | string | Yes      | The campaign's ID. |

### Example request

`GET /api/campaigns/6ab1390f98f8da19b8b3143e`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Campaign retrieved successfully",
  "data": {
    "_id": "6ab1390f98f8da19b8b3143e",
    "title": "Help Build a School",
    "description": "Funds for a new classroom block.",
    "category": "Education",
    "targetAmount": 500000,
    "raisedAmount": 7000,
    "imageUrl": "https://...",
    "status": "active",
    "isDeleted": false,
    "createdBy": {
      "_id": "64b7f0c2a1b2c3d4e5f60700",
      "email": "admin@charity.org"
    },
    "createdAt": "2026-09-20T09:00:00.000Z",
    "updatedAt": "2026-09-21T14:30:11.204Z"
  }
}
```

### Error responses

| Status | When it happens                                           | `message`                             |
| ------ | --------------------------------------------------------- | ------------------------------------- |
| 404    | No campaign has that ID, or the campaign has been deleted | `Campaign not found`                  |
| 500    | The ID is not a valid ID format, or the server broke      | `Invalid campaign ID or server error` |

---

## 3. Create a campaign (admin only)

**Endpoint:** `POST /api/campaigns`

**Purpose:** Creates a new campaign. The image can be uploaded as a file.

**Authentication:** Required. Send `Authorization: Bearer <token>`.

**Authorization:** Admin only. Users with the role `donor` receive a 403 error.

### Request body

Send as **`multipart/form-data`** (in Postman: Body, then form-data), not raw JSON.

| Field          | Type          | Required | Rules                                                                                                                                  |
| -------------- | ------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `title`        | text          | Yes      | Maximum 120 characters.                                                                                                                |
| `description`  | text          | Yes      |                                                                                                                                        |
| `category`     | text          | Yes      | One of the four categories, spelled exactly.                                                                                           |
| `targetAmount` | text (number) | Yes      | At least 10.                                                                                                                           |
| `image`        | file          | No       | An image file, maximum 5 MB. JPG, JPEG, PNG or WEBP recommended. It is uploaded and stored online. The field must be a file, not text. |
| `imageUrl`     | text          | No       | A link to an existing image. Ignored if an `image` file is sent.                                                                       |

If no image is given, the default placeholder image is used.

Upload errors (wrong file type or file too large) return an HTML error page instead of the usual JSON, so clients should check the status code before reading the body.

### Successful response: 201 Created

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "data": {
    "_id": "6ab1390f98f8da19b8b3143e",
    "title": "Help Build a School",
    "description": "Funds for a new classroom block.",
    "category": "Education",
    "targetAmount": 500000,
    "raisedAmount": 0,
    "imageUrl": "https://res.cloudinary.com/...",
    "status": "active",
    "isDeleted": false,
    "createdBy": "64b7f0c2a1b2c3d4e5f60700",
    "createdAt": "2026-09-20T09:00:00.000Z",
    "updatedAt": "2026-09-20T09:00:00.000Z"
  }
}
```

### Error responses

| Status | When it happens                                                         | `message`                                                                                                |
| ------ | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 400    | `title`, `description`, `category` or `targetAmount` is missing         | `Please provide title, description, category, and targetAmount`                                          |
| 401    | No token, or the token is fake or expired                               | `Not authorized to access this route. No token provided.` or `Not authorized. Invalid or expired token.` |
| 403    | Logged in but not an admin                                              | `Forbidden: User role 'donor' is not authorized to perform this action.`                                 |
| 500    | A value breaks a rule (wrong category, title too long, target below 10) | The validation message, for example: `Campaign validation failed: ...`                                   |
| 500    | The image is over 5 MB                                                  | An HTML error page (not JSON) containing `MulterError: File too large`                                   |
| 500    | The file is not an image                                                | An HTML error page (not JSON) containing `Only image files (jpg, jpeg, png, webp) are allowed!`          |
| 500    | Image hosting fails or is not set up correctly                          | The error message from the image hosting service                                                         |

---

## 4. Update a campaign (admin only)

**Endpoint:** `PUT /api/campaigns/:id`

**Purpose:** Changes a campaign. Send only the fields you want to change. Fields left out stay as they are. A new `image` file replaces the old image.

**Authentication:** Required. Send `Authorization: Bearer <token>`.

**Authorization:** Admin only.

### Parameters (URL)

| Parameter | Type   | Required | Rules              |
| --------- | ------ | -------- | ------------------ |
| `id`      | string | Yes      | The campaign's ID. |

### Request body

Send as `multipart/form-data` (needed if you upload an image) or as raw JSON (if you are not changing the image).

| Field                                              | Type         | Required | Rules                        |
| -------------------------------------------------- | ------------ | -------- | ---------------------------- |
| `title`, `description`, `category`, `targetAmount` | as in Create | No       | Same rules as Create.        |
| `status`                                           | text         | No       | `active` or `completed`.     |
| `image`                                            | file         | No       | An image file, maximum 5 MB. |

Any other field in the campaign can also be changed this way, including `raisedAmount`. Use this with care.

Upload errors return an HTML error page instead of the usual JSON, the same as in Create.

### Example request

`PUT /api/campaigns/6ab1390f98f8da19b8b3143e`

```json
{
  "status": "completed"
}
```

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "data": {
    "_id": "6ab1390f98f8da19b8b3143e",
    "title": "Help Build a School",
    "status": "completed"
  }
}
```

The real response returns the whole updated campaign. It is shortened here.

### Error responses

| Status | When it happens                                                          | `message`                                                                                                |
| ------ | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| 401    | No token, or the token is fake or expired                                | `Not authorized to access this route. No token provided.` or `Not authorized. Invalid or expired token.` |
| 403    | Logged in but not an admin                                               | `Forbidden: User role 'donor' is not authorized to perform this action.`                                 |
| 404    | No campaign has that ID                                                  | `Campaign not found`                                                                                     |
| 500    | The ID is not a valid format, a value breaks a rule, or the server broke | The error message from the server                                                                        |
| 500    | The image is over 5 MB                                                   | An HTML error page (not JSON) containing `MulterError: File too large`                                   |
| 500    | The file is not an image                                                 | An HTML error page (not JSON) containing `Only image files (jpg, jpeg, png, webp) are allowed!`          |

---

## 5. Delete a campaign (admin only)

**Endpoint:** `DELETE /api/campaigns/:id`

**Purpose:** Archives a campaign (soft delete). The campaign is marked `isDeleted: true`, its `status` is set to `completed`, and `deletedAt` records the time. It disappears from public listings and can no longer be viewed or donated to, but its donations are kept.

**Authentication:** Required. Send `Authorization: Bearer <token>`.

**Authorization:** Admin only.

### Parameters (URL)

| Parameter | Type   | Required | Rules              |
| --------- | ------ | -------- | ------------------ |
| `id`      | string | Yes      | The campaign's ID. |

### Example request

`DELETE /api/campaigns/6ab1390f98f8da19b8b3143e`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Campaign deleted successfully",
  "data": null
}
```

Note: donations made to the campaign are not deleted. They still appear in donors' history (`GET /api/donations/my`) and still count toward each donor's lifetime total. In those responses the campaign object includes `"isDeleted": true`.

### Error responses

| Status | When it happens                                         | `message`                                                                                                |
| ------ | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| 401    | No token, or the token is fake or expired               | `Not authorized to access this route. No token provided.` or `Not authorized. Invalid or expired token.` |
| 403    | Logged in but not an admin                              | `Forbidden: User role 'donor' is not authorized to perform this action.`                                 |
| 404    | No campaign has that ID, or it has already been deleted | `Campaign not found`                                                                                     |
| 500    | The ID is not a valid format, or the server broke       | `Failed to delete campaign`                                                                              |
