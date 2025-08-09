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
	const [showEditForm, setShowEditForm] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [formData, setFormData] = useState({
		nome: '',
		fabricante: '',
		categoria: '',
		finalidade: '',
		composicao: '',
		modoUso: '',
		precaucoes: '',
		certificacao: '',
		classeAgronomica: ''
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
			const response = await fetch('/api/produtos');
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
			const response = await fetch('/api/produtos', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				alert('✅ Produto adicionado com sucesso!');
				setShowAddForm(false);
				resetForm();
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
			const response = await fetch(`/api/produtos?id=${produtoId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
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

	const handleEditProduct = (produto: any) => {
		setEditingProduct(produto);
		setFormData({
			nome: produto.nome || '',
			fabricante: produto.fabricante || '',
			categoria: produto.categoria || '',
			finalidade: produto.finalidade || '',
			composicao: produto.composicao || '',
			modoUso: produto.modoUso || '',
			precaucoes: produto.precaucoes || '',
			certificacao: produto.certificacao || '',
			classeAgronomica: produto.classeAgronomica || ''
		});
		setShowEditForm(true);
	};

	const handleUpdateProduct = async (e: React.FormEvent) => {
		e.preventDefault();
		
		if (!formData.nome || !formData.fabricante || !formData.categoria) {
			alert('Nome, fabricante e categoria são obrigatórios!');
			return;
		}

		try {
			const response = await fetch(`/api/produtos?id=${editingProduct._id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				alert('✅ Produto atualizado com sucesso!');
				setShowEditForm(false);
				setEditingProduct(null);
				resetForm();
				fetchProdutos();
			} else {
				throw new Error('Erro ao atualizar produto');
			}
		} catch (error) {
			console.error('Erro ao atualizar produto:', error);
			alert('❌ Erro ao atualizar produto. Tente novamente.');
		}
	};

	const handleDeleteProduct = async (produtoId: string, nomeProduto: string) => {
		if (!confirm(`Tem certeza que deseja deletar o produto "${nomeProduto}"?\n\nEsta ação não pode ser desfeita.`)) {
			return;
		}

		try {
			const response = await fetch(`/api/produtos?id=${produtoId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				alert('✅ Produto deletado com sucesso!');
				fetchProdutos();
			} else {
				throw new Error('Erro ao deletar produto');
			}
		} catch (error) {
			console.error('Erro ao deletar produto:', error);
			alert('❌ Erro ao deletar produto. Tente novamente.');
		}
	};

	const resetForm = () => {
		setFormData({
			nome: '',
			fabricante: '',
			categoria: '',
			finalidade: '',
			composicao: '',
			modoUso: '',
			precaucoes: '',
			certificacao: '',
			classeAgronomica: ''
		});
	};

	const closeEditForm = () => {
		setShowEditForm(false);
		setEditingProduct(null);
		resetForm();
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
										<option value="Fertilizantes">Fertilizantes</option>
										<option value="Defensivos">Defensivos</option>
										<option value="Sementes">Sementes</option>
										<option value="Inoculantes">Inoculantes</option>
										<option value="Corretivos">Corretivos</option>
										<option value="Condicionadores">Condicionadores</option>
										<option value="Bioestimulantes">Bioestimulantes</option>
									</select>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Certificação
									</label>
									<input
										type="text"
										value={formData.certificacao}
										onChange={(e) => setFormData({...formData, certificacao: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										placeholder="Ex: IBD, Ecocert, etc."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Classe Agronômica
									</label>
									<input
										type="text"
										value={formData.classeAgronomica}
										onChange={(e) => setFormData({...formData, classeAgronomica: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										placeholder="Ex: Fertilizante orgânico simples"
									/>
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
										placeholder="Descreva a finalidade do produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Composição
									</label>
									<textarea
										value={formData.composicao}
										onChange={(e) => setFormData({...formData, composicao: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Descreva a composição do produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Modo de Uso
									</label>
									<textarea
										value={formData.modoUso}
										onChange={(e) => setFormData({...formData, modoUso: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Descreva como usar o produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Precauções
									</label>
									<textarea
										value={formData.precaucoes}
										onChange={(e) => setFormData({...formData, precaucoes: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Precauções de uso..."
									/>
								</div>

								<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
									<button
										type="button"
										onClick={() => {
											setShowAddForm(false);
											resetForm();
										}}
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

				{/* Formulário de Editar Produto */}
				{showEditForm && (
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
							<h3 style={{ marginTop: 0, color: '#1e293b' }}>Editar Produto</h3>
							<form onSubmit={handleUpdateProduct}>
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
										<option value="Fertilizantes">Fertilizantes</option>
										<option value="Defensivos">Defensivos</option>
										<option value="Sementes">Sementes</option>
										<option value="Inoculantes">Inoculantes</option>
										<option value="Corretivos">Corretivos</option>
										<option value="Condicionadores">Condicionadores</option>
										<option value="Bioestimulantes">Bioestimulantes</option>
									</select>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Certificação
									</label>
									<input
										type="text"
										value={formData.certificacao}
										onChange={(e) => setFormData({...formData, certificacao: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										placeholder="Ex: IBD, Ecocert, etc."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Classe Agronômica
									</label>
									<input
										type="text"
										value={formData.classeAgronomica}
										onChange={(e) => setFormData({...formData, classeAgronomica: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px'
										}}
										placeholder="Ex: Fertilizante orgânico simples"
									/>
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
										placeholder="Descreva a finalidade do produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Composição
									</label>
									<textarea
										value={formData.composicao}
										onChange={(e) => setFormData({...formData, composicao: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Descreva a composição do produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Modo de Uso
									</label>
									<textarea
										value={formData.modoUso}
										onChange={(e) => setFormData({...formData, modoUso: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Descreva como usar o produto..."
									/>
								</div>

								<div style={{ marginBottom: '16px' }}>
									<label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
										Precauções
									</label>
									<textarea
										value={formData.precaucoes}
										onChange={(e) => setFormData({...formData, precaucoes: e.target.value})}
										style={{
											width: '100%',
											padding: '8px',
											border: '1px solid #d1d5db',
											borderRadius: '4px',
											minHeight: '60px'
										}}
										placeholder="Precauções de uso..."
									/>
								</div>

								<div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
									<button
										type="button"
										onClick={closeEditForm}
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
											background: '#3b82f6',
											color: 'white',
											border: 'none',
											padding: '8px 16px',
											borderRadius: '4px',
											cursor: 'pointer'
										}}
									>
										Salvar Alterações
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
											<div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
													onClick={() => handleEditProduct(produto)}
													title="Editar produto"
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
														title="Desativar produto"
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
														title="Ativar produto"
													>
														▶️ Ativar
													</button>
												)}
												<button
													style={{
														background: '#dc2626',
														color: 'white',
														border: 'none',
														padding: '4px 8px',
														borderRadius: '4px',
														cursor: 'pointer',
														fontSize: '12px'
													}}
													onClick={() => handleDeleteProduct(produto._id, produto.nome)}
													title="Deletar produto permanentemente"
												>
													🗑️ Deletar
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
