
<div align="center">

  # Infrastructure Bond Tokenization Platform
  ### CIH3.0: Central India Hackathon | SDG 9.12

  **Transforming Public Infrastructure Funding through Blockchain & AI**

  [![Next.js](https://img.shields.io/badge/Next.js-14+-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
  [![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
  [![Polygon](https://img.shields.io/badge/Polygon-Matix-8247E5?style=for-the-badge&logo=polygon&logoColor=white)](https://polygon.technology/)

  <p align="center">
    <a href="#key-features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#api-documentation">API</a>
  </p>
</div>

---

## ![Problem Statement](https://img.shields.io/badge/Problem_Statement-SDG_9.12-E5243B?style=for-the-badge)
**"Create a platform for tokenizing infrastructure bonds to enable public-private funding."**

We address the critical gap in infrastructure financing by democratizing access to high-value assets. Our platform allows retail investors to legally own fractional shares of roads, bridges, and energy projects, fostering economic growth and innovation strictly aligned with **UN Sustainable Development Goal 9**.

---

## ![Key Features](https://img.shields.io/badge/Key_Features-Core_Capabilities-blue?style=for-the-badge)

### For Investors
- **Fractional Ownership**: Buy & sell tokenized bonds starting from ₹500.
- **AI-Powered Insights**:
  - **Risk Assessment**: Real-time 0-100 risk score.
  - **Return Prediction**: LSTM-based forecasts for informed decisions.
- **e-Rupee Integration**: Seamless payments via CBDC (Digital Rupee).
- **Paper Trading**: Practice with ₹10 Lakh virtual portfolio before investing.
- **AI Personal Banker**: 'Saraswati' - An AI-powered financial advisor for personalized investment strategies.

### For Issuers & Platform
- **Smart Contract Settlement**: Instant, trustless settlements on the Polygon network.
- **Regulatory Compliance**: Automated KYC (Aadhaar/DigiLocker) & SEBI reporting.
- **Real-time Transparency**: Immutable ledger records for every transaction.
- **Government Dashboard**: Specialized view for regulators to monitor infrastructure projects and bond performance.
- **Multi-Role Access**: Dedicated interfaces for Retail Investors, Institutions, and Government bodies.

---

## ![Technology Stack](https://img.shields.io/badge/Tech_Stack-Full_Stack-black?style=for-the-badge)

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion, GSAP, Lenis Scroll |
| **Backend** | Node.js, Express.js, Socket.io (Real-time) |
| **Database** | MongoDB (Data), Redis (Caching) |
| **Blockchain** | Solidity, Hardhat, Ethers.js, Polygon Mumbai |
| **AI / ML** | Python microservices (LSTM, Random Forest), OpenAI API |
| **DevOps** | Docker, Nginx, GitHub Actions |

---

## ![Architecture](https://img.shields.io/badge/System-Architecture-orange?style=for-the-badge)

Our solution utilizes an **Event-Driven Microservices Architecture** to ensure detailed scalability and reliability.

```mermaid
graph TD
  User[User / Client] -->|HTTPS| CDN[Cloudflare CDN]
  CDN -->|Next.js App| FE[Frontend Layer]

  subgraph "Backend Services"
    FE -->|API Rest/WS| API[API Gateway]
    API --> Auth[Auth Service]
    API --> Bond[Bond Service]
    API --> Trade[Trading Engine]
    API --> AI[AI Analytics Service]
  end

  subgraph "Data & Chain"
    Bond & Trade --> DB[(MongoDB)]
    Bond & Trade --> Cache[(Redis)]
    Trade -->|Smart Contract| Chain[Polygon Blockchain]
  end
```

---

## ![Getting Started](https://img.shields.io/badge/Guide-Getting_Started-success?style=for-the-badge)

### Prerequisites
- **Node.js** v18+ (verified with v24.11.1)
- **MongoDB** v6.0+ (running locally or MongoDB Atlas)
- **npm** for package management

### Installation & Running

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Pusparaj99op/CIH3.0-SDG9.12.git
   cd CIH3.0-SDG9.12
   ```

2. **Install Dependencies**
   ```bash
   # Frontend dependencies
   cd frontend && npm install

   # Backend dependencies
   cd ../backend && npm install
   ```

3. **Start MongoDB Service**
   ```bash
   # On Linux/Ubuntu
   sudo systemctl start mongod
   sudo systemctl status mongod

   # For other systems, ensure MongoDB is running on mongodb://localhost:27017
   ```

4. **Configure Environment**
   Backend environment is pre-configured in `backend/.env`:
   ```env
   PORT=3210
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/mudra
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   JWT_EXPIRE=7d
   ```

5. **Launch Backend Server**
   ```bash
   cd backend
   npm start
   ```
   ✅ Backend runs on: **`http://localhost:3210`**

6. **Launch Frontend Application**
   ```bash
   # In a new terminal
   cd frontend
   npm run dev
   ```
   ✅ Frontend runs on: **`http://localhost:5001`**

### Quick Test

Verify the platform is working:

```bash
# Test backend health
curl http://localhost:3210/api/health

# List all bonds
curl http://localhost:3210/api/bonds
```

Then visit [http://localhost:5001](http://localhost:5001) in your browser!

---

## ![API Documentation](https://img.shields.io/badge/Docs-API_Reference-lightgrey?style=for-the-badge)

### Core Endpoints (Verified & Working)

| Method | Endpoint | Description | Status |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Backend health check | ✅ |
| `GET` | `/api/bonds` | List all infrastructure bonds | ✅ |
| `GET` | `/api/bonds/:id` | Get specific bond details | ✅ |
| `POST` | `/api/auth/register` | User registration with paper trading | ✅ |
| `POST` | `/api/auth/login` | User authentication | ✅ |
| `GET` | `/api/portfolio` | Fetch user holdings & PnL | ✅ |
| `POST` | `/api/paper-trading/buy` | Execute paper trading buy order | ✅ |
| `POST` | `/api/paper-trading/sell` | Execute paper trading sell order | ✅ |
| `GET` | `/api/transactions` | View transaction history | ✅ |

### Sample Response - Bonds API

```json
{
  "success": true,
  "count": 10,
  "source": "mongodb",
  "data": [
    {
      "_id": "697ca547049befc0b476830c",
      "name": "National Highway Infrastructure Bond",
      "issuer": "NHAI",
      "returnRate": 7.5,
      "riskLevel": "Low",
      "price": 10000,
      "maturityYears": 5,
      "sector": "Transportation",
      "totalValue": 50000000000,
      "availableUnits": 2500000,
      "isActive": true
    }
  ]
}
```

---

## ![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)

### Current Application Status ✅

The platform is **fully functional** with the following verified features:

#### 🎨 Frontend Features
- **Modern UI/UX**: Beautiful gradient-based design with purple-blue theme
- **Bond Discovery**: Search, filter (by risk, sector, return rate), and sort capabilities
- **Detailed Bond View**: Comprehensive bond information with AI risk assessment
- **Paper Trading**: Virtual ₹10,00,000 balance for risk-free practice
- **Authentication**: Secure Multi-Role Login (User, Admin, Gov) & OTP-based Password Reset
- **Real-time Backend Connection**: Live data from MongoDB

#### 🔧 Backend Features
- **RESTful API**: Full CRUD operations for bonds, users, and transactions
- **MongoDB Integration**: 10+ pre-seeded infrastructure bonds
- **Authentication System**: JWT-based secure authentication
- **Paper Trading Engine**: Virtual trading without real money
- **Portfolio Management**: Track holdings and profit/loss
- **AI Service**: Sentiment analysis and investment scoring engine

#### 📊 Available Bonds (Live Data)

1. **National Highway Infrastructure Bond** - NHAI (7.5% return, Low risk)
2. **Metro Rail Development Bond** - DMRC (8.2% return, Low risk)
3. **Green Energy Infrastructure Bond** - IREDA (9% return, Medium risk)
4. **Smart City Development Bond** - Smart City SPV (8.8% return, Medium risk)
5. **Port & Logistics Bond** - Sagarmala SPV (9.5% return, High risk)
6. **Rural Connectivity Bond** - PMGSY (7.8% return, Low risk)
7. **Water Infrastructure Bond** - Jal Jeevan Mission (8.5% return, Medium risk)
8. **Airport Modernization Bond** - AAI (9.2% return, Medium risk)
9. **Railway Infrastructure Bond** - Indian Railways (8% return, Low risk)
10. **Industrial Corridor Bond** - NICDIT (10% return, High risk)

---

## ![Roadmap](https://img.shields.io/badge/Project-Roadmap-yellow?style=for-the-badge)

- [x] **Phase 0**: Project Setup & Architecture (✅ Completed)
- [x] **Phase 1**: Core Platform & MongoDB Integration (✅ Completed)
- [x] **Phase 2**: Frontend UI & Paper Trading (✅ Completed for CIH3.0 MVP)
- [x] **Phase 3**: Blockchain Integration (Polygon Mumbai testnet) (🚧 In Progress)
- [x] **Phase 4**: AI/ML Risk Assessment & Predictions (✅ Implemented)
- [ ] **Phase 5**: Mobile App (React Native) & Secondary Market
- [ ] **Phase 6**: Institutional Dashboard & Cross-chain Bridge

---

## ![Team](https://img.shields.io/badge/Team-Co_Devians-blueviolet?style=for-the-badge)

| Role | Name | Link |
| :--- | :--- | :--- |
| ![Team Leader](https://img.shields.io/badge/Team_Leader-FFD700?style=for-the-badge&logo=probot&logoColor=black) | **Pranay Gajbhiye** | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pranaygajbhiye/) |
| ![Backend](https://img.shields.io/badge/Backend-000000?style=for-the-badge&logo=nodedotjs&logoColor=white) | **Abhijit Dohe** | |
| ![Management](https://img.shields.io/badge/Management-4caf50?style=for-the-badge&logo=google-sheets&logoColor=white) | **Vineet Mandhalkar** | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vineet-ravi-mandhalkar-5a96a5334/) |
| ![Frontend](https://img.shields.io/badge/Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black) | **Samiksha Gupta** | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/samiksha-gupta-042059335/) |


---

<div align="center">
  <sub>Built with ❤️ for <b>Central India Hackathon 3.0</b></sub>
</div>
