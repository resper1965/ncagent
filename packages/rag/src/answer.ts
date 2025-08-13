import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import type { ChunkResult, AnswerResult } from './types';

export class AnswerService {
  private llm: ChatOpenAI;
  private promptTemplate: PromptTemplate;

  constructor() {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }

    this.llm = new ChatOpenAI({
      openAIApiKey: openaiApiKey,
      modelName: process.env.RAG_LLM_MODEL || 'gpt-3.5-turbo',
      temperature: 0.1,
      maxTokens: 1000
    });

    this.promptTemplate = PromptTemplate.fromTemplate(`
Você é um assistente especializado em documentação técnica do nCommand Lite.
Use apenas as informações fornecidas nos documentos para responder à pergunta.

Contexto dos documentos:
{context}

Pergunta: {question}

Instruções:
1. Responda baseado APENAS nas informações fornecidas
2. Se não encontrar informações suficientes, diga "Não encontrei informações suficientes sobre isso"
3. Seja conciso e direto
4. Use linguagem técnica apropriada
5. Cite as fontes quando relevante

Resposta:`);
  }

  /**
   * Gera resposta baseada nos chunks recuperados
   */
  async makeAnswer(
    question: string,
    chunks: ChunkResult[],
    options: {
      role?: string;
      maxLength?: number;
    } = {}
  ): Promise<AnswerResult> {
    try {
      if (chunks.length === 0) {
        return {
          answer: "Não encontrei informações suficientes para responder sua pergunta. Tente reformular ou verificar se há documentação disponível sobre o tema.",
          citations: [],
          sources: []
        };
      }

      // Preparar contexto dos chunks
      const context = chunks
        .map((chunk, index) => `[${index + 1}] ${chunk.content}`)
        .join('\n\n');

      // Preparar fontes
      const sources = [...new Set(chunks.map(chunk => chunk.title))];

      // Gerar resposta
      const response = await this.llm.invoke(
        await this.promptTemplate.format({
          context,
          question
        })
      );

      let answer = response.content as string;

      // Aplicar limite de tamanho se especificado
      if (options.maxLength && answer.length > options.maxLength) {
        answer = answer.substring(0, options.maxLength) + '...';
      }

      // Preparar citações
      const citations = chunks.map(chunk => ({
        ...chunk,
        relevance: chunk.similarity
      }));

      return {
        answer,
        citations,
        sources
      };

    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      
      return {
        answer: "Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente em alguns instantes.",
        citations: [],
        sources: []
      };
    }
  }

  /**
   * Gera resumo de um texto
   */
  async generateSummary(text: string, maxLength: number = 200): Promise<string> {
    try {
      const summaryPrompt = PromptTemplate.fromTemplate(`
Resuma o seguinte texto em no máximo ${maxLength} caracteres:

{text}

Resumo:`);

      const response = await this.llm.invoke(
        await summaryPrompt.format({ text })
      );

      return (response.content as string).substring(0, maxLength);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
      return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
    }
  }

  /**
   * Classifica a intenção da pergunta
   */
  async classifyIntent(question: string): Promise<{
    intent: 'technical' | 'general' | 'error' | 'feature';
    confidence: number;
  }> {
    try {
      const intentPrompt = PromptTemplate.fromTemplate(`
Classifique a intenção da seguinte pergunta sobre nCommand Lite:

Pergunta: {question}

Opções:
- technical: Pergunta técnica sobre implementação, configuração, API
- general: Pergunta geral sobre funcionalidades, uso básico
- error: Pergunta sobre erros, troubleshooting, problemas
- feature: Pergunta sobre recursos, funcionalidades específicas

Responda apenas com o tipo de intenção:`);

      const response = await this.llm.invoke(
        await intentPrompt.format({ question })
      );

      const intent = (response.content as string).toLowerCase().trim();
      
      // Mapear para tipos válidos
      const validIntents = ['technical', 'general', 'error', 'feature'];
      const finalIntent = validIntents.includes(intent) ? intent : 'general';

      return {
        intent: finalIntent as any,
        confidence: 0.8 // Valor padrão
      };
    } catch (error) {
      console.error('Erro ao classificar intenção:', error);
      return {
        intent: 'general',
        confidence: 0.5
      };
    }
  }

  /**
   * Verifica se o serviço está funcionando
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeAnswer('test', []);
      return true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}
