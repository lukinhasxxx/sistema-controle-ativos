## Objetivo do Projeto

O **AssetFlow** é um projeto prático desenvolvido para estudo e consolidação de **padrões modernos de engenharia de software**, **Clean Architecture**, **separação de responsabilidades** e **conteinerização**.

Utilizando como cenário de estudo a gestão de equipamentos corporativos (como notebooks, monitores e periféricos), o projeto simula o fluxo completo de inventário, empréstimo (check-out) e devolução (check-in) de ativos, permitindo praticar a integração entre um backend em **.NET 8** e um frontend em **Next.js 14**, saindo um pouco da zona de conforto de sempre focar frontend.

>  **Foco:** O propósito principal deste repositório é o aprendizado prático, experimentação de decisões arquiteturais e evolução contínua de boas práticas de desenvolvimento Full Stack.

---

## Arquitetura e Boas Práticas

O projeto foi estruturado utilizando arquitetura desacoplada entre cliente e servidor:

- **Backend (.NET 8):** API RESTful construída em C# seguindo princípios de Clean Architecture. Possui separação estrita de camadas: Controllers (interface HTTP), Services (regras de negócio), DTOs (contratos de entrada e saída) e Infrastructure (acesso a dados com Entity Framework Core e SQLite).
- **Validações de Domínio:** Uso do FluentValidation para garantir consistência de dados antes de processar regras de negócio.
- **Segurança de Dados:** Uso de DTOs para impedir exposição indevida de dados internos ou sensíveis.
- **Soft Delete:** Remoção lógica de ativos para preservação da integridade do histórico de empréstimos e auditorias.
- **Frontend (Next.js 14 & React):** Single Page Application (SPA) responsiva com TypeScript, CSS Modules para isolamento de estilos e componentes modulares reutilizáveis.
- **Infraestrutura (Docker):** Orquestração completa via Docker Compose com volume persistente para o banco de dados SQLite.

---

## Tecnologias Utilizadas

### Backend
- .NET 8 (C#)
- ASP.NET Core Web API
- Entity Framework Core 8
- SQLite (Banco de dados relacional)
- FluentValidation (Validação de requisições)
- xUnit & Moq (Testes unitários)
- Swagger / OpenAPI (Documentação da API)

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- CSS Modules
- React Hot Toast (Notificações)
- Lucide React & React Icons (Iconografia)

### Infraestrutura
- Docker
- Docker Compose

---

## Regras de Negócio e Funcionalidades

1. **Cadastro de Ativos:**
   - Todo equipamento deve ser registrado com nome, categoria e um **Código de Identificação único**.
2. **Listagem e Status:**
   - Visualização em tempo real de ativos cadastrados e seus status (`Disponível` ou `Em uso`).
3. **Check-out (Realizar Empréstimo):**
   - Apenas equipamentos com o status `Disponível` podem ser emprestados. Ao realizar o check-out, o sistema altera o status para `Em uso` e vincula o usuário/setor solicitante e a data do empréstimo.
4. **Check-in (Registrar Devolução):**
   - O item retorna ao status `Disponível`. O sistema registra a data de devolução, finalizando o ciclo.
5. **Remover Ativo (Soft Delete):**
   - Ativos danificados ou aposentados são desativados logicamente da listagem, mantendo os registros históricos intactos no banco de dados.

---

## Como Rodar a Aplicação

### Pré-requisitos
- Docker e Docker Compose instalados **OU** SDK do .NET 8 e Node.js 18+ para execução local.

### Opção 1: Via Docker Compose (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/lukinhasxxx/sistema-controle-ativos.git
   cd projetoassets
   ```

2. Execute o orquestrador:
   ```bash
   docker compose up --build -d
   ```

3. Acesse as aplicações:
   - **Frontend:** http://localhost:3000
   - **Backend API (Swagger):** http://localhost:5218

Para parar os contêineres:
```bash
docker compose down
```

---

### Opção 2: Execução Manual (Desenvolvimento)

1. **Backend:**
   ```bash
   cd backend/src/AtivosApi
   dotnet run
   ```

2. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

---

## Estrutura do Repositório

```text
├── backend/
│   ├── src/AtivosApi/
│   │   ├── Domain/            # Entidades, DTOs, Interfaces, Validators e Services
│   │   ├── Infrastructure/    # DbContext, Mapeamentos EF e Migrations
│   │   └── Controllers/       # Endpoints REST
│   └── tests/AtivosApi.Tests/ # Testes Unitários com xUnit
├── frontend/
│   ├── src/
│   │   ├── app/               # Páginas e Rotas do Next.js (App Router)
│   │   ├── components/        # Componentes reutilizáveis (Common e Features)
│   │   ├── services/          # Comunicação HTTP com a API
│   │   └── styles/            # Estilos CSS Modules e Globais
└── docker-compose.yml         # Orquestração do ambiente
```
