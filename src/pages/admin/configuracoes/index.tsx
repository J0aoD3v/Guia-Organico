import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Navbar from '../../../components/Navbar';

export default function ConfiguracoesAdmin() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [limitePedidos, setLimitePedidos] = useState(5);
	const [emailNotificacoes, setEmailNotificacoes] = useState(true);
	const [manutencao, setManutencao] = useState(false);

	useEffect(() => {
		if (status === 'loading') return;
		
		if (!session || session.user?.email !== 'admin@guiaorganico.com') {
			router.push('/admin');
			return;
		}

		setLoading(false);
	}, [session, status, router]);

	const salvarConfiguracoes = () => {
		alert(`Configurações salvas com sucesso!\n- Limite de pedidos: ${limitePedidos}\n- Email notificações: ${emailNotificacoes ? 'Ativo' : 'Inativo'}\n- Modo manutenção: ${manutencao ? 'Ativo' : 'Inativo'}\n\n(Funcionalidade em desenvolvimento)`);
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
							⚙️ Configurações
						</h1>
						<p style={{ color: '#64748b', margin: '8px 0 0 0' }}>
							Configure parâmetros e comportamentos do sistema
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

				{/* Configurações Gerais */}
				<div style={{
					background: '#ffffff',
					padding: 24,
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					border: '1px solid #e5e7eb',
					marginBottom: 20
				}}>
					<h2 style={{ color: '#1e293b', margin: '0 0 20px 0', fontSize: '20px' }}>
						🏗️ Configurações Gerais
					</h2>

					<div style={{ marginBottom: 20 }}>
						<label style={{ 
							display: 'block', 
							marginBottom: 8, 
							fontWeight: '500', 
							color: '#374151' 
						}}>
							Limite de Pedidos por Mês
						</label>
						<input
							type="number"
							value={limitePedidos}
							onChange={(e) => setLimitePedidos(parseInt(e.target.value))}
							style={{
								width: '200px',
								padding: '8px 12px',
								borderRadius: '6px',
								border: '1px solid #d1d5db',
								fontSize: '14px'
							}}
							min="1"
							max="50"
						/>
						<p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 0' }}>
							Número máximo de pedidos que um usuário pode fazer por mês
						</p>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: 8, 
							fontWeight: '500', 
							color: '#374151',
							cursor: 'pointer'
						}}>
							<input
								type="checkbox"
								checked={emailNotificacoes}
								onChange={(e) => setEmailNotificacoes(e.target.checked)}
								style={{ width: '16px', height: '16px' }}
							/>
							Notificações por Email
						</label>
						<p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 24px' }}>
							Enviar emails automáticos para novos pedidos e atualizações
						</p>
					</div>

					<div style={{ marginBottom: 20 }}>
						<label style={{ 
							display: 'flex', 
							alignItems: 'center', 
							gap: 8, 
							fontWeight: '500', 
							color: '#374151',
							cursor: 'pointer'
						}}>
							<input
								type="checkbox"
								checked={manutencao}
								onChange={(e) => setManutencao(e.target.checked)}
								style={{ width: '16px', height: '16px' }}
							/>
							Modo Manutenção
						</label>
						<p style={{ color: '#6b7280', fontSize: '12px', margin: '4px 0 0 24px' }}>
							Ativar modo de manutenção (bloqueia acesso de usuários comuns)
						</p>
					</div>

					<button
						onClick={salvarConfiguracoes}
						style={{
							background: '#10b981',
							color: 'white',
							border: 'none',
							padding: '10px 20px',
							borderRadius: '6px',
							cursor: 'pointer',
							fontSize: '14px',
							fontWeight: '500'
						}}
					>
						💾 Salvar Configurações
					</button>
				</div>

				{/* Configurações de Sistema */}
				<div style={{
					background: '#ffffff',
					padding: 24,
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					border: '1px solid #e5e7eb',
					marginBottom: 20
				}}>
					<h2 style={{ color: '#1e293b', margin: '0 0 20px 0', fontSize: '20px' }}>
						🔧 Configurações de Sistema
					</h2>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
						<button
							style={{
								background: '#3b82f6',
								color: 'white',
								border: 'none',
								padding: '12px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								textAlign: 'left'
							}}
							onClick={() => alert('Cache limpo com sucesso! (em desenvolvimento)')}
						>
							🗑️ Limpar Cache do Sistema
						</button>

						<button
							style={{
								background: '#f59e0b',
								color: 'white',
								border: 'none',
								padding: '12px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								textAlign: 'left'
							}}
							onClick={() => alert('Backup criado com sucesso! (em desenvolvimento)')}
						>
							💾 Fazer Backup do Sistema
						</button>

						<button
							style={{
								background: '#8b5cf6',
								color: 'white',
								border: 'none',
								padding: '12px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								textAlign: 'left'
							}}
							onClick={() => alert('Logs visualizados (em desenvolvimento)')}
						>
							📋 Visualizar Logs do Sistema
						</button>

						<button
							style={{
								background: '#ef4444',
								color: 'white',
								border: 'none',
								padding: '12px 16px',
								borderRadius: '6px',
								cursor: 'pointer',
								fontSize: '14px',
								textAlign: 'left'
							}}
							onClick={() => {
								if (confirm('Tem certeza que deseja reiniciar o sistema? (em desenvolvimento)')) {
									alert('Sistema reiniciado!');
								}
							}}
						>
							🔄 Reiniciar Sistema
						</button>
					</div>
				</div>

				{/* Informações do Sistema */}
				<div style={{
					background: '#ffffff',
					padding: 24,
					borderRadius: 8,
					boxShadow: '0 1px 4px #e5e7eb',
					border: '1px solid #e5e7eb'
				}}>
					<h2 style={{ color: '#1e293b', margin: '0 0 20px 0', fontSize: '20px' }}>
						ℹ️ Informações do Sistema
					</h2>

					<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
						<div>
							<p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>Versão do Sistema</p>
							<p style={{ color: '#1e293b', margin: '4px 0 0 0', fontWeight: '500' }}>1.0.0</p>
						</div>
						<div>
							<p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>Última Atualização</p>
							<p style={{ color: '#1e293b', margin: '4px 0 0 0', fontWeight: '500' }}>09/08/2025</p>
						</div>
						<div>
							<p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>Ambiente</p>
							<p style={{ color: '#1e293b', margin: '4px 0 0 0', fontWeight: '500' }}>Desenvolvimento</p>
						</div>
						<div>
							<p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>Uptime</p>
							<p style={{ color: '#1e293b', margin: '4px 0 0 0', fontWeight: '500' }}>2d 14h 32m</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
