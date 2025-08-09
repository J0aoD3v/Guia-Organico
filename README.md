# 🌱 Guia Orgânico

Plataforma Next.js em desenvolvimento inicial.

## Documentação

- Consulte a documentação técnica enxuta: [docs/GUIA_ORGANICO_DOCUMENTACAO.md](./docs/GUIA_ORGANICO_DOCUMENTACAO.md).

## Estado atual

- Next.js + TypeScript configurados.
- Conexão MongoDB (`src/lib/db.ts`).
- Endpoint GET `/api/products` lista documentos da coleção `products`.

## Como rodar localmente

1. Copie `.env.example` para `.env` e preencha `MONGODB_URI`.
2. Instale dependências e inicie o servidor de desenvolvimento.

## Próximos passos (curto prazo)

- Definir nome do banco em `client.db('<nome>')`.
- Iniciar CRUD de produtos e criar `components/` conforme a UI evoluir.

## Licença

Uso acadêmico pelos autores. Todos os direitos reservados.
