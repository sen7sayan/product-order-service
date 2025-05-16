📦 Product Order Service Setup (Docker RabbitMQ)
✅ Install Node.js from https://nodejs.org/

✅ Install Docker Desktop from https://www.docker.com/products/docker-desktop

✅ Open pgAdmin 4 and:

Create a new database named: product_order_db

✅ Run RabbitMQ in Docker:


```
docker pull rabbitmq:3-management
docker run -d --hostname rabbitmq-local --name rabbitmq \
  -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```


Access RabbitMQ dashboard: http://localhost:15672

Login: guest / guest

✅ Clone or open the product-order-service project folder

✅ Run in terminal:

```
cd product-order-service
npm install
```


```
npm run start:dev

```



# System Architecture
Full Flow Documentation – Customer & Order Flow (with Microservices & RabbitMQ)
________________________________________
1. Customer Registration
A new customer starts by registering on the platform. The frontend collects user details and sends them to the Customer Service.
Data Required:
•	Name
•	Email
•	Phone
•	Password
•	Address
Flow:
•	The Customer Service validates inputs.
•	Password is hashed before storing.
•	A customer document is created in the Customer Service database.
•	A JWT token is generated and returned to the frontend.
________________________________________
2. Customer Login
Existing users can log in using their email and password.
Flow:
•	User enters email and password.
•	Customer Service verifies the credentials.
•	On success, returns JWT token for accessing authenticated routes.
•	On failure, sends an error response.
________________________________________
3. Creating an Order
Once logged in, a user can create an order by selecting products. The Customer Service will not directly handle product details; instead, it will communicate with the Order Service via RabbitMQ.
Steps:
1.	Frontend sends the order request (with product IDs and quantities) to Customer Service.
2.	Customer Service:
o	Verifies the user's token.
o	Prepares the order message including:
	Customer ID
	Product list
	Quantity
	Other metadata (timestamp, order status)
o	Sends this message to a RabbitMQ queue (create_order) for the Order Service.
3.	Order Service:
o	Listens to create_order queue.
o	Validates product availability.
o	Calculates prices and totals.
o	Creates a new order record in its own database.
o	Publishes an create_order event to notify other services (if needed).
o	Sends a confirmation message back via RabbitMQ to Customer Service (if synchronous acknowledgment is needed).
4.	Customer Service:
o	Optionally updates user order history or returns the confirmation to frontend.
________________________________________
4. Fetching All Orders for a Customer (New User Orders)
To view all past orders of a customer:
Flow:
1.	Frontend requests order history from Customer Service.
2.	Customer Service:
o	Extracts customer ID from JWT.
o	Sends a request to Order Service via RabbitMQ (order_detail_queue queue), passing the customer ID.
3.	Order Service:
o	Queries its database for all orders belonging to the customer.
o	Sends back the list of orders to Customer Service through RabbitMQ.
4.	Customer Service:
o	Forwards the order list to the frontend.
________________________________________
5. Fetching a Single Order
When a user wants to view the details of a specific order:
Flow:
1.	Frontend sends a request with the Order ID to Customer Service.
2.	Customer Service:
o	Validates user identity via JWT.
o	Sends request to Order Service via RabbitMQ (single_order_queue queue).
3.	Order Service:
o	Fetches order by ID.
o	Sends back order data (including product breakdown, shipping status, etc.) through RabbitMQ.
4.	Customer Service:
o	Returns order data to frontend.
________________________________________
6. RabbitMQ Integration
RabbitMQ serves as the communication bridge between services.
Queues Used:
•	create_order → Customer sends order creation request to Order Service.
•	order_detail_queue → Customer Service requests order history.
•	single_order_queue → Request for a specific order.
Benefits:
•	Loose coupling between services.
•	Each service has its own DB (Customer DB, Order DB).
•	Services can scale independently.
•	Failure tolerance: orders can be retried if queue is persistent.
________________________________________
7. Error Handling
•	If RabbitMQ is unavailable, a fallback mechanism (retry logic or queuing locally) can be implemented.
•	If the product is unavailable or order creation fails, Order Service responds with an error.
•	Customer Service should log and communicate failure gracefully to the frontend.
________________________________________

Microservices Overview
Service	Responsibility
Customer Service	Manages customer data, login, registration, forwards order requests
Order Service	Handles order logic: creation, lookup, pricing, status
Product Service*	(Optional) Used by Order Service to check stock/prices




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








