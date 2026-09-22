# Donations API

## 1. Make a donation

**Endpoint:** `POST /api/donations`

**Purpose:** Records a donation from the logged-in user to a campaign and adds the amount to the campaign's `raisedAmount`. Payment is simulated, so every valid donation is saved with the status `successful`.

**Authentication:** Required. Send the login token in the request header:

`Authorization: Bearer <token>`

Any logged-in user (donor or admin) can donate.

### Request body (JSON)

| Field | Type | Required | Rules |
|---|---|---|---|
| `campaignId` | string | Yes | Must be a valid ID of an existing, active campaign |
| `amount` | number | Yes | Must be a number, at least 1 |
| `isAnonymous` | boolean | No | Defaults to `false`. If `true`, the donor's name is hidden from admins. |
| `message` | string | No | Maximum 300 characters |

### Parameters

None. This endpoint has no URL parameters or query strings.

### Example request

```json
{
  "campaignId": "6ab1390f98f8da19b8b3143e",
  "amount": 5000,
  "isAnonymous": false,
  "message": "God bless this cause"
}
```

### Successful response: 201 Created

```json
{
  "success": true,
  "message": "Donation successful",
  "data": {
    "_id": "6ab13a077d19d985a076710d",
    "donor": "64b7f0c2a1b2c3d4e5f60718",
    "campaign": "6ab1390f98f8da19b8b3143e",
    "amount": 5000,
    "status": "successful",
    "isAnonymous": false,
    "message": "God bless this cause",
    "createdAt": "2026-09-21T14:07:03.713Z",
    "updatedAt": "2026-09-21T14:07:03.713Z"
  }
}
```

### Error responses

| Status | When it happens | `message` |
|---|---|---|
| 400 | `campaignId` is missing or not a valid ID | `A valid campaign ID is required` |
| 400 | `amount` is missing, not a number, or below 1 | `Amount must be at least 1` |
| 400 | `message` is not text, or is longer than 300 characters | `Message must be text of 300 characters or fewer` |
| 400 | The campaign exists but is not active | `This campaign is not accepting donations` |
| 401 | No token was sent | `Not authorized to access this route. No token provided.` |
| 401 | The token is fake or expired | `Not authorized. Invalid or expired token.` |
| 404 | No campaign has that ID | `Campaign not found` |
| 500 | Something unexpected broke on the server | `Something went wrong` |

Every error uses the same shape:

```json
{
  "success": false,
  "message": "Campaign not found",
  "data": null
}



---

## 2. View my donation history

**Endpoint:** `GET /api/donations/my`

**Purpose:** Returns the donations made by the logged-in user, newest first. Each donation shows the title of the campaign it went to. Results come in pages, so a donor with many donations receives them in small batches.

**Authentication:** Required. Send the login token in the request header:

`Authorization: Bearer <token>`

Any logged-in user can call this. Each user only ever sees their own donations, because the server filters by the person who is logged in.

### Request body

None. This is a GET request, so nothing is sent in the body.

### Parameters (query string)

| Parameter | Type | Required | Default | Rules |
|---|---|---|---|---|
| `page` | number | No | `1` | Which page to return. Anything below 1 or not a number becomes `1`. |
| `limit` | number | No | `10` | How many donations per page. Minimum 1, maximum 50. Bigger values are reduced to 50. |

### Example request

`GET /api/donations/my?page=1&limit=10`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Donation history retrieved",
  "data": {
    "donations": [
      {
        "_id": "6ab13b1c7d19d985a0767120",
        "donor": "64b7f0c2a1b2c3d4e5f60718",
        "campaign": {
          "_id": "6ab1390f98f8da19b8b3143e",
          "title": "Help Build a School"
        },
        "amount": 2000,
        "status": "successful",
        "isAnonymous": true,
        "message": "God bless this cause",
        "createdAt": "2026-09-21T14:30:11.204Z",
        "updatedAt": "2026-09-21T14:30:11.204Z"
      }
    ],
    "page": 1,
    "totalPages": 1,
    "total": 2
  }
}
```

| Field in `data` | Meaning |
|---|---|
| `donations` | The donations on this page, newest first |
| `page` | The page number returned |
| `totalPages` | How many pages exist in total |
| `total` | How many donations this user has made in total |

If the user has made no donations yet, the request still succeeds, with `"donations": []` and `"total": 0`.

### Error responses

| Status | When it happens | `message` |
|---|---|---|
| 401 | No token was sent | `Not authorized to access this route. No token provided.` |
| 401 | The token is fake or expired | `Not authorized. Invalid or expired token.` |
| 500 | Something unexpected broke on the server | `Something went wrong` |

Every error uses the same shape:

```json
{
  "success": false,
  "message": "Not authorized. Invalid or expired token.",
  "data": null
}


---

## 3. View a campaign's donations (admin only)

**Endpoint:** `GET /api/donations/campaign/:campaignId`

**Purpose:** Returns every donation made to one campaign, newest first, so an admin can see who has donated and how much. Donors who chose to be anonymous appear with `"donor": null`, so their identity is never revealed.

**Authentication:** Required. Send the login token in the request header:

`Authorization: Bearer <token>`

**Authorization:** Admin only. Users with the role `donor` receive a 403 error.

### Request body

None. This is a GET request, so nothing is sent in the body.

### Parameters (URL)

| Parameter | Type | Required | Rules |
|---|---|---|---|
| `campaignId` | string | Yes | Part of the address. Must be a valid ID of an existing campaign. |

### Example request

`GET /api/donations/campaign/6ab1390f98f8da19b8b3143e`

### Successful response: 200 OK

```json
{
  "success": true,
  "message": "Campaign donations retrieved",
  "data": [
    {
      "_id": "6ab13b1c7d19d985a0767120",
      "donor": null,
      "campaign": "6ab1390f98f8da19b8b3143e",
      "amount": 2000,
      "status": "successful",
      "isAnonymous": true,
      "message": "God bless this cause",
      "createdAt": "2026-09-21T14:30:11.204Z",
      "updatedAt": "2026-09-21T14:30:11.204Z"
    },
    {
      "_id": "6ab13a077d19d985a076710d",
      "donor": {
        "_id": "64b7f0c2a1b2c3d4e5f60718",
        "firstName": "Ada",
        "lastName": "Obi"
      },
      "campaign": "6ab1390f98f8da19b8b3143e",
      "amount": 5000,
      "status": "successful",
      "isAnonymous": false,
      "createdAt": "2026-09-21T14:07:03.713Z",
      "updatedAt": "2026-09-21T14:07:03.713Z"
    }
  ]
}
```

Notes on the response:
- `donor` is an object with `firstName` and `lastName` only. Email, phone and password are never included.
- For anonymous donations, `donor` is `null`, but the amount, date and message are still shown.
- If the campaign has no donations yet, the request still succeeds, with `"data": []`.
- This endpoint returns all donations at once and has no `page` or `limit`.

### Error responses

| Status | When it happens | `message` |
|---|---|---|
| 400 | `campaignId` is not a valid ID | `Invalid campaign ID` |
| 401 | No token was sent | `Not authorized to access this route. No token provided.` |
| 401 | The token is fake or expired | `Not authorized. Invalid or expired token.` |
| 403 | The user is logged in but is not an admin | `Forbidden: User role 'donor' is not authorized to perform this action.` |
| 404 | No campaign has that ID | `Campaign not found` |
| 500 | Something unexpected broke on the server | `Something went wrong` |

Every error uses the same shape:

```json
{
  "success": false,
  "message": "Campaign not found",
  "data": null
}
