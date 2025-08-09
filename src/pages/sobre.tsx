import Head from "next/head";
import Navbar from "../components/Navbar";

export default function Sobre() {
  return (
    <>
      <Head>
        <title>Sobre o Guia Orgânico</title>
      </Head>
      <Navbar />
      <main style={{ maxWidth: 900, margin: "30px auto", padding: 20 }}>
        <h2>Nosso Propósito</h2>
        <p>Uma plataforma que dá mais autonomia ao produtor e otimiza o trabalho das certificadoras.</p>
        <h3>O Problema</h3>
        <p>Desafios na busca por informações de insumos autorizados e processos de autorização lentos.</p>
        <h3>O Mercado</h3>
        <p>Dados, legislação e números relevantes do setor orgânico.</p>
        <h3>A Solução</h3>
        <p>Catálogo pesquisável, fluxo de autorização e integração com certificadoras.</p>
        <h3>Benefícios</h3>
        <ul>
          <li>Agilidade para produtores</li>
          <li>Padronização para certificadoras</li>
          <li>Centralização de informações</li>
        </ul>
      </main>
    </>
  );
}
