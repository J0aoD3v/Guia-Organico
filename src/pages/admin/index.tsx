import Head from "next/head";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function AdminPanel() {
	const { data: session } = useSession();

	return (
		<ProtectedRoute requiredRole="admin">
			<>
				<Head>
					<title>Painel Admin - Guia Orgânico</title>
				</Head>
				<Navbar />
				<main style={{ maxWidth: 1200, margin: '20px auto', padding: 20 }}>
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
						<span>Painel Admin</span>
					</div>

					<div style={{ 
						backgroundColor: "#fef2f2",
						padding: "16px",
						borderRadius: "8px",
						border: "1px solid #fecaca",
						marginBottom: "24px"
					}}>
						<div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
							<span style={{ fontSize: "20px" }}>⚠️</span>
							<h3 style={{ margin: 0, color: "#dc2626" }}>Acesso Restrito</h3>
						</div>
						<p style={{ margin: 0, color: "#7f1d1d" }}>
							Esta área é exclusiva para administradores do sistema.
						</p>
					</div>

					<h1 style={{ marginBottom: 20, color: '#333' }}>
						🔧 Painel Administrativo
					</h1>
          
					{session?.user && (
						<div style={{ 
							backgroundColor: '#f0f9ff',
							padding: '16px',
							borderRadius: '8px',
							marginBottom: '24px',
							border: '1px solid #bae6fd'
						}}>
							<p style={{ margin: 0, color: '#0c4a6e' }}>
								<strong>Bem-vindo, {session.user.name}!</strong><br />
								Email: {session.user.email}
							</p>
						</div>
					)}

					<div style={{ 
						display: 'grid', 
						gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
						gap: 20 
					}}>
            
						{/* Gerenciar Produtos */}
						<div style={{ 
							backgroundColor: '#f8fafc',
							padding: 20,
							borderRadius: 8,
							border: '1px solid #e2e8f0'
						}}>
							<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
								📦 Gerenciar Produtos
							</h3>
							<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
								Adicionar, editar e remover insumos do catálogo
							</p>
							<button style={{
								backgroundColor: '#3b82f6',
								color: 'white',
								border: 'none',
								padding: '8px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}>
								Acessar
							</button>
						</div>

						{/* Autorização de Pedidos */}
						<div style={{ 
							backgroundColor: '#f8fafc',
							padding: 20,
							borderRadius: 8,
							border: '1px solid #e2e8f0'
						}}>
							<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
								✅ Autorização de Pedidos
							</h3>
							<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
								Revisar e aprovar solicitações de autorização
							</p>
							<button style={{
								backgroundColor: '#10b981',
								color: 'white',
								border: 'none',
								padding: '8px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}>
								Acessar
							</button>
						</div>

						{/* Gerenciar Usuários */}
						<div style={{ 
							backgroundColor: '#f8fafc',
							padding: 20,
							borderRadius: 8,
							border: '1px solid #e2e8f0'
						}}>
							<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
								👥 Gerenciar Usuários
							</h3>
							<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
								Administrar contas de usuários e permissões
							</p>
							<button style={{
								backgroundColor: '#8b5cf6',
								color: 'white',
								border: 'none',
								padding: '8px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}>
								Acessar
							</button>
						</div>

						{/* Relatórios */}
						<div style={{ 
							backgroundColor: '#f8fafc',
							padding: 20,
							borderRadius: 8,
							border: '1px solid #e2e8f0'
						}}>
							<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
								📊 Relatórios
							</h3>
							<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
								Estatísticas de uso e relatórios do sistema
							</p>
							<button style={{
								backgroundColor: '#f59e0b',
								color: 'white',
								border: 'none',
								padding: '8px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}>
								Acessar
							</button>
						</div>

					</div>

					{/* Voltar */}
					<div style={{ marginTop: '32px', textAlign: 'center' }}>
						<Link 
							href="/"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								padding: '12px 24px',
								backgroundColor: '#6b7280',
								color: 'white',
								textDecoration: 'none',
								borderRadius: '8px',
								fontSize: '14px'
							}}
						>
							← Voltar ao Início
						</Link>
					</div>
				</main>
			</>
		</ProtectedRoute>
	);
}
