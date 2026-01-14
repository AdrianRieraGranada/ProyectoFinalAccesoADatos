# Vue Chat Replica

A modern chat application built with Vue 3, Vite, and AWS serverless services.

**Live Demo:** https://d273m1rugj2sd0.cloudfront.net/

## Authors

- Adrián Riera Granada
- Raúl González Alguacil

## Overview

This project is a full-stack chat application that demonstrates the integration of modern frontend frameworks with AWS cloud services. The application features user authentication, real-time message handling, and persistent storage using a serverless architecture.

## Features

- User authentication with AWS Cognito (OAuth 2.0)
- Modern dark-themed chat interface
- Multiple AI model selection (GPT-4, Claude, Gemini)
- Message persistence with AWS DynamoDB
- Serverless backend architecture
- Responsive design
- Secure credential management

## Technology Stack

### Frontend
- **Framework:** Vue 3 with Composition API
- **Build Tool:** Vite
- **Routing:** Vue Router
- **Authentication:** AWS Cognito with OAuth 2.0
- **Styling:** Vanilla CSS

### Backend
- **API Gateway:** AWS API Gateway (REST API)
- **Compute:** AWS Lambda (Python 3.x)
- **Database:** AWS DynamoDB
- **Authentication:** AWS Cognito User Pools

### Deployment
- **Hosting:** AWS S3 + CloudFront CDN
- **Region:** eu-south-2 (Europe - Spain)

## Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ├─────────────────────────────────┐
       │                                 │
       v                                 v
┌──────────────┐                 ┌──────────────┐
│   CloudFront │                 │   Cognito    │
│  (Frontend)  │                 │ (Auth/Users) │
└──────┬───────┘                 └──────────────┘
       │
       v
┌──────────────┐
│ API Gateway  │
└──────┬───────┘
       │
       v
┌──────────────┐       ┌──────────────┐
│    Lambda    │──────>│  DynamoDB    │
│   (Python)   │       │  (Messages)  │
└──────────────┘       └──────────────┘
```

## AWS Lambda Function

The backend uses a Python Lambda function to handle message storage:

**Functionality:**
- Receives POST requests with message data
- Validates required fields
- Generates unique message IDs using UUID
- Stores messages in DynamoDB with metadata
- Returns success/error responses with proper HTTP status codes

**DynamoDB Schema:**
```json
{
  "id": "uuid",
  "userEmail": "string",
  "message": "string",
  "model": "string",
  "timestamp": "number",
  "createdAt": "ISO 8601 string"
}
```

## Prerequisites

- Node.js 16+ and npm
- AWS Account with the following services configured:
  - Cognito User Pool
  - API Gateway
  - Lambda Function
  - DynamoDB Table
  - S3 Bucket
  - CloudFront Distribution

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd vue-chat-replica
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example environment file and fill in your AWS credentials:

```bash
cp .env.example .env.development
```

Edit `.env.development` with your actual values:

```env
VITE_COGNITO_AUTHORITY=https://cognito-idp.REGION.amazonaws.com/REGION_USER_POOL_ID
VITE_COGNITO_CLIENT_ID=your_client_id_here
VITE_COGNITO_DOMAIN=https://your-domain.auth.REGION.amazoncognito.com
VITE_API_BASE_URL=https://your-api-id.execute-api.REGION.amazonaws.com
VITE_REDIRECT_URI=http://localhost:5173/
VITE_POST_LOGOUT_REDIRECT_URI=http://localhost:5173/
```

### 4. Run development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

## Production Build

### Build the application

```bash
npm run build
```

The production-ready files will be generated in the `dist/` directory.

### Deploy to AWS

1. Upload the `dist/` folder contents to your S3 bucket
2. Invalidate CloudFront cache to serve the new version

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## AWS Configuration Guide

### Cognito User Pool Setup

1. Create a User Pool in AWS Cognito
2. Configure the following settings:
   - Sign-in options: Email
   - Password policy: As per your requirements
   - MFA: Optional
3. Create an App Client:
   - Type: Public client
   - Authentication flows: ALLOW_USER_SRP_AUTH
   - OAuth 2.0 grant types: Authorization code grant
   - OAuth scopes: email, openid, profile
4. Configure Hosted UI:
   - Domain: Create a Cognito domain
   - Callback URLs: Add your application URLs
   - Sign-out URLs: Add your application URLs

### API Gateway Setup

1. Create a REST API
2. Create a `/messages` resource
3. Add a POST method
4. Enable CORS
5. Deploy to a stage (e.g., `prod`)

### Lambda Function Setup

1. Create a Python 3.x Lambda function
2. Add the provided Lambda code
3. Configure IAM role with DynamoDB permissions
4. Set timeout to at least 10 seconds
5. Connect to API Gateway as integration

### DynamoDB Table Setup

1. Create a table with:
   - Table name: `ProyectoFinalAccesoADatos`
   - Partition key: `id` (String)
   - On-demand billing mode recommended

## Project Structure

```
vue-chat-replica/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── AuthLayout.vue   # Authentication page layout
│   │   ├── Button.vue       # Custom button component
│   │   ├── InputBar.vue     # Message input component
│   │   ├── MainLayout.vue   # Main app layout
│   │   ├── MessageBubble.vue # Chat message component
│   │   └── ModelSelector.vue # AI model selector
│   ├── views/               # Page components
│   │   ├── ChatView.vue     # Main chat interface
│   │   ├── LoginView.vue    # Login page
│   │   └── RegisterView.vue # Registration page
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── services/            # API service layer
│   │   └── chatService.js   # Chat API integration
│   ├── composables/         # Vue composables
│   │   └── useAuth.js       # Authentication logic
│   ├── plugins/             # Vue plugins
│   │   └── authPlugin.js    # Auth plugin setup
│   ├── assets/              # Static assets
│   ├── style.css            # Global styles
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── public/                  # Public static files
├── dist/                    # Production build output
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore rules
├── index.html               # HTML entry point
├── package.json             # NPM dependencies
├── vite.config.js           # Vite configuration
└── README.md                # This file
```

## Security Considerations

**Important:** Never commit sensitive credentials to version control.

The following files are excluded from Git via `.gitignore`:
- `.env.development` - Contains development credentials
- `.env.production` - Contains production credentials
- `node_modules/` - Dependencies
- `dist/` - Build artifacts

Always use the `.env.example` file as a template and create your own environment files locally.

## Available Scripts

### Development
```bash
npm run dev          # Start development server
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

## API Endpoints

### POST /messages

Stores a chat message in DynamoDB.

**Request Body:**
```json
{
  "userEmail": "user@example.com",
  "message": "Hello, world!",
  "model": "gpt4"
}
```

**Response (Success):**
```json
{
  "success": true,
  "messageId": "uuid-here",
  "message": "Mensaje guardado exitosamente"
}
```

**Response (Error):**
```json
{
  "error": "Error message description"
}
```

## Troubleshooting

### Authentication Issues

If you encounter "No matching state found in storage" errors:
1. Verify that your Cognito callback URLs match your application URLs exactly
2. Check that the Cognito domain is correctly configured
3. Ensure cookies are enabled in your browser

### API Connection Issues

If messages are not being saved:
1. Check that `VITE_API_BASE_URL` is correctly set
2. Verify API Gateway CORS configuration
3. Check Lambda function logs in CloudWatch
4. Verify DynamoDB table permissions

### Build Issues

If the build fails:
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Ensure all environment variables are set

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue in the GitHub repository.
