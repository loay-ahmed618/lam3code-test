# SOLDOC (صلدوك) — Virtual Farm & Smart Agricultural Decision-Support Platform

SOLDOC is a bilingual (Arabic / English), NASA-data-powered agricultural decision-support platform designed for farmers, agronomists, and agricultural researchers, focusing initially on the Nile Delta and agricultural regions of Egypt.

Unlike generic dashboards, SOLDOC acts as a true decision engine that factors in farmer priorities, hard environmental/budgetary constraints, NASA satellite agro-meteorological telemetry, and multi-criteria strategy optimization.

---

## 🌟 Key Features

1. **Bilingual Experience (العربية / English)**
   - Complete Arabic RTL and English LTR layouts with localized agricultural terminology (Feddans, EGP, soil metrics).
   - Instant language switching without loss of active field state or weights.

2. **Geospatial Field Management**
   - Precise polygon boundary mapping with automated geodesic area calculation in **Feddans**, **Hectares**, and **Square Meters**.
   - Nile Delta centered (e.g. Kafr El-Sheikh, Mansoura, Damanhur) with custom coordinate inputs.

3. **Farmer Goal Intelligence Engine**
   - 6 Core Goals:
     - Yield Maximization (تعظيم الإنتاجية)
     - Water Efficiency (ترشيد مياه الري)
     - Soil Health (تحسين صحة التربة)
     - Profitability (زيادة صافي الربح)
     - Climate Resilience (المرونة المناخية)
     - Lower Input Dependency (تقليل الاعتماد على الأسمدة والمبيدات)
   - Weighted multi-criteria prioritization with strict 100% total validation.
   - Hard constraints enforcement (water quota ceilings and operational budgets). Strategies violating hard constraints are automatically marked infeasible.

4. **Real NASA POWER Agro-meteorology & Scientific Disclosures**
   - Live integration with NASA POWER Daily Point API (`T2M`, `T2M_MAX`, `ALLSKY_SFC_SW_DWN`, `PRECTOTCORR`, `RH2M`).
   - Explicit scientific disclosure: NASA satellite grids (0.5° × 0.5° ~50km) and SMAP (9-36km) provide regional climate context; they **do not directly measure field-level soil pH, NPK, or electrical conductivity (EC)** without on-site soil sampling.

5. **Multi-Strategy Comparative Analysis**
   - **Strategy A (Current Practice / Baseline)**: Traditional flood irrigation & conventional mineral inputs.
   - **Strategy B (Goal-Optimized Strategy)**: Precision drip/alternate-furrow irrigation, bio-stimulants, and targeted nutrient scheduling tailored to user priorities.
   - **Strategy C (Balanced Climate-Resilient Strategy)**: Laser land leveling, organic mulching, drought-tolerant crop cultivars, and integrated pest management (IPM).
   - Visual multi-metric radar comparison, trade-offs, and explainability breakdown.

6. **Agricultural Scenario Simulation**
   - Stress testing under hypothetical climate shocks:
     - Heat Stress (+1.5°C to +4.0°C)
     - Water Scarcity (-15% to -40% irrigation supply)
     - Combined Climate Shock

7. **Financial Analysis & Break-Even Calculator**
   - Detailed cost accounting (Seeds, Fertilizers, Irrigation, Labor, Machinery, Crop Protection).
   - Unit production costs, gross revenue, net profit margin, and break-even selling price per ton/ardeb.

8. **Agronomist Review Workflow**
   - Role-Based Access Control (RBAC): Farmer, Agronomist, Administrator.
   - Professional peer-review workflow with status tracking (`Pending Review`, `Approved`, `Changes Requested`) and feedback notes.

9. **Printable Bilingual Field Advisory Reports**
   - Complete dossier export including geospatial parameters, NASA telemetry, goal weights, strategy comparison table, scientific disclosures, and agronomist sign-off.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Python FastAPI, Pydantic v2, SQLAlchemy, Uvicorn, Passlib/Bcrypt, PyJWT.
- **Database**: SQLite (default for development) / PostgreSQL with PostGIS for production.
- **External Data Sources**:
  - NASA POWER (LaRC) Daily Agro-meteorology API.
  - Open-Meteo & OpenStreetMap.

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 1. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The API documentation is available at `http://localhost:8000/docs`.

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Running Tests

### Backend Unit & Integration Tests
Run pytest in the backend directory:
```bash
pytest backend/tests -v
```
All 15 goal intelligence, constraint verification, and strategy ranking tests run against in-memory/isolated SQLite instances.

### Frontend Verification
Playwright test automation script is provided in `/home/jules/verification/verify_soldoc.py`.

---

## 🛰️ NASA Data & Scientific Limitations Disclosure

SOLDOC adheres to strict scientific integrity standards:
1. **Resolution Notice**: NASA POWER provides gridded satellite-reanalysis data at 0.5° × 0.5° resolution (~50 km). Soil moisture from SMAP is regional (9 km to 36 km). They provide valuable macro-climatic, solar, and drought trend indicators.
2. **Soil Chemistry Disclosure**: Satellite observations **cannot** directly measure chemical soil parameters such as soil pH, NPK concentrations, salinity, or micro-nutrient deficiencies. Field-level ground truth requires certified laboratory soil testing.
3. **Exploratory Scenarios**: Climate shock simulations are decision-support heuristics and should not be confused with unvalidated biological micro-forecasts.

---

## 📄 License & Attribution
- NASA POWER API: Courtesy of the NASA Langley Research Center POWER Project.
- SOLDOC Core: Decision Support Architecture developed for Egyptian agricultural optimization.
