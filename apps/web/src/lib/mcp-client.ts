import { useState, useEffect } from 'react';

class MCPClient {
  private baseUrl: string;
  private eventSource: EventSource | null = null;

  constructor(baseUrl: string = 'http://localhost:3001') {
    this.baseUrl = baseUrl;
  }

  // Conectar ao servidor SSE
  connect(onMessage: (data: any) => void) {
    this.eventSource = new EventSource(`${this.baseUrl}/sse`);
    
    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Erro ao processar mensagem SSE:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('Erro na conexão SSE:', error);
    };
  }

  // Desconectar
  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Obter lista de componentes
  async getComponents(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/components`);
      const data = await response.json();
      return data.success ? Object.keys(data.components) : [];
    } catch (error) {
      console.error('Erro ao obter componentes:', error);
      return [];
    }
  }

  // Obter componente específico
  async getComponent(name: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/component/${name}`);
      const data = await response.json();
      return data.success ? data.component : null;
    } catch (error) {
      console.error(`Erro ao obter componente ${name}:`, error);
      return null;
    }
  }

  // Gerar código de componente
  async generateComponent(component: string, props: any = {}, variant: string = 'default'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ component, props, variant }),
      });
      const data = await response.json();
      return data.success ? data.code : '';
    } catch (error) {
      console.error('Erro ao gerar componente:', error);
      return '';
    }
  }

  // Verificar se o servidor está online
  async isOnline(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/components`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Instância singleton
export const mcpClient = new MCPClient();

// Hook React para usar componentes MCP
export function useMCPComponents() {
  const [components, setComponents] = useState<string[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const checkServer = async () => {
      const online = await mcpClient.isOnline();
      setIsOnline(online);
      
      if (online) {
        const comps = await mcpClient.getComponents();
        setComponents(comps);
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 5000);

    return () => clearInterval(interval);
  }, []);

  return { components, isOnline };
}

// Função para renderizar componente dinamicamente
export async function renderMCPComponent(name: string, props: any = {}) {
  const component = await mcpClient.getComponent(name);
  if (!component) {
    console.error(`Componente ${name} não encontrado`);
    return null;
  }

  // Aqui você pode implementar a renderização dinâmica
  // Por enquanto, retornamos o template
  return component.template;
}
