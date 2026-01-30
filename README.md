
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

### For Issuers & Platform
- **Smart Contract Settlement**: Instant, trustless settlements on the Polygon network.
- **Regulatory Compliance**: Automated KYC (Aadhaar/DigiLocker) & SEBI reporting.
- **Real-time Transparency**: Immutable ledger records for every transaction.

---

## ![Technology Stack](https://img.shields.io/badge/Tech_Stack-Full_Stack-black?style=for-the-badge)

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion |
| **Backend** | Node.js, Express.js, Socket.io (Real-time) |
| **Database** | MongoDB (Data), Redis (Caching) |
| **Blockchain** | Solidity, Hardhat, Ethers.js, Polygon Mumbai |
| **AI / ML** | Python microservices (LSTM, Random Forest) |
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
- Node.js v18+
- Docker & Docker Compose
- MongoDB (Local or Atlas)

### Installation

1. **Clone the Repo**
   ```bash
   git clone https://github.com/Pusparaj99op/CIH3.0-SDG9.12.git
   ```

2. **Install Dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Configure Environment**
   Copy `.env.example` to `.env` and fill in your credentials:
   ```env
   MONGODB_URI=mongodb://localhost:27017/bond_platform
   JWT_SECRET=super_secret_key_cih3
   BLOCKCHAIN_NETWORK=mumbai
   ```

4. **Launch Application**
   ```bash
   # Run with Docker (Recommended)
   docker-compose up --build
   ```
   *Frontend running on: `http://localhost:3000`*
   *Backend running on: `http://localhost:3210`*

---

## ![API Documentation](https://img.shields.io/badge/Docs-API_Reference-lightgrey?style=for-the-badge)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/bonds` | List all available infrastructure bonds |
| `GET` | `/api/v1/bonds/:id/analytics` | Get AI-driven predictions for a bond |
| `POST` | `/api/v1/trading/buy` | Execute a buy order (Paper/Real) |
| `GET` | `/api/v1/portfolio` | Fetch user current holdings & PnL |

> Full Swagger documentation available at `/api-docs`

---

## ![Roadmap](https://img.shields.io/badge/Project-Roadmap-yellow?style=for-the-badge)

- [x] **Phase 1**: Core Platform & Tokenization (MVP for CIH3.0)
- [ ] **Phase 2**: Mobile App (React Native) & Secondary Market
- [ ] **Phase 3**: Institutional Dashboard & Cross-chain Bridge

---

## ![Team](https://img.shields.io/badge/Team-Co_Devians-blueviolet?style=for-the-badge)

| Role | Name | Link |
| :--- | :--- | :--- |
| ![Team Leader](https://img.shields.io/badge/Team_Leader-FFD700?style=for-the-badge&logo=probot&logoColor=black) | **Pranay Gajbhiye** | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/pranaygajbhiye/) |
| ![Backend](https://img.shields.io/badge/Backend-000000?style=for-the-badge&logo=nodedotjs&logoColor=white) | **Abhijit Dohe** | |
| ![Management](https://img.shields.io/badge/Management-4caf50?style=for-the-badge&logo=google-sheets&logoColor=white) | **Vineet Mandalkar** | |
| ![Frontend](https://img.shields.io/badge/Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black) | **Samiksh Gupta** | |

---

<div align="center">
  <sub>Built with ❤️ for <b>Central India Hackathon 3.0</b></sub>
</div>
