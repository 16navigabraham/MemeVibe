// api/frame/minting-completed/route.js
import { handleMintingCompleted } from '../../../lib/minting-flow';

export async function GET(req) {
  return handleMintingCompleted(req);
}

export async function POST(req) {
  return handleMintingCompleted(req);
}