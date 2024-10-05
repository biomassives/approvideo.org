const { createClient } = require('@supabase/supabase-js');
const ethers = require('ethers');
// Other blockchain SDKs can be imported here...

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

const supportedChains = ['celo', 'sui', 'tron', 'algorand', 'cardano', 'polygon', 'rmrk', 'flow', 'near', 'solana'];

async function verifyNFTOwnership(chain, address, tokenId) {
  switch (chain) {
    case 'polygon':
      const provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/');
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const owner = await contract.ownerOf(tokenId);
      return owner.toLowerCase() === address.toLowerCase();
    case 'celo':
      // Implement Celo NFT verification
      break;
    // Add other chain-specific logic here...
    default:
      throw new Error('Unsupported chain');
  }
}

async function authenticateUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new Error('No authentication provided');

  const [authType, token] = authHeader.split(' ');

  if (authType === 'Bearer') {
    const { user, error } = await supabase.auth.api.getUser(token);
    if (error) throw error;
    if (!user) throw new Error('Invalid token');
    return user;
  } else if (authType === 'NFT') {
    const [chain, address, tokenId] = token.split(':');
    if (!supportedChains.includes(chain)) throw new Error('Unsupported chain');
    const isValid = await verifyNFTOwnership(chain, address, tokenId);
    if (!isValid) throw new Error('Invalid NFT credentials');
    return { address, chain, tokenId };
  }

  throw new Error('Invalid authentication method');
}

async function isEditor(user) {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (error) throw error;
  return data.role === 'editor';
}

module.exports = async (req, res) => {
  try {
    const user = await authenticateUser(req);
    const editor = await isEditor(user);

    switch (req.method) {
      case 'GET':
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        res.status(200).json(data);
        break;

      case 'POST':
        if (!editor) {
          res.status(403).json({ error: 'Only editors can post new videos' });
          return;
        }

        const { title, description, url } = req.body;
        if (!title || !description || !url) {
          res.status(400).json({ error: 'Missing required fields' });
          return;
        }

        const { data: newVideo, error: postError } = await supabase
          .from('videos')
          .insert([{ title, description, url, user_id: user.id }])
          .single();
        
        if (postError) throw postError;
        res.status(201).json(newVideo);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
};