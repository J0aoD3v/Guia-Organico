# 🌱 Guia Orgânico

Uma plataforma digital para produtores e certificadoras que simplifica o acesso a informações sobre insumos autorizados, agiliza solicitações de autorização e conecta o setor da agricultura orgânica.

## 🌐 Acesse o Guia Orgânico

Em breve disponível online (Vercel).

## Documentação

- Consulte a documentação técnica enxuta: [docs/GUIA_ORGANICO_DOCUMENTACAO.md](./docs/GUIA_ORGANICO_DOCUMENTACAO.md).

## Estado atual

- Next.js + TypeScript configurados.
- Conexão MongoDB (`src/lib/db.ts`).
- Endpoint GET `/api/products` lista documentos da coleção `products`.

## 🎯 Objetivo

- Centralizar informações sobre insumos permitidos por certificadoras.
- Permitir busca por texto, categoria ou foto (planejado).
- Padronizar solicitações de autorização de insumos (planejado).
- Dar mais autonomia para produtores.
- Otimizar processos para certificadoras.

## 🚀 Funcionalidades

Implementado (MVP atual):

- App base Next.js + TypeScript.
- Conexão com MongoDB.
- API GET `/api/products` (listagem simples).

Planejado:

- Busca por insumos (texto, categoria, imagem).
- Cadastro de solicitações para certificadoras.
- Painel Admin para gestão de insumos e pedidos.
- Notificações por e-mail para novas solicitações.

## 🛠️ Tecnologias

Em uso:

- Next.js 15, React 19, TypeScript.
- MongoDB Atlas (driver `mongodb`).

Planejadas/avaliadas:

- TailwindCSS (estilização).
- NextAuth.js (autenticação).
- Resend/Nodemailer (emails).
- Cloudinary (imagens).
- PostgreSQL (alternativa futura, se necessário).

## Como rodar localmente

1. Copie `.env.example` para `.env` e preencha `MONGODB_URI`.
2. Instale dependências e inicie o servidor de desenvolvimento.

## Próximos passos (curto prazo)

- Definir nome do banco em `client.db('<nome>')`.
- Iniciar CRUD de produtos e criar `components/` conforme a UI evoluir.

## 📅 Roadmap resumido

1. MVP inicial: estrutura do app, conexão MongoDB, GET `/api/products`, iniciar CRUD.
2. Solicitações e notificações: fluxo completo de pedidos de autorização (planejado).
3. Busca avançada e filtros (planejado).
4. Recursos extras: estatísticas e área pública (planejado).

## 📚 Normas e padrões

- Consulte detalhes na documentação: [docs/GUIA_ORGANICO_DOCUMENTACAO.md](./docs/GUIA_ORGANICO_DOCUMENTACAO.md)
  - Normas: ISO/IEC 25010, IEEE 830, ISO/IEC 12207 (referência metodológica).
  - Padrões de projeto: em uso (Singleton) e planejados (Repository, MVC/DDD, Observer, Factory).

## Licença

Uso acadêmico pelos autores. Todos os direitos reservados.

## Equipe

- Ana Júlia Rossato – Líder, marketing, networking
- Kimberly Fujii Yamaçake – Tesoureira, networking
- Anna Flávia Guenta Tsurushima – Programadora
- João Cláudio Fernandes Michelato Colaço – Programador, designer
- Matheus Zanelatto Simon – Programador, designer, networking

## Instituição

- UENP – Universidade Estadual do Norte do Paraná
