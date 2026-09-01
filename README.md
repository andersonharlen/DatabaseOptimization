<p align="right">
  <a href="README.pt-BR.md">
    <img src="https://img.shields.io/badge/Language-Portugu%C3%AAs-green?style=for-the-badge" alt="Versão em Português" />
  </a>
</p>

> 💬 **Prefer to read in Portuguese?** Check out [README.pt-BR.md](README.pt-BR.md).

---

# 🚀 Database Performance Engineering & Tuning Simulator

An interactive simulator for high-performance engineering, I/O cost analysis, and relational database tuning. Designed to demonstrate in practice how to identify and resolve bottlenecks in high-concurrency scenarios and large-scale tables (10K to 5M+ records).

🌐 **Live Application:** [https://database-optimization-nine.vercel.app/](https://database-optimization-nine.vercel.app/)

---

## 🛠️ Tech Stack & Technologies

### Programming Languages
* **C# (.NET 9):** Asynchronous REST API, benchmark logic, and high-performance data manipulation.
* **TypeScript:** Reactive UI development, HTTP integration services, and strict front-end typing.
* **SQL (PostgreSQL):** Data modeling, partial/composite index design, and execution plan analysis (`EXPLAIN ANALYZE`).
* **HTML5 & CSS3:** Structure and layout for the real-time metrics dashboard.

### Frameworks & Libraries
* **.NET 9 Web API:** Back-end platform configured with dynamic port binding and permissive CORS policies.
* **Angular 19:** Single Page Application (SPA) framework for dynamic rendering and scenario comparison.
* **Entity Framework Core (EF Core):** ORM utilized in query optimization tests (`AsNoTracking`, Eager Loading, and DTO projections).
* **Npgsql:** High-performance driver for C# to PostgreSQL communication.

### Infrastructure, Containers & Cloud
* **Docker:** API containerization via multi-stage `Dockerfile` for lightweight, reproducible builds.
* **Vercel:** Global serverless hosting and continuous delivery (CI/CD) for the Angular front-end.
* **Render:** PaaS platform running the API's Docker container in the cloud.
* **Neon PostgreSQL:** Serverless relational database with isolated instances and encrypted SSL connections.

---

## ⚡ Simulated Tuning Scenarios

* **1. Full Table Scan vs. Indexing:** Sequential scan over millions of records versus composite/covering indexes, reducing execution time by over 98%.
* **2. The N+1 Problem (ORM):** Mitigation of multiple sequential queries fired by ORMs using Eager Loading (`Include`) and clean SQL projections.
* **3. High-Performance Pagination (OFFSET vs. Keyset):** Demonstration of `OFFSET` performance degradation in deep datasets vs. cursor-based indexed seeking (*Keyset Pagination / Seek Method*).

---

## 📊 Communication Architecture


[ Angular SPA (Vercel) ] ──(HTTPS/JSON)──> [ .NET 9 API in Docker (Render) ] ──(TLS/SSL)──> [ PostgreSQL (Neon) ]
💻 Local Execution Guide
Prerequisites
.NET 9 SDK

Node.js (v18+) & Angular CLI

Docker Desktop (optional)

1. Clone the Repository
Bash
git clone [https://github.com/your-username/database-optimization.git](https://github.com/your-username/database-optimization.git)
cd database-optimization
2. Run the Back-end API (.NET 9)
Bash
cd src/DatabaseOptimization.Api
dotnet restore
dotnet run
3. Run via Docker
Bash
docker build -t database-optimization-api .
docker run -p 8080:8080 -e DATABASE_URL="your_connection_string" database-optimization-api
4. Run the Front-end (Angular)
Bash
cd src/database-optimization-web
npm install
ng serve
Access http://localhost:4200/ in your browser.


---

**Arquivo 2: `README.pt-BR.md` (Português)**

<p align="right">
  <a href="README.md">
    <img src="https://img.shields.io/badge/Language-English-blue?style=for-the-badge" alt="English Version" />
  </a>
</p>

> 💬 **Prefere ler em inglês?** Acesse o [README.md](README.md).

---

# 🚀 Simulador de Engenharia de Performance & Tuning de Banco de Dados

Um simulador interativo de engenharia de alta performance, análise de custos de I/O e *tuning* de banco de dados relacional. Projetado para demonstrar na prática a identificação e resolução de gargalos em cenários de alta concorrência e tabelas de grande escala (10K a 5M+ de registros).

🌐 **Aplicação em Produção:** [https://database-optimization-nine.vercel.app/](https://database-optimization-nine.vercel.app/)

---

## 🛠️ Tech Stack & Tecnologias

### Linguagens de Programação
* **C# (.NET 9):** Construção da API REST assíncrona, lógica de benchmark e manipulação de alta performance.
* **TypeScript:** Desenvolvimento da interface reativa, serviços de integração HTTP e tipagem no front-end.
* **SQL (PostgreSQL):** Modelagem de dados, criação de índices parciais/compostos e análise de planos de execução (`EXPLAIN ANALYZE`).
* **HTML5 & CSS3:** Estruturação e estilização do painel de métricas.

### Frameworks & Bibliotecas
* **.NET 9 Web API:** Plataforma do back-end configurada para escuta de portas dinâmicas e CORS permissivo.
* **Angular 19:** Framework SPA (*Single Page Application*) para renderização dinâmica e comparação de cenários.
* **Entity Framework Core (EF Core):** ORM utilizado nos testes de otimização de consultas (`AsNoTracking`, *Eager Loading* e projeções DTO).
* **Npgsql:** Driver de alta performance para comunicação entre C# e PostgreSQL.

### Infraestrutura, Container & Cloud
* **Docker:** Conteinerização da API .NET 9 via `Dockerfile` multi-stage para builds leves e reproduzíveis.
* **Vercel:** Hospedagem serverless global e entrega contínua (CI/CD) do front-end Angular.
* **Render:** Plataforma PaaS para execução do container Docker da API em nuvem.
* **Neon PostgreSQL:** Banco de dados relacional *Serverless* com instâncias isoladas e conexões seguras via SSL.

---

## ⚡ Cenários de Tuning Simulados

* **1. Full Table Scan vs. Indexing:** Varredura sequencial em milhões de registros contra a utilização de índices cobertos (*Covering Index*), reduzindo o tempo de consulta em mais de 98%.
* **2. O Problema N+1 (ORM):** Mitigação de múltiplas requisições sequenciais disparadas por ORMs através de *Eager Loading* (`Include`) e projeções limpas em SQL.
* **3. Paginação de Alta Performance (OFFSET vs. Keyset):** Demonstração da degradação do operador `OFFSET` em tabelas profundas vs. busca indexada por cursor (*Keyset Pagination / Seek Method*).

---

## 📊 Arquitetura de Comunicação

[ Angular SPA (Vercel) ] ──(HTTPS/JSON)──> [ API .NET 9 em Docker (Render) ] ──(TLS/SSL)──> [ PostgreSQL (Neon) ]
💻 Como Executar o Projeto Localmente
Pré-requisitos
.NET 9 SDK

Node.js (v18+) & Angular CLI

Docker Desktop (opcional)

1. Clonar o Repositório
Bash
git clone [https://github.com/seu-usuario/database-optimization.git](https://github.com/seu-usuario/database-optimization.git)
cd database-optimization
2. Rodar a API Back-end (.NET 9)
Bash
cd src/DatabaseOptimization.Api
dotnet restore
dotnet run
3. Rodar via Docker
Bash
docker build -t database-optimization-api .
docker run -p 8080:8080 -e DATABASE_URL="sua_connection_string" database-optimization-api
4. Rodar o Front-end (Angular)
Bash
cd src/database-optimization-web
npm install
ng serve
Acesse http://localhost:4200/ no seu navegador.
