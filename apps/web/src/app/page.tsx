import { Bot, FileText, MessageSquare, Upload, Users, Zap, ArrowRight, CheckCircle, Star } from "lucide-react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Logo } from "../components/ui/logo"
import { Navbar } from "../components/ui/navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24">
        <div className="container mx-auto px-6 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8">
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Star className="mr-2 h-4 w-4" />
                AI-Powered Document Intelligence
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              n.Agent
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent block">
                Intelligent
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transforme seus documentos em conhecimento acessível. 
              Faça perguntas e obtenha respostas precisas baseadas em sua documentação corporativa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/ask">
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Começar Chat
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                <Link href="/upload">
                  <Upload className="mr-3 h-6 w-6" />
                  Enviar Documentos
                </Link>
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-gray-300">Disponibilidade</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-gray-300">Suporte</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-gray-300">Precisão</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">∞</div>
                <div className="text-sm text-gray-300">Documentos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Recursos Principais
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tudo que você precisa para transformar sua documentação em conhecimento acessível
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Chat Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Faça perguntas em linguagem natural e receba respostas baseadas em seus documentos
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/ask">
                      Experimentar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Gestão de Documentos</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Organize e versione seus documentos com controle total de acesso
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/documents">
                      Gerenciar
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Zap className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">RAG Avançado</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-base">
                  Tecnologia de Retrieval-Augmented Generation para respostas precisas
                </CardDescription>
                <div className="mt-6">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/upload">
                      Upload
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Pronto para transformar seus documentos?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              Comece agora mesmo e veja como a IA pode revolucionar sua documentação
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/ask">
                  <MessageSquare className="mr-3 h-6 w-6" />
                  Começar Chat
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-primary">
                <Link href="/upload">
                  <Upload className="mr-3 h-6 w-6" />
                  Enviar Documentos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">n.agent</h3>
                  <p className="text-gray-400">Intelligent Document Assistant</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transforme seus documentos em conhecimento acessível com IA avançada.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/ask" className="hover:text-white transition-colors">Chat</Link></li>
                <li><Link href="/documents" className="hover:text-white transition-colors">Documentos</Link></li>
                <li><Link href="/upload" className="hover:text-white transition-colors">Upload</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Sobre</li>
                <li>Contato</li>
                <li>Suporte</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 n.agent. Desenvolvido com ❤️ para transformar conhecimento.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
