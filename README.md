# Infrastructure Bond Tokenization Platform (SDG 9.12)

> **Platform for Tokenizing Infrastructure Bonds for Public-Private Funding**
> *Fintech Startup | CIH 3.0 Hackathon*

## Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Roadmap](#roadmap)
- [License](#license)

## Project Overview

This project is a comprehensive fintech platform designed to democratize investment in infrastructure bonds through blockchain tokenization. By enabling fractional ownership and providing a transparent, secure trading environment, we bridge the gap between public infrastructure projects and private funding.

### Core Objectives
- **Tokenization**: Convert infrastructure bonds into digital tokens for fractional investment.
- **Transparency**: Utilize blockchain for immutable transaction records.
- **Accessibility**: Lower barriers to entry for retail investors.
- **Intelligence**: Provide AI-driven analytics for risk assessment and return prediction.

## Key Features

### 🚀 For Investors
- **Bond Marketplace**: Buy, sell, and trade tokenized infrastructure bonds.
- **AI Analytics**:
    - **Expected Return Graphs**: LSTM-based predictions.
    - **Risk Assessment**: AI-calculated risk scores (0-100).
    - **Sentiment Analysis**: Market sentiment derived from news and social data.
- **Paper Trading**: Practice trading strategies with virtual currency (up to ₹10L).
- **Portfolio Management**: Real-time tracking of holdings, PnL, and ROI.
- **Payment Integration**: Support for e-Rupees (CBDC) and standard gateways.

### 🏢 For Issuers & Platform
- **Bond Management**: Tools for listing and managing bond lifecycles.
- **Compliance**: Automated KYC/AML (Aadhaar/DigiLocker) and regulatory reporting (SEBI/RBI).
- **Admin Dashboard**: Comprehensive analytics and user management.

### 💎 Subscription Tiers
| Feature | Free | Basic (₹299/mo) | Premium (₹999/mo) | Enterprise (₹4999/mo) |
| :--- | :---: | :---: | :---: | :---: |
| Bond Listings | ✅ | ✅ | ✅ | ✅ |
| Transaction History | Limited | Extended | Full | Full |
| AI Analytics | ❌ | ✅ | ✅ | ✅ |
| Paper Trading | ❌ | ❌ | ₹10L Limit | Unlimited |
| API Access | ❌ | ❌ | ❌ | ✅ |
| Broker Integration | ❌ | ❌ | ❌ | ✅ |

## Technology Stack

The platform utilizes a modern, scalable tech stack:

### Frontend
- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS / CSS Modules
- **UI Components**: shadcn/ui, Radix UI
- **State Management**: React Context API / Redux Toolkit
- **Charts/Viz**: Recharts, Chart.js, Framer Motion

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **API**: RESTful API + Socket.io (Real-time)
- **Authentication**: JWT, Passport.js, OAuth 2.0
- **Validation**: Joi, Express Validator

### Database & Storage
- **Primary DB**: MongoDB 6.0+ (Mongoose ODM)
- **Caching**: Redis
- **Containerization**: Docker

### Blockchain (Web3)
- **Network**: Polygon / Ethereum
- **Smart Contracts**: Solidity (ERC-20 for Bonds)
- **Interaction**: ethers.js / web3.js
- **Wallets**: MetaMask, WalletConnect

## Architecture

The system follows a Microservices-based architecture with an Event-Driven design:

1.  **Presentation Layer**: Next.js Client.
2.  **API Gateway**: Handles routing, auth, and rate limiting.
3.  **Core Services**:
    *   Bond Service
    *   Trading Service
    *   Analytics Service (AI/ML)
    *   User/Auth Service
4.  **Integration Layer**: Connects to external Brokers (Zerodha, AngelOne) and Payment Gateways.
5.  **Data Layer**: MongoDB (Persistence) & Redis (Hot Data).
6.  **Blockchain Layer**: Handles token issuance and settlement.

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or Atlas URI)
- Redis
- Docker (optional but recommended)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Pusparaj99op/CIH3.0-SDG9.12.git
    cd CIH3.0-SDG9.12
    ```

2.  **Install Dependencies**
    ```bash
    # Backend
    cd backend
    npm install

    # Frontend
    cd ../frontend
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory (refer to specification for full list):
    ```env
    PORT=3210
    MONGODB_URI=mongodb://localhost:27017/bond_platform
    JWT_SECRET=your_jwt_secret
    REDIS_URL=redis://localhost:6379
    ```

4.  **Run the Application**

    *Development Mode:*
    ```bash
    # Start Backend
    cd backend
    npm run dev

    # Start Frontend
    cd frontend
    npm run dev
    ```

    *Using Docker:*
    ```bash
    docker-compose up --build
    ```

## API Documentation

The API is served at `http://localhost:3210/api/v1`. Key endpoints include:

-   **Auth**: `/auth/register`, `/auth/login`
-   **Bonds**: `/bonds` (List), `/bonds/:id` (Details), `/bonds/search` (AI Search)
-   **Trading**: `/trading/buy`, `/trading/sell`, `/trading/order-book`
-   **Portfolio**: `/portfolio`, `/portfolio/holdings`
-   **Analytics**: `/analytics/bond/:id/prediction`, `/analytics/market/trends`

> Full Swagger/OpenAPI documentation is available at `/api-docs` when running in development.

## Roadmap

-   **Phase 2**: Mobile Apps (React Native), Advanced Trading Algos, Social Trading.
-   **Phase 3**: International Markets, Derivatives, Machine Learning Model Marketplace.

## License

This project is licensed under the terms of the project LICENSE.
