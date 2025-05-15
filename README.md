# 📦 Product Microservice
This microservice handles product data including fetching product lists and product details. It supports pagination and provides detailed product info. It does not handle customer or order logic directly.

---

## 🚀 Base URL


---

## ✅ Register a New Customer

**GET** `/api/product?page=1&limit=10`

*Description*
Fetches a paginated list of products.
page - Page number to retrieve
limit - Number of products per page



**Response:**

```json
{
  "statusCode": 200,
  "message": "Products fetched successfully",
  "data": [
    {
      "id": "86b1578f-042f-4652-aadc-3338e9a52060",
      "name": "Banana",
      "description": "Banana is a fruit",
      "price": "4.00",
      "stock": 49,
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvuFWmgStX6zF38A7ZufXtDXTlUag-rcKnew&s",
      "createdAt": "2025-05-15T03:23:30.162Z",
      "updatedAt": "2025-05-15T13:29:31.926Z"
    },
    {
      "id": "d3a87d0f-ce3e-4170-9fc6-21bfd5a5cbe7",
      "name": "Banana",
      "description": "Banana is a fruit",
      "price": "4.00",
      "stock": 43,
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvuFWmgStX6zF38A7ZufXtDXTlUag-rcKnew&s",
      "createdAt": "2025-05-15T03:22:46.164Z",
      "updatedAt": "2025-05-15T15:38:53.635Z"
    },
    {
      "id": "af06c7c9-fe16-49c1-aa21-8fd143fd018f",
      "name": "Apple",
      "description": "Apple is a fruit",
      "price": "20.00",
      "stock": 79,
      "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtkzZMTh_n9DE3CznuCnA8wVdQI7IQT9sDng&s",
      "createdAt": "2025-05-15T03:22:00.230Z",
      "updatedAt": "2025-05-15T13:42:54.627Z"
    },
    {
      "id": "fdeb9954-cfab-4342-a772-8e4ea033560e",
      "name": "Coconut",
      "description": "Banana is a fruit",
      "price": "4.00",
      "stock": 29,
      "image": "https://www.producemarketguide.com/media/user_5q6Kv4eMkN/347/coconut_commodity-page.png",
      "createdAt": "2025-05-15T03:21:11.629Z",
      "updatedAt": "2025-05-15T14:00:19.553Z"
    }
  ],
  "meta": {
    "total": 4,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}

```




## ✅ Single Product

**GET** `/api/product/{id}`

*Description
Fetches detailed information about a specific product by its ID.

**Response:**

```json
{
  "statusCode": 200,
  "message": "Product fetched successfully",
  "data": {
    "id": "86b1578f-042f-4652-aadc-3338e9a52060",
    "name": "Banana",
    "description": "Banana is a fruit",
    "price": "4.00",
    "stock": 49,
    "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvuFWmgStX6zF38A7ZufXtDXTlUag-rcKnew&s",
    "createdAt": "2025-05-15T03:23:30.162Z",
    "updatedAt": "2025-05-15T13:29:31.926Z"
  }
}


```







## ✅ Customer Profile

**GET** `/api/customer`

**Request Body:**
Headers:
Authorization: Bearer <token>




**Response:**

```json
{
  "name": "ram kumar",
  "email": "abc5@gmail.com",
  "phone": "7539518521",
  "address": "abc colony"
}

```


