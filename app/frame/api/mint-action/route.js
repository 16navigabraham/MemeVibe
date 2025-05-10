// api/frame/mint-action/route.js
import { handleMintAction } from '../../../../lib/minting-flow';

export async function POST(req) {
  return handleMintAction(req);
}