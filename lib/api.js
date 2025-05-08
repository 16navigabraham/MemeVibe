// Default API credentials
let apiCredentials = {
  username: "olalekancodes",
  password: "Rokeeb.6127#",
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
  const { username, password } = apiCredentials

  const formData = new URLSearchParams()
  formData.append("template_id", templateId)
  formData.append("username", username)
  formData.append("password", password)

  // Add text boxes
  texts.forEach((text, index) => {
    formData.append(`boxes[${index}][text]`, text)
  })

  try {
    const response = await fetch("https://api.imgflip.com/caption_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
    })

    const data = await response.json()

    if (data.success) {
      return data.data
    } else {
      throw new Error(data.error_message || "Failed to generate meme")
    }
  } catch (error) {
    console.error("Error generating meme:", error)
    throw error
  }
}
