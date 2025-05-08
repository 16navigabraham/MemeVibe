"use client";


import dynamic from "next/dynamic";
// import Layout from "./layout.jsx";


const Layout = dynamic(() => import("./layout"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col p-4">
      
      <Layout/>
    </main>
  );
}
