# Image Gallery API

A simple REST API for managing an image gallery built with Node.js.

## Setup

1. Make sure you have Node.js installed
2. Clone this repository
3. Run the server:
```bash
node index.js
```
The server will start on port 3000.

## API Endpoints

### Get All Images
- **GET** `/images`
- Returns a list of all images

### Get Single Image
- **GET** `/images?id=1`
- Returns a specific image by ID
- Query parameter: `id` (required)

### Create New Image
- **POST** `/images`
- Creates a new image
- Request body (JSON):
```json
{
    "name": "Image Name",
    "preview_url": "http://example.com/image.jpg",
    "description": "Image description"
}
```

### Delete Image
- **DELETE** `/images?id=1`
- Deletes an image by ID
- Query parameter: `id` (required)

## Testing with Postman

1. Import the following collection into Postman:
   - GET `/images` - Get all images
   - GET `/images?id=1` - Get single image
   - POST `/images` - Create new image
   - DELETE `/images?id=1` - Delete image

2. Make sure to set the `Content-Type: application/json` header for POST requests

## Data Storage

Images are stored in `images.json` file in the project root directory. 
