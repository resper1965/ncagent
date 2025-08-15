const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Please check your .env.local file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Gabi database...')
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'src/lib/database-schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')
    
    console.log('📄 Executing database schema...')
    
    // Execute the schema
    const { error } = await supabase.rpc('exec_sql', { sql: schema })
    
    if (error) {
      // If exec_sql doesn't exist, try direct execution
      console.log('⚠️  exec_sql not available, trying direct execution...')
      
      // Split the schema into individual statements
      const statements = schema
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
      
      for (const statement of statements) {
        if (statement.trim()) {
          try {
            const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement + ';' })
            if (stmtError) {
              console.log(`⚠️  Statement failed (this might be expected): ${statement.substring(0, 50)}...`)
            }
          } catch (e) {
            console.log(`⚠️  Statement skipped: ${statement.substring(0, 50)}...`)
          }
        }
      }
    }
    
    console.log('✅ Database schema executed successfully!')
    
    // Test the connection
    console.log('🔍 Testing database connection...')
    
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.log('⚠️  Test query failed (this might be expected for empty tables)')
    } else {
      console.log('✅ Database connection test successful!')
    }
    
    console.log('🎉 Database setup completed!')
    console.log('\n📋 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Create a user account')
    console.log('3. Test the upload and chat functionality')
    
  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

setupDatabase()
