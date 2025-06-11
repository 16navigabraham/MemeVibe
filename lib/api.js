// Default API credentials
let apiCredentials = {
  username: '',
  password: '',
}

// Function to update API credentials
export function updateApiCredentials(username, password) {
  apiCredentials = { username, password }
  // In a real app, you might want to persist this in localStorage or a database
  return true
}

// Function to get current API credentials
export function getApiCredentials() {
  return { ...apiCredentials }
}

// Fetch popular meme templates from Imgflip API
export async function fetchMemeTemplates() {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes")
    const data = await response.json()

    if (data.success) {
      return data.data.memes
    } else {
      throw new Error(data.error_message || "Failed to fetch meme templates")
    }
  } catch (error) {
    console.error("Error fetching meme templates:", error)
    throw error
  }
}

// Generate a meme using Imgflip API
export async function generateMeme(templateId, texts) {
  // Always get credentials from NEXT_PUBLIC_ env or fallback to apiCredentials
  const username = process.env.NEXT_PUBLIC_IMGFLIP_USERNAME || apiCredentials.username
  const password = process.env.NEXT_PUBLIC_IMGFLIP_PASSWORD || apiCredentials.password

  // Debug: log credentials (remove in production)
  console.log("Imgflip username:", username, "password:", password ? "set" : "not set");

  if (!username || !password) {
    throw new Error("Imgflip credentials are missing. Set NEXT_PUBLIC_IMGFLIP_USERNAME and NEXT_PUBLIC_IMGFLIP_PASSWORD in your .env.local and Vercel dashboard.")
  }

  const formData = new URLSearchParams()
  formData.append("template_id", templateId)
  formData.append("username", username)
  // Encode the password to ensure special characters like $ are sent correctly
  formData.append("password", encodeURIComponent(password))

  // Add text boxes
  texts.forEach((text, index) => {
    formData.append(`boxes[${index}][text]`, text)
  })

  // Debug: log what is being sent to Imgflip
  console.log("Sending to Imgflip:", {
    username,
    password,
    templateId,
    texts
  });

  try {
    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    // Debug: log Imgflip API response
    console.log("Imgflip API response:", JSON.stringify(data, null, 2));

    if (data.success) {
      return data.data
    } else {
      // Show full error message from Imgflip
      if (data.error_message === "Invalid username/password combination") {
        throw new Error("Invalid Imgflip username or password. Please check your credentials in .env.local and Vercel dashboard.")
      }
      throw new Error(data.error_message || JSON.stringify(data) || "Failed to generate meme")
    }
  } catch (error) {
    console.error("Error generating meme:", error)
    throw error
  }
}