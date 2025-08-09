import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

export default function RelatoriosAdmin() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session || session.user?.email !== 'admin@guiaorganico.com') {
			router.push('/admin');
			return;
		}

		setLoading(false);
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
							📊 Relatórios
						</h1>
						<p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
							Gere relatórios e análises do sistema
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

				{/* Cards de Relatórios */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
					gap: 20,
					marginBottom: 30
				}}>
					<div style={{
						background: '#ffffff',
						padding: 24,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>
							📈 Relatório de Pedidos
						</h3>
						<p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
							Estatísticas completas de solicitações de autorização por período
						</p>
						<button
							style={{
								background: '#10b981',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								width: '100%'
							}}
							onClick={() => alert('Relatório de pedidos (em desenvolvimento)')}
						>
							Gerar Relatório
						</button>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 24,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>
							👥 Relatório de Usuários
						</h3>
						<p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
							Análise de cadastros, atividade e engajamento dos usuários
						</p>
						<button
							style={{
								background: '#3b82f6',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								width: '100%'
							}}
							onClick={() => alert('Relatório de usuários (em desenvolvimento)')}
						>
							Gerar Relatório
						</button>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 24,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>
							🌱 Relatório de Produtos
						</h3>
						<p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
							Catálogo completo com estatísticas de uso e demanda
						</p>
						<button
							style={{
								background: '#f59e0b',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								width: '100%'
							}}
							onClick={() => alert('Relatório de produtos (em desenvolvimento)')}
						>
							Gerar Relatório
						</button>
					</div>

					<div style={{
						background: '#ffffff',
						padding: 24,
						borderRadius: 8,
						boxShadow: '0 1px 4px #e5e7eb',
						border: '1px solid #e5e7eb'
					}}>
						<h3 style={{ color: '#1e293b', margin: '0 0 12px 0', fontSize: '18px' }}>
							📋 Relatório Mensal
						</h3>
						<p style={{ color: '#64748b', margin: '0 0 16px 0', fontSize: '14px' }}>
							Consolidado mensal de todas as atividades do sistema
						</p>
						<button
							style={{
								background: '#8b5cf6',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								width: '100%'
							}}
							onClick={() => alert('Relatório mensal (em desenvolvimento)')}
						>
							Gerar Relatório
						</button>
					</div>
				</div>

				{/* Seção de Exportação */}
				<div style={{
					background: '#ffffff',
					padding: 24,
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					border: '1px solid #e5e7eb'
				}}>
					<h2 style={{ color: '#1e293b', margin: '0 0 16px 0', fontSize: '20px' }}>
						💾 Exportar Dados
					</h2>
					<p style={{ color: '#64748b', margin: '0 0 20px 0', fontSize: '14px' }}>
						Exporte dados do sistema em diferentes formatos
					</p>
					<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
						<button
							style={{
								background: '#059669',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}
							onClick={() => alert('Exportar para Excel (em desenvolvimento)')}
						>
							📊 Exportar Excel
						</button>
						<button
							style={{
								background: '#dc2626',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}
							onClick={() => alert('Exportar para PDF (em desenvolvimento)')}
						>
							📄 Exportar PDF
						</button>
						<button
							style={{
								background: '#7c3aed',
								color: 'white',
								border: 'none',
								padding: '10px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px'
							}}
							onClick={() => alert('Exportar para CSV (em desenvolvimento)')}
						>
							📝 Exportar CSV
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
