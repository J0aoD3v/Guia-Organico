import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import type { Product } from "../../types/product";

export default function InsumosPage() {
  const router = useRouter();
  const [produtos, setProdutos] = useState<Product[]>([]);
  const [filteredProdutos, setFilteredProdutos] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Lista de categorias disponíveis
  const categorias = [
    "Fertilizantes",
    "Defensivos",
    "Sementes",
    "Inoculantes",
    "Corretivos",
    "Condicionadores",
    "Bioestimulantes"
  ];

  useEffect(() => {
    fetchTodosProdutos();
  }, []);

  useEffect(() => {
    filterProdutos();
  }, [searchTerm, selectedCategory, produtos]);

  const fetchTodosProdutos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/produtos/todos");
      const data = await response.json();
      setProdutos(data);
      setFilteredProdutos(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProdutos = () => {
    let filtered = [...produtos];

    // Filtrar por categoria
    if (selectedCategory) {
      filtered = filtered.filter(produto => 
        produto.categoria?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filtrar por texto de busca
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(produto =>
        produto.nome?.toLowerCase().includes(searchLower) ||
        produto.fabricante?.toLowerCase().includes(searchLower) ||
        produto.categoria?.toLowerCase().includes(searchLower) ||
        produto.certificacao?.toLowerCase().includes(searchLower) ||
        produto.classeAgronomica?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProdutos(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilteredProdutos(produtos);
  };

  return (
    <>
      <Head>
        <title>Todos os Insumos Orgânicos - Guia Orgânico</title>
        <meta name="description" content="Explore todos os insumos orgânicos disponíveis no catálogo oficial do Guia Orgânico" />
      </Head>
      <Navbar />
      <main style={{ maxWidth: 1200, margin: "30px auto", padding: 20 }}>
        {/* Breadcrumb */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "8px", 
          marginBottom: "20px",
          color: "#6b7280",
          fontSize: "14px"
        }}>
          <Link href="/" style={{ color: "#0070f3", textDecoration: "none" }}>Início</Link>
          <span>&gt;</span>
          <span>Todos os Insumos</span>
        </div>

        {/* Cabeçalho */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ marginBottom: "8px", color: "#111827" }}>🌱 Catálogo de Insumos Orgânicos</h1>
          <p style={{ color: "#6b7280", margin: 0 }}>
            {loading ? "Carregando..." : `${filteredProdutos.length} de ${produtos.length} produto(s)`}
          </p>
        </div>

        {/* Filtros */}
        <div style={{ 
          background: "#f9fafb", 
          border: "1px solid #e5e7eb", 
          borderRadius: "8px", 
          padding: "20px", 
          marginBottom: "24px" 
        }}>
          <h3 style={{ margin: "0 0 16px 0", color: "#374151" }}>🔍 Filtros</h3>
          
          {/* Busca por texto */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#374151" }}>
              Buscar por nome, fabricante ou descrição:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Digite sua busca..."
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px"
              }}
            />
          </div>

          {/* Filtro por categoria */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: "500", color: "#374151" }}>
              Filtrar por categoria:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                background: "white"
              }}
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>
          </div>

          {/* Botões de ação */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button
              onClick={clearFilters}
              style={{
                padding: "6px 12px",
                border: "1px solid #d1d5db",
                background: "white",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              Limpar Filtros
            </button>
            <button
              onClick={() => router.push("/categorias")}
              style={{
                padding: "6px 12px",
                border: "1px solid #059669",
                background: "#ecfdf5",
                color: "#059669",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "14px"
              }}
            >
              📂 Ver por Categorias
            </button>
          </div>
        </div>

        {/* Resultados */}
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "200px",
            fontSize: "18px",
            color: "#6b7280"
          }}>
            🔄 Carregando...
          </div>
        ) : filteredProdutos.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px",
            color: "#6b7280",
            background: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{ marginBottom: "8px" }}>Nenhum produto encontrado</h3>
            <p style={{ margin: "0 0 16px 0" }}>
              Tente ajustar os filtros ou limpar a busca para ver mais resultados.
            </p>
            <button
              onClick={clearFilters}
              style={{
                padding: "8px 16px",
                background: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Limpar Filtros
            </button>
          </div>
        ) : (
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", 
            gap: "16px" 
          }}>
            {filteredProdutos.map((produto) => (
              <div
                key={produto._id} 
                style={{ 
                  border: "1px solid #e5e7eb", 
                  borderRadius: "8px", 
                  padding: "16px",
                  background: "white",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                onClick={() => router.push(`/insumos/${produto._id}`)}
              >
                <div style={{ marginBottom: "12px" }}>
                  <h3 style={{ margin: "0 0 4px 0", color: "#111827", fontSize: "16px" }}>
                    {produto.nome}
                  </h3>
                  <span style={{ 
                    background: "#dbeafe", 
                    color: "#1e40af", 
                    padding: "2px 8px", 
                    borderRadius: "4px", 
                    fontSize: "12px",
                    fontWeight: "500"
                  }}>
                    {produto.categoria}
                  </span>
                </div>
                
                <div style={{ color: "#6b7280", fontSize: "14px", marginBottom: "12px" }}>
                  <div style={{ marginBottom: "4px" }}>
                    <strong>Fabricante:</strong> {produto.fabricante || "-"}
                  </div>
                  {produto.classeAgronomica && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Classe:</strong> {produto.classeAgronomica}
                    </div>
                  )}
                  {produto.certificacao && (
                    <div style={{ marginBottom: "4px" }}>
                      <strong>Certificação:</strong> {produto.certificacao}
                    </div>
                  )}
                </div>
                
                <button 
                  style={{ 
                    width: "100%",
                    padding: "8px 12px", 
                    background: "#0070f3", 
                    color: "white", 
                    border: "none", 
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500"
                  }}
                >
                  Ver Detalhes →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
