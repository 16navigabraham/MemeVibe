import { NextResponse } from 'next/server';

/**
 * API endpoint to handle Farcaster Frame button actions
 * This responds to POST requests from Farcaster when users interact with our frame
 */
export async function POST(request) {
  try {
    // Parse the frame action data from the request
    const data = await request.json();
    
    // Get the button index that was clicked (1 for Like, 2 for Create)
    const buttonIndex = data?.untrustedData?.buttonIndex;
    
    // Handle different button actions
    if (buttonIndex === 1) {
      // Button 1: Like - just return a new frame with a thank you message
      return new NextResponse(
        generateFrameHtml({
          title: "Thanks for the like!",
          image: data?.untrustedData?.image || "/placeholder.png",
          text: "Thanks for liking this meme!",
          buttons: [
            { text: "Make Your Own", action: "post_redirect", target: process.env.NEXT_PUBLIC_BASE_URL || "https://memetest-self.vercel.app/" }
          ]
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    } else {
      // Button 2: Create Your Own - redirect is handled by fc:frame:button:2:target
      // This code shouldn't normally be reached, but we include it as a fallback
      return new NextResponse(
        generateFrameHtml({
          title: "Create Your Own Meme",
          text: "Redirecting you to the meme creator...",
          buttons: [
            { text: "Go to Meme Creator", action: "post_redirect", target: process.env.NEXT_PUBLIC_BASE_URL || "https://memetest-self.vercel.app/" }
          ]
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'text/html',
          },
        }
      );
    }
  } catch (error) {
    console.error('Error processing frame action:', error);
    
    // Return an error frame
    return new NextResponse(
      generateFrameHtml({
        title: "Error",
        text: "Something went wrong processing your action.",
        buttons: [
          { text: "Try Again", action: "post", target: "/api/frame-action" }
        ]
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  }
}

/**
 * Helper function to generate frame HTML with the necessary meta tags
 */
function generateFrameHtml({ title, image, text, buttons }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://memetest-self.vercel.app/";
  
  // Generate button meta tags
  const buttonTags = buttons.map((button, index) => {
    const tags = [
      `<meta property="fc:frame:button:${index + 1}" content="${button.text}" />`
    ];
    
    if (button.action) {
      tags.push(`<meta property="fc:frame:button:${index + 1}:action" content="${button.action}" />`);
    }
    
    if (button.target) {
      tags.push(`<meta property="fc:frame:button:${index + 1}:target" content="${button.target}" />`);
    }
    
    return tags.join('\n');
  }).join('\n');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <meta property="og:title" content="${title}" />
      <meta property="og:description" content="${text}" />
      ${image ? `<meta property="og:image" content="${image}" />` : ''}
      
      <meta property="fc:frame" content="vNext" />
      ${image ? `<meta property="fc:frame:image" content="${image}" />` : ''}
      <meta property="fc:frame:post_url" content="${baseUrl}/api/frame-action" />
      ${buttonTags}
    </head>
    <body>
      <h1>${title}</h1>
      <p>${text}</p>
    </body>
    </html>
  `;
}