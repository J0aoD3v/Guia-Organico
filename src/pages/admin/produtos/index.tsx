import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

export default function ProdutosAdmin() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [produtos, setProdutos] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session || session.user?.email !== 'admin@guiaorganico.com') {
			router.push('/admin');
			return;
		}

		// Simular carregamento de produtos
		setTimeout(() => {
			setProdutos([
				{
					id: 1,
					nome: 'Fertilizante Orgânico NPK',
					fabricante: 'AgroVerde',
					categoria: 'Fertilizante',
					status: 'Ativo',
					createdAt: new Date('2024-01-15')
				},
				{
					id: 2,
					nome: 'Biofungicida Natural',
					fabricante: 'EcoBio',
					categoria: 'Defensivo',
					status: 'Ativo',
					createdAt: new Date('2024-02-20')
				},
				{
					id: 3,
					nome: 'Condicionador de Solo',
					fabricante: 'TerraViva',
					categoria: 'Condicionador',
					status: 'Inativo',
					createdAt: new Date('2024-03-10')
				}
			]);
			setLoading(false);
		}, 1000);
	}, [session, status, router]);

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
							🌱 Gestão de Produtos
						</h1>
						<p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
							Gerencie o catálogo de produtos orgânicos
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
							{produtos.length}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Total de Produtos
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>
							{produtos.filter(p => p.status === 'Ativo').length}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Produtos Ativos
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>
							{new Set(produtos.map(p => p.categoria)).size}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Categorias
						</p>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 20,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: 0, fontSize: '24px' }}>
							{new Set(produtos.map(p => p.fabricante)).size}
						</h3>
						<p style={{ color: '#64748b', margin: '4px 0 0 0', fontSize: '14px' }}>
							Fabricantes
						</p>
					</div>
				</div>

				{/* Tabela de Produtos */}
				<div style={{
					background: '#ffffff',
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					overflow: 'hidden'
				}}>
					<div style={{ 
						padding: 20, 
						borderBottom: '1px solid #e5e7eb',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center'
					}}>
						<h2 style={{ color: '#1e293b', margin: 0, fontSize: '18px' }}>
							Catálogo de Produtos
						</h2>
						<div style={{ display: 'flex', gap: '8px' }}>
							<button
								style={{
									background: '#f59e0b',
									color: 'white',
									border: 'none',
									padding: '8px 16px',
									borderRadius: '6px',
									cursor: 'pointer',
									fontSize: '14px'
								}}
								onClick={() => alert('Importar produtos (em desenvolvimento)')}
							>
								📥 Importar
							</button>
							<button
								style={{
									background: '#10b981',
									color: 'white',
									border: 'none',
									padding: '8px 16px',
									borderRadius: '6px',
									cursor: 'pointer',
									fontSize: '14px'
								}}
								onClick={() => alert('Adicionar produto (em desenvolvimento)')}
							>
								+ Adicionar Produto
							</button>
						</div>
					</div>

					<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', borderCollapse: 'collapse' }}>
							<thead>
								<tr style={{ background: '#f8fafc' }}>
									<th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Produto</th>
									<th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Fabricante</th>
									<th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Categoria</th>
									<th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Status</th>
									<th style={{ padding: 12, textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>Cadastro</th>
									<th style={{ padding: 12, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>Ações</th>
								</tr>
							</thead>
							<tbody>
								{produtos.map((produto) => (
									<tr key={produto.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
										<td style={{ padding: 12 }}>
											<div style={{ fontWeight: '500', color: '#1e293b' }}>
												{produto.nome}
											</div>
										</td>
										<td style={{ padding: 12 }}>
											<div style={{ color: '#64748b' }}>
												{produto.fabricante}
											</div>
										</td>
										<td style={{ padding: 12 }}>
											<span style={{
												background: '#f0f9ff',
												color: '#0284c7',
												padding: '4px 8px',
												borderRadius: '4px',
												fontSize: '12px',
												fontWeight: '500'
											}}>
												{produto.categoria}
											</span>
										</td>
										<td style={{ padding: 12 }}>
											<span style={{
												background: produto.status === 'Ativo' ? '#f0fdf4' : '#fef2f2',
												color: produto.status === 'Ativo' ? '#059669' : '#dc2626',
												padding: '4px 8px',
												borderRadius: '4px',
												fontSize: '12px',
												fontWeight: '500'
											}}>
												{produto.status}
											</span>
										</td>
										<td style={{ padding: 12, color: '#64748b', fontSize: '14px' }}>
											{produto.createdAt.toLocaleDateString('pt-BR')}
										</td>
										<td style={{ padding: 12, textAlign: 'center' }}>
											<div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
												<button
													style={{
														background: '#3b82f6',
														color: 'white',
														border: 'none',
														padding: '4px 8px',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px'
													}}
													onClick={() => alert(`Editar ${produto.nome} (em desenvolvimento)`)}
												>
													✏️ Editar
												</button>
												<button
													style={{
														background: produto.status === 'Ativo' ? '#f59e0b' : '#10b981',
														color: 'white',
														border: 'none',
														padding: '4px 8px',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px'
													}}
													onClick={() => alert(`${produto.status === 'Ativo' ? 'Desativar' : 'Ativar'} ${produto.nome} (em desenvolvimento)`)}
												>
													{produto.status === 'Ativo' ? '⏸️ Desativar' : '▶️ Ativar'}
												</button>
												<button
													style={{
														background: '#ef4444',
														color: 'white',
														border: 'none',
														padding: '4px 8px',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px'
													}}
													onClick={() => alert(`Remover ${produto.nome} (em desenvolvimento)`)}
												>
													🗑️ Remover
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}
