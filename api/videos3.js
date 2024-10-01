const { createClient } = require('@supabase/supabase-js');
const ethers = require('ethers');
// You'll need to install and import libraries for other chains as needed
// const algosdk = require('algosdk');
// const solanaWeb3 = require('@solana/web3.js');
// ... other chain-specific libraries

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const supportedChains = ['celo', 'sui', 'tron', 'algorand', 'cardano', 'polygon', 'rmrk', 'flow', 'near', 'solana'];

async function verifyNFTOwnership(chain, address, tokenId) {
  // Implement chain-specific NFT ownership verification
  switch (chain) {
    case 'celo':
      // Implement Celo NFT verification
      break;
    case 'sui':
      // Implement Sui NFT verification
      break;
    // ... implement for other chains
    default:
      throw new Error('Unsupported chain');
  }
}

async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('No authentication provided');

  const [authType, token] = authHeader.split(' ');

  if (authType === 'Bearer') {
    // Supabase token authentication
    const { user, error } = await supabase.auth.api.getUser(token);
    if (error) throw error;
    return user;
  } else if (authType === 'NFT') {
    // NFT-based authentication
    const [chain, address, tokenId] = token.split(':');
    if (!supportedChains.includes(chain)) throw new Error('Unsupported chain');
    const isValid = await verifyNFTOwnership(chain, address, tokenId);
    if (!isValid) throw new Error('Invalid NFT credentials');
    return { address, chain, tokenId };
  }

  throw new Error('Invalid authentication method');
}

async function isEditor(user) {
  // Implement editor check logic here
  // This could involve checking a role in Supabase or verifying specific NFT ownership
  return false; // Placeholder
}

module.exports = async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const editor = await isEditor(user);

    switch (req.method) {
      case 'GET':
        // Fetch videos, potentially with different logic for editors
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.status(200).json(data);
        break;

      case 'POST':
        // Only allow editors to post new videos
        if (!editor) {
          res.status(403).json({ error: 'Only editors can post new videos' });
          return;
        }
        
        const { title, description, url } = req.body;
        const { data: newVideo, error: postError } = await supabase
          .from('videos')
          .insert([{ title, description, url, user_id: user.id }])
          .single();
        
        if (postError) throw postError;
        res.status(201).json(newVideo);
        break;

      case 'PUT':
        // Update video logic (editor only)
        break;

      case 'DELETE':
        // Delete video logic (editor only)
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};
