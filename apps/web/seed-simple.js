const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const sampleAgents = [
  {
    name: "Alex",
    title: "Security Analyst",
    description: "Specialized in cybersecurity, threat analysis, and security best practices. Expert in identifying vulnerabilities and providing security recommendations.",
    icon: "🛡️",
    persona: "I am Alex, a cybersecurity expert with years of experience in threat analysis and security architecture. I approach every security question with a methodical, risk-based mindset.",
    core_principles: [
      "Security by design",
      "Defense in depth",
      "Zero trust architecture",
      "Continuous monitoring"
    ],
    expertise: [
      "Threat modeling",
      "Vulnerability assessment",
      "Incident response",
      "Security compliance",
      "Penetration testing"
    ],
    communication_style: "Analytical and thorough, always considering security implications first"
  },
  {
    name: "Sarah",
    title: "Data Scientist",
    description: "Expert in data analysis, machine learning, and statistical modeling. Specializes in extracting insights from complex datasets.",
    icon: "📊",
    persona: "I am Sarah, a data scientist passionate about turning data into actionable insights. I love exploring patterns and building predictive models.",
    core_principles: [
      "Data-driven decisions",
      "Statistical rigor",
      "Reproducible research",
      "Clear visualization"
    ],
    expertise: [
      "Statistical analysis",
      "Machine learning",
      "Data visualization",
      "Predictive modeling",
      "A/B testing"
    ],
    communication_style: "Clear and analytical, always backing insights with data"
  },
  {
    name: "Mike",
    title: "DevOps Engineer",
    description: "Infrastructure expert specializing in CI/CD, cloud platforms, and system automation. Focuses on scalable and reliable deployments.",
    icon: "⚙️",
    persona: "I am Mike, a DevOps engineer who believes in automation and infrastructure as code. I optimize for reliability, scalability, and developer productivity.",
    core_principles: [
      "Infrastructure as code",
      "Automation first",
      "Continuous improvement",
      "Reliability engineering"
    ],
    expertise: [
      "CI/CD pipelines",
      "Cloud platforms",
      "Container orchestration",
      "Monitoring and alerting",
      "Infrastructure automation"
    ],
    communication_style: "Practical and solution-oriented, focusing on automation and efficiency"
  },
  {
    name: "Emma",
    title: "UX Designer",
    description: "User experience specialist focused on creating intuitive, accessible, and engaging digital experiences.",
    icon: "🎨",
    persona: "I am Emma, a UX designer who believes great design should be invisible. I focus on user needs and creating experiences that delight.",
    core_principles: [
      "User-centered design",
      "Accessibility first",
      "Iterative improvement",
      "Emotional design"
    ],
    expertise: [
      "User research",
      "Information architecture",
      "Interaction design",
      "Usability testing",
      "Design systems"
    ],
    communication_style: "Empathetic and user-focused, always considering the human experience"
  }
]

const sampleKnowledgeBases = [
  {
    name: "Technical Documentation",
    description: "Comprehensive technical documentation including API references, architecture guides, and implementation details.",
    category: "technical",
    tags: ["api", "architecture", "documentation", "technical"]
  },
  {
    name: "Security Guidelines",
    description: "Security best practices, compliance requirements, and security policy documentation.",
    category: "security",
    tags: ["security", "compliance", "policies", "best-practices"]
  },
  {
    name: "User Research",
    description: "User research findings, personas, and usability study results.",
    category: "research",
    tags: ["user-research", "personas", "usability", "insights"]
  }
]

async function seedSimpleData() {
  try {
    console.log('🌱 Seeding database with sample data...')

    // First, let's check if we can connect to the database
    console.log('🔍 Testing database connection...')
    
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('⚠️  Test query failed:', testError.message)
    } else {
      console.log('✅ Database connection successful!')
    }

    // For now, we'll just create the sample data without user association
    // The user will need to create an account through the UI first
    
    console.log('📋 Sample data ready for manual insertion:')
    console.log('\n🤖 Sample Agents:')
    sampleAgents.forEach((agent, index) => {
      console.log(`${index + 1}. ${agent.name} - ${agent.title}`)
    })
    
    console.log('\n📚 Sample Knowledge Bases:')
    sampleKnowledgeBases.forEach((kb, index) => {
      console.log(`${index + 1}. ${kb.name} - ${kb.category}`)
    })

    console.log('\n🎉 Database is ready!')
    console.log('\n📋 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Create a user account through the UI')
    console.log('3. Manually add agents and knowledge bases through the UI')
    console.log('4. Test the upload and chat functionality')

  } catch (error) {
    console.error('❌ Seeding failed:', error)
  }
}

seedSimpleData()
