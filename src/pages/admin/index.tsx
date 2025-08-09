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
							gap: 20,
							marginBottom: 40
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
									Revisar e aprovar solicitações de autorização ({pedidos.length} pendentes)
								</p>
								<button 
									onClick={() => document.getElementById('pedidos-section')?.scrollIntoView({ behavior: 'smooth' })}
									style={{
										backgroundColor: '#10b981',
										color: 'white',
										border: 'none',
										padding: '8px 16px',
										borderRadius: '6px',
										cursor: 'pointer',
										fontSize: '14px'
									}}
								>
									Ver Pedidos ({pedidos.length})
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

							{/* Gestão de Produtos */}
							<div style={{ 
								backgroundColor: '#f8fafc',
								padding: 20,
								borderRadius: 8,
								border: '1px solid #e2e8f0'
							}}>
								<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
									🌱 Gestão de Produtos
								</h3>
								<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
									Adicionar, editar e gerenciar produtos orgânicos
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

							{/* Configurações */}
							<div style={{ 
								backgroundColor: '#f8fafc',
								padding: 20,
								borderRadius: 8,
								border: '1px solid #e2e8f0'
							}}>
								<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
									⚙️ Configurações
								</h3>
								<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
									Configurar limites, notificações e sistema
								</p>
								<button style={{
									backgroundColor: '#6b7280',
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

							{/* Logs e Auditoria */}
							<div style={{ 
								backgroundColor: '#f8fafc',
								padding: 20,
								borderRadius: 8,
								border: '1px solid #e2e8f0'
							}}>
								<h3 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
									📋 Logs e Auditoria
								</h3>
								<p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '14px' }}>
									Acompanhar atividades e logs do sistema
								</p>
								<button style={{
									backgroundColor: '#dc2626',
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

						{/* Listagem de pedidos */}
						<div id="pedidos-section" style={{ marginTop: 40 }}>
							<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
								<h2 style={{ color: '#1e293b', margin: 0 }}>📋 Pedidos Solicitados</h2>
								<div style={{ display: 'flex', gap: 12 }}>
									<button 
										onClick={() => window.location.reload()}
										style={{
											padding: '8px 16px',
											backgroundColor: '#6b7280',
											color: 'white',
											border: 'none',
											borderRadius: '6px',
											cursor: 'pointer',
											fontSize: '14px'
										}}
									>
										🔄 Atualizar
									</button>
									<button 
										style={{
											padding: '8px 16px',
											backgroundColor: '#10b981',
											color: 'white',
											border: 'none',
											borderRadius: '6px',
											cursor: 'pointer',
											fontSize: '14px'
										}}
									>
										📊 Exportar
									</button>
								</div>
							</div>
							
							{/* Estatísticas */}
							<div style={{ 
								display: 'grid', 
								gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
								gap: 16, 
								marginBottom: 24 
							}}>
								<div style={{ background: '#fef3c7', padding: 16, borderRadius: 8, border: '1px solid #fbbf24' }}>
									<h4 style={{ margin: '0 0 8px 0', color: '#92400e' }}>Total de Pedidos</h4>
									<p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#92400e' }}>{pedidos.length}</p>
								</div>
								<div style={{ background: '#fef2f2', padding: 16, borderRadius: 8, border: '1px solid #fecaca' }}>
									<h4 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>Pendentes</h4>
									<p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>{pedidos.length}</p>
								</div>
								<div style={{ background: '#f0fdf4', padding: 16, borderRadius: 8, border: '1px solid #bbf7d0' }}>
									<h4 style={{ margin: '0 0 8px 0', color: '#16a34a' }}>Aprovados</h4>
									<p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>0</p>
								</div>
								<div style={{ background: '#f0f9ff', padding: 16, borderRadius: 8, border: '1px solid #bae6fd' }}>
									<h4 style={{ margin: '0 0 8px 0', color: '#0284c7' }}>Este Mês</h4>
									<p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0284c7' }}>{pedidos.filter(p => {
										const now = new Date();
										const pedidoDate = new Date(p.createdAt);
										return pedidoDate.getMonth() === now.getMonth() && pedidoDate.getFullYear() === now.getFullYear();
									}).length}</p>
								</div>
							</div>
							<h2 style={{ color: '#1e293b', marginBottom: 16 }}>📋 Pedidos Solicitados</h2>
							{loading ? (
								<div style={{ textAlign: 'center', padding: '40px' }}>
									<p>🔄 Carregando pedidos...</p>
								</div>
							) : pedidos.length === 0 ? (
								<div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
									<p style={{ color: '#64748b', margin: 0 }}>📭 Nenhum pedido solicitado ainda.</p>
								</div>
							) : (
								<div style={{ overflowX: 'auto', background: '#fff', borderRadius: 8, boxShadow: '0 1px 4px #e5e7eb' }}>
									<table style={{ width: '100%', borderCollapse: 'collapse' }}>
										<thead>
											<tr style={{ background: '#f3f4f6', color: '#374151' }}>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Data</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Usuário</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Produto</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Categoria</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Finalidade</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Anexos</th>
												<th style={{ padding: 12, borderBottom: '1px solid #e5e7eb', textAlign: 'center' }}>Ações</th>
											</tr>
										</thead>
										<tbody>
											{pedidos.map((p) => (
												<tr key={p._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
													<td style={{ padding: 10 }}>
														{p.createdAt ? new Date(p.createdAt).toLocaleDateString('pt-BR') : '-'}
													</td>
													<td style={{ padding: 10 }}>
														<div>
															<div style={{ fontWeight: '500' }}>{p.email?.split('@')[0] || '-'}</div>
															<div style={{ fontSize: '12px', color: '#6b7280' }}>{p.email || '-'}</div>
														</div>
													</td>
													<td style={{ padding: 10 }}>
														<div>
															<div style={{ fontWeight: '500' }}>{p.nome || '-'}</div>
															<div style={{ fontSize: '12px', color: '#6b7280' }}>{p.fabricante || '-'}</div>
														</div>
													</td>
													<td style={{ padding: 10 }}>
														<span style={{ 
															background: '#f0f9ff', 
															color: '#0284c7', 
															padding: '4px 8px', 
															borderRadius: '4px', 
															fontSize: '12px' 
														}}>
															{p.categoria || '-'}
														</span>
													</td>
													<td style={{ padding: 10, maxWidth: '200px' }}>
														<div style={{ 
															overflow: 'hidden', 
															textOverflow: 'ellipsis', 
															whiteSpace: 'nowrap',
															fontSize: '14px'
														}}>
															{p.finalidade || '-'}
														</div>
													</td>
													<td style={{ padding: 10, textAlign: 'center' }}>
														<div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
															{p.fichaPath && (
																<a 
																	href={`/${p.fichaPath}`} 
																	target="_blank" 
																	rel="noopener noreferrer"
																	style={{ 
																		background: '#10b981', 
																		color: 'white', 
																		padding: '4px 8px', 
																		borderRadius: '4px', 
																		textDecoration: 'none',
																		fontSize: '12px'
																	}}
																>
																	📄 Ficha
																</a>
															)}
															{p.bulaPath && (
																<a 
																	href={`/${p.bulaPath}`} 
																	target="_blank" 
																	rel="noopener noreferrer"
																	style={{ 
																		background: '#f59e0b', 
																		color: 'white', 
																		padding: '4px 8px', 
																		borderRadius: '4px', 
																		textDecoration: 'none',
																		fontSize: '12px'
																	}}
																>
																	📋 Bula
																</a>
															)}
														</div>
													</td>
													<td style={{ padding: 10, textAlign: 'center' }}>
														<div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
															<button
																style={{
																	background: '#10b981',
																	color: 'white',
																	border: 'none',
																	padding: '6px 12px',
																	borderRadius: '4px',
																	cursor: 'pointer',
																	fontSize: '12px'
																}}
																onClick={() => alert(`Aprovar pedido de ${p.nome} (em desenvolvimento)`)}
															>
																✅ Aprovar
															</button>
															<button
																style={{
																	background: '#ef4444',
																	color: 'white',
																	border: 'none',
																	padding: '6px 12px',
																	borderRadius: '4px',
																	cursor: 'pointer',
																	fontSize: '12px'
																}}
																onClick={() => alert(`Rejeitar pedido de ${p.nome} (em desenvolvimento)`)}
															>
																❌ Rejeitar
															</button>
														</div>
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
