
# Meme Vibe 😄🎨

A fun Farcaster miniapp that lets users browse meme templates, generate their own memes using the Imgflip API, **mint memes onchain**, and **vote for the best memes**. Built with **React**, **Tailwind CSS**, **Next.js**, and supports **infinite scrolling** and **admin credential configuration**.

---

## 🌟 Features

- 🔍 Browse a large list of meme templates (with infinite scroll).
- ✍️ Add custom text to top and bottom of memes.
- 🖼️ Generate and preview memes using the Imgflip API.
- 💾 Cast generated memes directly to Warpcast.
- 🔐 Admin panel to update API credentials securely.
- 🪙 **Mint memes onchain as NFTs** on the Base network.
- 🗳️ **Vote for your favorite memes** in a community leaderboard.

---

## 🛠 Tech Stack

- **Next.js + TypeScript** – Frontend framework
- **Tailwind CSS** – UI styling
- **Imgflip API** – Meme image generation
- **Foundry / Solidity** – Smart contract for minting and voting
- **Base (L2)** – Onchain meme minting and voting
- **LocalStorage** – Save API credentials locally

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/16navigabraham/MemeVibe.git
cd MemeVibe
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

App will be live at `http://localhost:5173` (or another port).

---

## 🧪 Usage

### 🏠 Homepage

* Scroll to explore meme templates.
* Click on any meme to customize it.

### 🎨 Meme Generator

* Enter top and bottom text.
* Click **Generate Meme**.
* Click **Cast Meme** to post it on Farcaster.

### 🔐 Admin Panel

* Click the ⚙️ **Admin** button in the navbar.
* Enter the admin password: `************`
* Input Imgflip credentials (username + password).
* Credentials are saved in localStorage.

### 🪙 Mint Meme Onchain

* After generating a meme, click **Mint Onchain**.
* A wallet popup will request confirmation (minting is on Base).


### 🗳️ Vote for Memes

* Go to the **Meme battle** page.
* Browse all available vote contest.
* use farcaster wallet to perform voting transaction.
* Votes are recorded onchain.

---

## 📦 Project Structure

```
/contracts        # Smart contracts (Solidity + Foundry)
pages/            # Next.js pages
components/       # Reusable UI components
lib/              # Utility functions
public/           # Static assets
styles/           # Tailwind setup
```

---

## 📄 License

MIT License. Feel free to use and modify this project.

---

## 🙌 Credits

* [Imgflip API](https://api.imgflip.com/) – for meme generation
* [Tailwind CSS](https://tailwindcss.com/) – for utility-first styling
* [Base](https://base.org/) – for deploying onchain
* [Farcaster](https://warpcast.com/) – for social posting

```


