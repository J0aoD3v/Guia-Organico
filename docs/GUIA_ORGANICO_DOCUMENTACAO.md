# 📗 Guia Orgânico — Documentação

Documento enxuto e alinhado ao estado atual do projeto. Itens aspiracionais foram movidos para “Futuro” para evitar ambiguidades.

## 1) Estrutura de Pastas (estado atual)

```plaintext
guia-organico/
├── docs/
│   └── GUIA_ORGANICO_DOCUMENTACAO.md
├── src/
│   ├── lib/
│   │   └── db.ts                 # Conexão MongoDB
│   └── pages/
│       ├── index.tsx             # Página inicial
│       └── api/
│           └── products.ts       # Listagem de produtos (GET)
├── next-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

Observações:
- Pastas como `public/`, `components/`, `hooks/`, `styles/`, `prisma/` e `tests/` não possuem conteúdo no momento (ou ainda não existem). Crie-as conforme a necessidade durante o desenvolvimento.
- Existe um arquivo `.env` local (não deve ser versionado). O repositório agora contém um `.env.example` com o nome das variáveis esperadas.

## 2) Escopo atual

- App Next.js + TypeScript inicializado.
- Conexão com MongoDB via `mongodb` em `src/lib/db.ts` (padrão Singleton).
- Rota GET `/api/products` retornando documentos da coleção `products`.

## 3) Convenções e padrões (objetivo e direto)

- Linguagem: TypeScript.
- Framework: Next.js 15 (conforme package.json).
- Banco: MongoDB Atlas (URI via variável de ambiente `MONGODB_URI`).
- Estilo de código: seguir o padrão do Next.js/TS por enquanto; linters poderão ser adicionados depois.

Padrões de projeto em uso agora:
- Singleton: reuso da conexão MongoDB (`db.ts`).

Padrões planejados (quando o escopo crescer):
- Repository (encapsular acesso a dados),
- MVC/DDD (organização de camadas),
- Observer (notificações/tempo real),
- Factory (criação de entidades).

## 4) Diagramas (status)

Os diagramas de casos de uso, classes e sequência originalmente descritos representam a visão futura do produto. Para o escopo atual (MVP inicial), eles são referenciais e não refletem funcionalidades implementadas. Mantidos como “Futuro” para não confundir.

## 5) Roadmap compacto

Concluído (MVP inicial):
- Projeto Next.js com TypeScript.
- Dependência `mongodb` instalada e conexão implementada.
- Endpoint GET `/api/products` funcional.

Próximos passos imediatos:
- Não versionar `.env` (usar `.gitignore`).
- Definir nome do banco explícito em `client.db('<nome>')` para evitar ambiguidade.
- Criar `public/` (ativos estáticos) e `components/` conforme a UI evoluir.
- Definir modelos/validação para `products` e iniciar CRUD completo.

Futuro (após CRUD):
- Fluxo de solicitações e notificações (email).
- Painel admin.
- Testes automatizados e métricas.

## 6) Métricas (após MVP)

Definir metas de desempenho e qualidade depois que o CRUD estiver estável (ex.: tempo de resposta da API, cobertura de testes, LCP).

## 7) Variáveis de ambiente

Criar um arquivo `.env` local com:

```
MONGODB_URI="mongodb+srv://<usuario>:<senha>@<cluster>/?retryWrites=true&w=majority"
```

Nunca commitar `.env`. Use o `.env.example` como referência.

