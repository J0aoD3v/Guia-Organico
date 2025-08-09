import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

export default function PedidosAdmin() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [pedidos, setPedidos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session || session.user?.email !== 'admin@guiaorganico.com') {
			router.push('/admin');
			return;
		}

		fetchPedidos();
	}, [session, status, router]);

	const fetchPedidos = async () => {
		try {
			const res = await fetch('/api/pedidos');
			const data = await res.json();
			setPedidos(data);
		} catch (error) {
			console.error('Erro ao carregar pedidos:', error);
		} finally {
			setLoading(false);
		}
	};

	const aprovarPedido = (pedidoId: string, nomeProduto: string) => {
		alert(`Pedido de "${nomeProduto}" aprovado com sucesso!\n(Funcionalidade em desenvolvimento)`);
	};

	const rejeitarPedido = (pedidoId: string, nomeProduto: string) => {
		const motivo = prompt(`Por que rejeitar o pedido de "${nomeProduto}"?`);
		if (motivo) {
			alert(`Pedido rejeitado. Motivo: ${motivo}\n(Funcionalidade em desenvolvimento)`);
		}
	};

	if (status === 'loading' || loading) {
		return (
			<div>
				<Navbar />
				<div style={{ padding: 20, textAlign: 'center' }}>
					<p>🔄 Carregando...</p>
				</div>
			</div>
		);
	}

	return (
		<div>
			<Navbar />
			<div style={{ 
				maxWidth: 1200, 
				margin: '0 auto', 
				padding: 20,
				backgroundColor: '#f8fafc',
				minHeight: '100vh'
			}}>
				{/* Header */}
				<div style={{ 
					display: 'flex', 
					justifyContent: 'space-between', 
					alignItems: 'center', 
					marginBottom: 30 
				}}>
					<div>
						<h1 style={{ color: '#1e293b', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
							✅ Autorização de Pedidos
						</h1>
						<p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
							Revisar e aprovar solicitações de autorização de produtos
						</p>
					</div>
					<button
						onClick={() => router.push('/admin')}
						style={{
							background: '#6b7280',
							color: 'white',
							border: 'none',
							padding: '8px 16px',
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '14px'
						}}
					>
						← Voltar ao Painel
					</button>
				</div>

				{/* Estatísticas */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: 20,
					marginBottom: 30
				}}>
					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>
							{pedidos.length}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Total de Pedidos
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#f59e0b', margin: 0, fontSize: '24px' }}>
							{pedidos.length}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Pendentes
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#10b981', margin: 0, fontSize: '24px' }}>
							0
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Aprovados
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#ef4444', margin: 0, fontSize: '24px' }}>
							0
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Rejeitados
						</p>
					</div>
				</div>

				{/* Filtros */}
				<div style={{
					background: '#ffffff',
					padding: 20,
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					marginBottom: 20,
					display: 'flex',
					gap: 16,
					alignItems: 'center'
				}}>
					<label style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
						Filtrar por:
					</label>
					<select style={{
						padding: '8px 12px',
						borderRadius: '6px',
						border: '1px solid #d1d5db',
						fontSize: '14px'
					}}>
						<option value="">Todos os status</option>
						<option value="pendente">Pendentes</option>
						<option value="aprovado">Aprovados</option>
						<option value="rejeitado">Rejeitados</option>
					</select>
					<select style={{
						padding: '8px 12px',
						borderRadius: '6px',
						border: '1px solid #d1d5db',
						fontSize: '14px'
					}}>
						<option value="">Todas as categorias</option>
						<option value="fertilizante">Fertilizantes</option>
						<option value="defensivo">Defensivos</option>
						<option value="condicionador">Condicionadores</option>
					</select>
					<button
						onClick={fetchPedidos}
						style={{
							background: '#3b82f6',
							color: 'white',
							border: 'none',
							padding: '8px 16px',
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '14px'
						}}
					>
						🔄 Atualizar
					</button>
				</div>

				{/* Tabela de Pedidos */}
				<div style={{
					background: '#ffffff',
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					overflow: 'hidden'
				}}>
					<div style={{ 
						padding: 20, 
						borderBottom: '1px solid #e5e7eb'
					}}>
						<h2 style={{ color: '#1e293b', margin: 0, fontSize: '18px' }}>
							Solicitações de Autorização ({pedidos.length})
						</h2>
					</div>

					{loading ? (
						<div style={{ textAlign: 'center', padding: '40px' }}>
							<p>🔄 Carregando pedidos...</p>
						</div>
					) : pedidos.length === 0 ? (
						<div style={{ textAlign: 'center', padding: '40px', background: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb' }}>
							<p style={{ color: '#64748b', margin: 0 }}>📭 Nenhum pedido solicitado ainda.</p>
						</div>
					) : (
						<div style={{ overflowX: 'auto' }}>
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
													<div style={{ fontWeight: '500' }}>
														{(typeof p.email === 'string' && p.email.includes('@')) 
															? p.email.split('@')[0] 
															: p.email || '-'
														}
													</div>
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
														onClick={() => aprovarPedido(p._id, p.nome)}
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
														onClick={() => rejeitarPedido(p._id, p.nome)}
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
			</div>
		</div>
	);
}
