import React from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import ProtectedRoute from "../../components/auth/ProtectedRoute";
import Navbar from "../../components/Navbar";
import Link from "next/link";

export default function AdminPanel() {
	const { data: session } = useSession();

		const [pedidos, setPedidos] = React.useState<any[]>([]);
		const [loading, setLoading] = React.useState(true);
		React.useEffect(() => {
			async function fetchPedidos() {
				setLoading(true);
				const res = await fetch('/api/pedidos');
				const data = await res.json();
				setPedidos(data);
				setLoading(false);
			}
			fetchPedidos();
		}, []);

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

						{/* Cards de gestão */}
						<div style={{ 
							display: 'grid', 
							gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
							gap: 20 
						}}>
							{/* ...existing code... */}
						</div>

						{/* Listagem de pedidos */}
						<div style={{ marginTop: 40 }}>
							<h2 style={{ color: '#1e293b', marginBottom: 16 }}>📋 Pedidos Solicitados</h2>
							{loading ? (
								<p>Carregando pedidos...</p>
							) : pedidos.length === 0 ? (
								<p style={{ color: '#64748b' }}>Nenhum pedido solicitado ainda.</p>
							) : (
								<div style={{ overflowX: 'auto' }}>
									<table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e5e7eb' }}>
										<thead>
											<tr style={{ background: '#f3f4f6', color: '#374151' }}>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Data</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Usuário</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Produto</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Categoria</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Finalidade</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Ficha</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb' }}>Bula</th>
											</tr>
										</thead>
										<tbody>
											{pedidos.map((p) => (
												<tr key={p._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
													<td style={{ padding: 10 }}>{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
													<td style={{ padding: 10 }}>{p.email || '-'}</td>
													<td style={{ padding: 10 }}>{p.nome || '-'}</td>
													<td style={{ padding: 10 }}>{p.categoria || '-'}</td>
													<td style={{ padding: 10 }}>{p.finalidade || '-'}</td>
													<td style={{ padding: 10 }}>
														{p.fichaPath ? <a href={`/${p.fichaPath}`} target="_blank" rel="noopener noreferrer">Ficha</a> : '-'}
													</td>
													<td style={{ padding: 10 }}>
														{p.bulaPath ? <a href={`/${p.bulaPath}`} target="_blank" rel="noopener noreferrer">Bula</a> : '-'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
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
