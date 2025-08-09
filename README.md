# 🌱 Guia Orgânico

Uma plataforma digital para produtores e certificadoras que simplifica o acesso a informações sobre insumos autorizados, agiliza solicitações de autorização e conecta o setor da agricultura orgânica.

## 🌐 Acesse o Guia Orgânico

Em breve disponível online (Vercel).

## Documentação

Este projeto conta com documentação técnica completa seguindo padrões de **Engenharia de Software**

- **📚 [Documentação Técnica](./docs/GUIA_ORGANICO_DOCUMENTACAO.md)** – Diagramas UML, estrutura do projeto, roadmap e métricas.

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
  - Padrões de projeto: em uso (Singleton) e planejados (Repository, MVC, Observer, Factory).

## Licença

Uso acadêmico pelos autores. Todos os direitos reservados.

## Equipe

_Equipe formada originalmente para o protótipo apresentado na GeniusCom AgroHackathon 2024._

- Ana Júlia Rossato – Marketing, networking
- Kimberly Fujii Yamaçake – Tesoureira, networking
- Anna Flávia Guenta Tsurushima – Programadora
- João Cláudio Fernandes Michelato Colaço – Programador, designer
- Matheus Zanelatto Simon – Programador, designer, networking

## Instituição

- UENP – Universidade Estadual do Norte do Paraná

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 🐛 Reportar Problemas

Encontrou um bug ou tem uma sugestão? Abra uma [issue](https://github.com/J0aoD3v/Guia-Organico/issues) descrevendo:

- Descrição do problema
- Passos para reproduzir
- Comportamento esperado
- Capturas de tela (se aplicável)
- Ambiente (navegador, versão, sistema operacional)

---

---

**Desenvolvido por:** João Cláudio Fernandes Michelato Colaço

- 📧 Email: jcmichelato8@gmail.com
- 💼 LinkedIn: [j0aod3v](https://www.linkedin.com/in/j0aod3v/)
- 🐙 GitHub: [@J0aoD3v](https://github.com/J0aoD3v)

**Guia Orgânico** – Simplificando a agricultura orgânica com tecnologia! 🌱
