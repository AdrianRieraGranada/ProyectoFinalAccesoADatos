# Vue Chat Replica

A modern chat application built with Vue 3, Vite, and AWS services (Cognito, API Gateway, DynamoDB).

## Features

- 🔐 User authentication with AWS Cognito
- 💬 Real-time chat interface
- 🎨 Dark mode UI
- 📱 Responsive design
- ☁️ Cloud-based message storage with DynamoDB

## Tech Stack

- **Frontend:** Vue 3 + Vite
- **Routing:** Vue Router
- **Authentication:** AWS Cognito (OAuth 2.0)
- **Backend:** AWS API Gateway + Lambda
- **Database:** AWS DynamoDB
- **Deployment:** AWS S3 + CloudFront

## Prerequisites

- Node.js 16+ and npm
- AWS Account with Cognito User Pool configured
- AWS API Gateway endpoint

## Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vue-chat-replica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env.example` to create your environment files:
   ```bash
   cp .env.example .env.development
   cp .env.example .env.production
   ```

   Then edit `.env.development` and `.env.production` with your actual AWS credentials:
   
   - `VITE_COGNITO_AUTHORITY`: Your Cognito User Pool authority URL
   - `VITE_COGNITO_CLIENT_ID`: Your Cognito App Client ID
   - `VITE_COGNITO_DOMAIN`: Your Cognito hosted UI domain
   - `VITE_API_BASE_URL`: Your API Gateway base URL
   - `VITE_REDIRECT_URI`: Callback URL after authentication
   - `VITE_POST_LOGOUT_REDIRECT_URI`: Redirect URL after logout

4. **Run development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173/`

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## AWS Cognito Setup

1. Create a User Pool in AWS Cognito
2. Create an App Client (without client secret)
3. Configure Hosted UI with your callback URLs
4. Add the credentials to your `.env` files

## Project Structure

```
vue-chat-replica/
├── src/
│   ├── components/       # Reusable Vue components
│   ├── views/           # Page components
│   ├── router/          # Vue Router configuration
│   ├── services/        # API service layer
│   ├── composables/     # Vue composables
│   ├── plugins/         # Vue plugins (auth)
│   └── assets/          # Static assets
├── public/              # Public static files
└── dist/               # Production build output
```

## Security Notes

⚠️ **Important:** Never commit your `.env.development` or `.env.production` files to version control. They contain sensitive AWS credentials.

The `.env.example` file is provided as a template with placeholder values.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
