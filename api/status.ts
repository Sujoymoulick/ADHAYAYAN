// COMPLETELY ISOLATED - NO IMPORTS
export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'online',
    message: 'Hello from the most minimal serverless function!',
    time: new Date().toISOString(),
    node: process.version,
    env_keys: Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('VITE'))
  });
}
