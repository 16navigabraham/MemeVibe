import { NextResponse } from "next/server"

export async function POST(req) {
  try {
    const { name, description, image } = await req.json()

    if (!name || !description || !image) {
      return NextResponse.json({ error: "Missing required metadata fields" }, { status: 400 })
    }

    const metadata = { name, description, image }

    const PINATA_API_KEY = process.env.PINATA_API_KEY
    const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY

    if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
      return NextResponse.json({ error: "Pinata API keys not set" }, { status: 500 })
    }

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_API_KEY,
      },
      body: JSON.stringify({ pinataContent: metadata }),
    })

    if (!res.ok) {
      let errorMsg = "Failed to upload metadata to Pinata"
      try {
        const errorData = await res.json()
        if (errorData && errorData.error) errorMsg = errorData.error
        else if (errorData && errorData.message) errorMsg = errorData.message
      } catch {}
      return NextResponse.json({ error: errorMsg, status: res.status }, { status: 500 })
    }

    const data = await res.json()
    if (!data.IpfsHash) {
      return NextResponse.json({ error: "Pinata did not return IpfsHash" }, { status: 500 })
    }
    const url = `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`

    return NextResponse.json({ url })
  } catch (err) {
    return NextResponse.json(
      { error: err?.message || "Unexpected server error" },
      { status: 500 }
    )
  }
}
