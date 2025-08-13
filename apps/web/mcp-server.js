const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Componentes shadcn/ui como dados
const components = {
  button: {
    name: 'Button',
    variants: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    props: {
      variant: { type: 'string', default: 'default' },
      size: { type: 'string', default: 'default' },
      disabled: { type: 'boolean', default: false }
    },
    template: `
import { Button } from "@/components/ui/button"

export function Button({ variant = "default", size = "default", disabled = false, children, ...props }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
          "bg-destructive text-destructive-foreground hover:bg-destructive/90": variant === "destructive",
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
          "text-primary underline-offset-4 hover:underline": variant === "link",
        },
        {
          "h-10 px-4 py-2": size === "default",
          "h-9 rounded-md px-3": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-9 w-9": size === "icon",
        }
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}`
  },
  card: {
    name: 'Card',
    variants: ['default'],
    props: {},
    template: `
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function Card({ children, ...props }) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm" {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ children, ...props }) {
  return (
    <div className="flex flex-col space-y-1.5 p-6" {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ children, ...props }) {
  return (
    <h3 className="text-2xl font-semibold leading-none tracking-tight" {...props}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, ...props }) {
  return (
    <p className="text-sm text-muted-foreground" {...props}>
      {children}
    </p>
  )
}

export function CardContent({ children, ...props }) {
  return (
    <div className="p-6 pt-0" {...props}>
      {children}
    </div>
  )
}`
  },
  badge: {
    name: 'Badge',
    variants: ['default', 'secondary', 'destructive', 'outline'],
    props: {
      variant: { type: 'string', default: 'default' }
    },
    template: `
import { Badge } from "@/components/ui/badge"

export function Badge({ variant = "default", children, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80": variant === "default",
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80": variant === "destructive",
          "text-foreground": variant === "outline",
        }
      )}
      {...props}
    >
      {children}
    </div>
  )
}`
  }
};

// Endpoint SSE para streaming de componentes
app.get('/sse', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  // Enviar componentes disponíveis
  res.write(`data: ${JSON.stringify({ type: 'components', data: Object.keys(components) })}\n\n`);

  // Manter conexão aberta
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: Date.now() })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// Endpoint para obter componente específico
app.get('/component/:name', (req, res) => {
  const { name } = req.params;
  const component = components[name];
  
  if (component) {
    res.json({ success: true, component });
  } else {
    res.status(404).json({ success: false, error: 'Component not found' });
  }
});

// Endpoint para listar todos os componentes
app.get('/components', (req, res) => {
  res.json({ success: true, components });
});

// Endpoint para gerar código de componente
app.post('/generate', (req, res) => {
  const { component, props, variant } = req.body;
  const comp = components[component];
  
  if (!comp) {
    return res.status(404).json({ success: false, error: 'Component not found' });
  }

  // Gerar código do componente
  const code = comp.template;
  res.json({ success: true, code });
});

app.listen(port, () => {
  console.log(`🚀 MCP Server for shadcn/ui running on http://localhost:${port}`);
  console.log(`📡 SSE endpoint: http://localhost:${port}/sse`);
  console.log(`🔧 Components available: ${Object.keys(components).join(', ')}`);
});
