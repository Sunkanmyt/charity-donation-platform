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
