import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Handle magic link request
    const { email } = req.body
    const { error } = await supabase.auth.signIn({ email })
    
    if (error) {
      return res.status(400).json({ error: error.message })
    }
    
    return res.status(200).json({ message: 'Magic link sent successfully' })
  } else if (req.method === 'GET') {
    // Handle session check
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const { user, error } = await supabase.auth.api.getUser(token)
    
    if (error) {
      return res.status(401).json({ error: error.message })
    }
    
    return res.status(200).json({ user })
  }

  res.setHeader('Allow', ['POST', 'GET'])
  res.status(405).end(`Method ${req.method} Not Allowed`)
}
