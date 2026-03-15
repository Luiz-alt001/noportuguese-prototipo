# NoPortuguese — Protótipo

Protótipo completo da plataforma NoPortuguese — site institucional, área do aluno, professor e admin, pagamento e agendamento.

**Stack:** Vercel · Supabase · MercadoPago

---

## Estrutura de arquivos

```
/
├── public/          → site institucional (SPA)
├── aluno/           → área do aluno (SPA)
├── professor/       → área do professor (SPA)
├── admin/           → painel admin (SPA)
├── api/             → Serverless Functions
│   ├── auth/        → login, logout
│   ├── webhooks/    → MercadoPago
│   ├── aluno/       → endpoints do aluno
│   ├── professor/   → endpoints do professor
│   ├── admin/       → endpoints do admin
│   └── health.js    → health check
├── lib/
│   ├── supabase.js        → cliente público (anon key)
│   ├── supabase-admin.js  → cliente admin (service role)
│   ├── mercadopago.js     → cliente MP + validação HMAC
│   └── auth.js            → middleware de autenticação
├── vercel.json
├── package.json
├── .gitignore
└── .env.local.example     → modelo de variáveis de ambiente
```

## Como rodar localmente

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/noportuguese-prototipo.git
cd noportuguese-prototipo

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.local.example .env.local
# Edite .env.local com suas chaves do Supabase e MercadoPago

# 4. Instale a Vercel CLI
npm i -g vercel

# 5. Rode o servidor local
vercel dev

# 6. Acesse
# http://localhost:3000
```

## Credenciais de teste

| Perfil | E-mail | Senha |
|---|---|---|
| Admin | admin@demo.com | demo123 |
| Professor | prof@demo.com | demo123 |
| Aluno (ativo) | aluno@demo.com | demo123 |

## Fluxo de login

```
POST /api/auth/login
  → Supabase Auth: signInWithPassword
  → Busca role na tabela usuarios
  → admin     → /admin/dashboard.html
  → professor → /professor/dashboard.html
  → aluno     → /aluno/dashboard.html  (se matrícula ativa)
              → /aluno/mensalidade.html (se inativa)
```
