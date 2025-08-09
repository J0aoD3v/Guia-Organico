import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

export default function ProdutosAdmin() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [produtos, setProdutos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [formData, setFormData] = useState({
		nome: '',
		fabricante: '',
		categoria: '',
		finalidade: '',
		composicao: '',
		modoUso: '',
		precaucoes: ''
	});

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session || session.user?.email !== 'admin@guia-organico.com') {
			router.push('/admin');
			return;
		}

		fetchProdutos();
	}, [session, status, router]);

	const fetchProdutos = async () => {
		try {
			setLoading(true);
			const response = await fetch('/api/produtos-admin');
			const data = await response.json();
			setProdutos(data);
		} catch (error) {
			console.error('Erro ao buscar produtos:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleAddProduto = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.nome || !formData.fabricante || !formData.categoria) {
			alert('Nome, fabricante e categoria são obrigatórios!');
			return;
		}

		try {
			const response = await fetch('/api/produtos-admin', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				alert('✅ Produto adicionado com sucesso!');
				setShowAddForm(false);
				setFormData({
					nome: '',
					fabricante: '',
					categoria: '',
					finalidade: '',
					composicao: '',
					modoUso: '',
					precaucoes: ''
				});
				fetchProdutos();
			} else {
				throw new Error('Erro ao adicionar produto');
			}
		} catch (error) {
			console.error('Erro ao adicionar produto:', error);
			alert('❌ Erro ao adicionar produto. Tente novamente.');
		}
	};

	const toggleStatus = async (produtoId: string, novoStatus: string) => {
		try {
			const response = await fetch('/api/produtos-admin', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					id: produtoId,
					status: novoStatus
				})
			});

			if (response.ok) {
				alert(`✅ Status do produto atualizado para ${novoStatus}!`);
				fetchProdutos();
			} else {
				throw new Error('Erro ao atualizar status');
			}
		} catch (error) {
			console.error('Erro ao atualizar status:', error);
			alert('❌ Erro ao atualizar status. Tente novamente.');
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
							{produtos.filter(p => p.status === 'ativo').length}
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

				{/* Formulário de Adicionar Produto */}
				{showAddForm && (
					<div style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0,0,0,0.5)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000
					}}>
						<div style={{
							backgroundColor: 'white',
							padding: '24px',
							borderRadius: '8px',
							maxWidth: '500px',
							width: '90%',
							maxHeight: '80vh',
							overflowY: 'auto'
						}}>
							<h3 style={{ marginTop: 0, color: '#1e293b' }}>Adicionar Novo Produto</h3>
							<form onSubmit={handleAddProduto}>
								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Nome do Produto *
									</label>
									<input
										type="text"
										value={formData.nome}
										onChange={(e) => setFormData({...formData, nome: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										required
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Fabricante *
									</label>
									<input
										type="text"
										value={formData.fabricante}
										onChange={(e) => setFormData({...formData, fabricante: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										required
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Categoria *
									</label>
									<select
										value={formData.categoria}
										onChange={(e) => setFormData({...formData, categoria: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										required
									>
										<option value="">Selecione uma categoria</option>
										<option value="Fertilizante">Fertilizante</option>
										<option value="Defensivo">Defensivo</option>
										<option value="Condicionador">Condicionador</option>
										<option value="Biofertilizante">Biofertilizante</option>
										<option value="Corretor">Corretor</option>
									</select>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Finalidade
									</label>
									<textarea
										value={formData.finalidade}
										onChange={(e) => setFormData({...formData, finalidade: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Para que serve este produto..."
									/>
								</div>

								<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
									<button
										type="button"
										onClick={() => setShowAddForm(false)}
										style={{
											background: '#6b7280',
											color: 'white',
											border: 'none',
											padding: '8px 16px',
											borderRadius: '4px',
											cursor: 'pointer'
										}}
									>
										Cancelar
									</button>
									<button
										type="submit"
										style={{
											background: '#10b981',
											color: 'white',
											border: 'none',
											padding: '8px 16px',
											borderRadius: '4px',
											cursor: 'pointer'
										}}
									>
										Adicionar
									</button>
								</div>
							</form>
						</div>
					</div>
				)}

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
								onClick={() => setShowAddForm(true)}
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
									<tr key={produto._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
										<td style={{ padding: 12 }}>
											<div style={{ fontWeight: '500', color: '#1e293b' }}>
												{produto.nome}
											</div>
											{produto.finalidade && (
												<div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
													{produto.finalidade}
												</div>
											)}
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
												background: produto.status === 'ativo' ? '#dcfce7' : '#fef2f2',
												color: produto.status === 'ativo' ? '#166534' : '#dc2626',
												padding: '4px 8px',
												borderRadius: '4px',
												fontSize: '12px',
												fontWeight: '500'
											}}>
												{produto.status === 'ativo' ? 'Ativo' : 'Inativo'}
											</span>
										</td>
										<td style={{ padding: 12, color: '#64748b', fontSize: '14px' }}>
											{produto.criadoEm ? new Date(produto.criadoEm).toLocaleDateString('pt-BR') : '-'}
											<div style={{ fontSize: '11px', color: '#9ca3af' }}>
												{produto.origem === 'pedido_aprovado' ? 'Via pedido' : 'Manual'}
											</div>
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
												{produto.status === 'ativo' ? (
													<button
														style={{
															background: '#f59e0b',
															color: 'white',
															border: 'none',
															padding: '4px 8px',
															borderRadius: '4px',
															cursor: 'pointer',
															fontSize: '12px'
														}}
														onClick={() => toggleStatus(produto._id, 'inativo')}
													>
														⏸️ Desativar
													</button>
												) : (
													<button
														style={{
															background: '#10b981',
															color: 'white',
															border: 'none',
															padding: '4px 8px',
															borderRadius: '4px',
															cursor: 'pointer',
															fontSize: '12px'
														}}
														onClick={() => toggleStatus(produto._id, 'ativo')}
													>
														▶️ Ativar
													</button>
												)}
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
