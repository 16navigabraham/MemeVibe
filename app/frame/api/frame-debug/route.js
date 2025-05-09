// // app/api/frame-debug/route.js
// export async function GET() {
//   // Create an HTML response with frame metadata
//   const html = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <title>Meme Vibe Frame Debug</title>
//         <meta property="fc:frame" content="vNext" />
//         <meta property="fc:frame:image" content="https://meme-vibe.vercel.app/api/og" />
//         <meta property="fc:frame:button:1" content="Create Meme" />
//         <meta property="fc:frame:button:1:action" content="post_redirect" />
//         <meta property="fc:frame:button:1:target" content="https://meme-vibe.vercel.app/create" />
//         <meta property="fc:frame:post_url" content="https://meme-vibe.vercel.app/api/frame-action" />
//       </head>
//       <body>
//         <h1>Meme Vibe Frame Debug</h1>
//         <p>This page contains valid Farcaster Frame metadata. Test this URL in the Warpcast validator.</p>
//       </body>
//     </html>
//   `;
  
//   return new Response(html, {
//     headers: {
//       'Content-Type': 'text/html',
//       'Cache-Control': 'no-cache, no-store, must-revalidate'
//     }
//   });
// }