# 🚀 Integração com MySQL - Guia Rápido

## 🔧 Setup Rápido

### 1️⃣ Instalar dependências
```bash
cd server
npm install
```

### 2️⃣ Configurar ambiente
```bash
# Copiar template
cp .env.example .env

# Editar .env com suas credenciais MySQL
# Exemplo:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=sua_senha
# DB_NAME=arnold_db
```

### 3️⃣ Criar banco de dados (escolha uma opção)

**Opção A: SQL manual - Copiar e Colar**

Abra um cliente MySQL (MySQL Workbench, CLI, etc) e execute este código:

```sql
-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS arnold_db;
USE arnold_db;

-- Criar tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Criar índice no email para melhorar performance
CREATE INDEX idx_email ON users(email);
```

**Opção B: Via CLI**
```bash
mysql -u root -p < server/setup.sql
```

### 4️⃣ Iniciar servidor
```bash
npm run start
# ou com auto-reload:
npm run dev
```

## 📊 Estrutura MySQL

### Banco: `arnold_db`
### Tabela: `users`
```sql
- id (INT, auto-increment, PK)
- name (VARCHAR 255)
- email (VARCHAR 255, UNIQUE)
- password (VARCHAR 255, hashed)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Autenticação
```bash
# Register
POST /users
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}

# Login
POST /users/login
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

### CRUD Usuários
```bash
# Listar todos
GET /users

# Obter um
GET /users/1

# Atualizar
PUT /users/1
{
  "name": "Novo Nome",
  "email": "novo@email.com",
  "password": "nova_senha"
}

# Deletar
DELETE /users/1
```

## 🐛 Troubleshooting

| Erro | Solução |
|------|---------|
| `Access denied for user 'root'` | Verifique `.env` - credenciais MySQL incorretas |
| `Unknown database 'arnold_db'` | Execute o SQL da Opção A (Copiar e Colar) para criar |
| `Port 4000 already in use` | Altere `PORT` no `.env` |
| `connect ECONNREFUSED` | MySQL não está rodando |

## 📝 Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DB_HOST` | Host MySQL | `localhost` |
| `DB_PORT` | Porta MySQL | `3306` |
| `DB_USER` | Usuário MySQL | `root` |
| `DB_PASSWORD` | Senha MySQL | `sua_senha` |
| `DB_NAME` | Nome do banco | `arnold_db` |
| `NODE_ENV` | Ambiente | `development` |
| `PORT` | Porta do servidor | `4000` |

## ✨ Resumo das Mudanças

✅ Backend agora usa MySQL em vez de arquivo JSON
✅ Configuração segura via `.env` (não commitado)
✅ Script automático para setup do banco
✅ Todas as credenciais centralizadas
✅ Pronto para produção

## 🎯 Próximos Passos

1. Configure o `.env` com suas credenciais MySQL
2. Execute o SQL (Opção A) para criar o banco e tabelas
3. Execute `npm install` na pasta server
4. Inicie o servidor com `npm run start`
5. Frontend conecta automaticamente a `http://localhost:4000`
