<script lang="ts">
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let activeTab: "ai" | "web3" = "ai";

  const aiProducts = [
    {
      name: "Smart Assistant Agent",
      description:
        "An intelligent AI agent that helps automate daily tasks, manage schedules, and provide smart recommendations.",
      status: "Coming Soon",
      statusColor: "text-yellow-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>`,
    },
    {
      name: "Data Analysis Agent",
      description:
        "AI-powered agent for analyzing complex datasets, generating insights, and creating visual reports automatically.",
      status: "In Development",
      statusColor: "text-blue-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>`,
    },
    {
      name: "Trading Bot Agent",
      description:
        "Autonomous trading agent with advanced market analysis, risk management, and automated execution capabilities.",
      status: "Planning",
      statusColor: "text-gray-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>`,
    },
  ];

  const web3Products = [
    {
      name: "NFT Marketplace",
      description:
        "A next-generation NFT marketplace with AI-powered curation, smart pricing, and cross-chain support.",
      status: "Coming Soon",
      statusColor: "text-yellow-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>`,
    },
    {
      name: "DeFi Dashboard",
      description:
        "Unified dashboard for managing DeFi positions across multiple chains with yield optimization suggestions.",
      status: "In Development",
      statusColor: "text-blue-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>`,
    },
    {
      name: "Token Launchpad",
      description:
        "Secure and compliant token launch platform with built-in vesting, staking, and governance features.",
      status: "Planning",
      statusColor: "text-gray-400",
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`,
    },
  ];

  $: currentProducts = activeTab === "ai" ? aiProducts : web3Products;
</script>

<svelte:head>
  <title>Products | FOXuse.</title>
  <meta
    name="description"
    content="Explore FOXuse products - AI Agents and Web3 solutions for the future."
  />
</svelte:head>

<div
  class="bg-brand-dark text-white font-sans overflow-x-hidden min-h-screen relative"
>
  <ZodiacBackground />

  <!-- Extended gradient blobs -->
  <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      class="absolute -top-40 -left-40 w-[600px] h-[1500px] bg-brand-pink opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
    ></div>
    <div
      class="absolute -top-40 -right-40 w-[600px] h-[1500px] bg-purple-600 opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
    ></div>
  </div>

  <Navbar />

  <main class="relative z-10 pt-32 pb-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">
          Our <span
            class="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-purple-500"
            >Products</span
          >
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto text-lg">
          Discover the innovative AI Agent and Web3 products we're building at
          FOXuse.
        </p>
      </div>

      <!-- Tab Buttons -->
      <div class="flex justify-center mb-12">
        <div
          class="inline-flex bg-brand-card/80 backdrop-blur-sm rounded-xl p-1.5 border border-white/10"
        >
          <button
            on:click={() => (activeTab = "ai")}
            class="px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer
              {activeTab === 'ai'
              ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'}"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              ></path>
            </svg>
            AI Agent
          </button>
          <button
            on:click={() => (activeTab = "web3")}
            class="px-6 py-3 rounded-lg font-medium text-sm transition-all flex items-center gap-2 cursor-pointer
              {activeTab === 'web3'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'}"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              ></path>
            </svg>
            Web3
          </button>
        </div>
      </div>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        {#each currentProducts as product (product.name)}
          <div
            class="rounded-xl bg-brand-card/80 backdrop-blur-sm border border-white/10 p-6 hover:border-{activeTab ===
            'ai'
              ? 'brand-pink'
              : 'purple-500'}/50 transition-all hover:-translate-y-1 group"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-12 h-12 {activeTab === 'ai'
                  ? 'bg-brand-pink/20'
                  : 'bg-purple-500/20'} rounded-lg flex items-center justify-center group-hover:{activeTab ===
                'ai'
                  ? 'bg-brand-pink/30'
                  : 'bg-purple-500/30'} transition-colors"
              >
                <svg
                  class="w-6 h-6 {activeTab === 'ai'
                    ? 'text-brand-pink'
                    : 'text-purple-500'}"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {@html product.icon}
                </svg>
              </div>
              <span
                class="text-xs font-medium {product.statusColor} bg-white/5 px-3 py-1 rounded-full"
              >
                {product.status}
              </span>
            </div>

            <h3 class="text-lg font-bold mb-2">{product.name}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              {product.description}
            </p>

            <div class="mt-5 flex justify-end">
              <button
                class="group/btn relative px-5 py-2.5 rounded-lg font-bold text-sm overflow-hidden transition-all hover:scale-105 cursor-pointer
                  {activeTab === 'ai'
                  ? 'bg-brand-pink text-white'
                  : 'bg-purple-500 text-white'}"
              >
                <div
                  class="absolute inset-0 w-full h-full bg-white/20 group-hover/btn:translate-x-full transition-transform duration-500 ease-out -translate-x-full"
                ></div>
                <span class="relative">Visit</span>
              </button>
            </div>
          </div>
        {/each}
      </div>

      <!-- CTA -->
      <div
        class="text-center mt-20 p-8 rounded-2xl bg-gradient-to-r from-brand-pink/20 to-purple-500/20 border border-white/10"
      >
        <h3 class="text-2xl font-bold mb-4">
          Want to be notified when we launch?
        </h3>
        <p class="text-gray-400 mb-6">
          Subscribe to get early access and exclusive updates.
        </p>
        <a
          href="/#subscribe"
          class="inline-block px-8 py-3 bg-brand-pink hover:bg-pink-600 text-white font-bold rounded-lg transition-colors"
        >
          Subscribe for Updates
        </a>
      </div>
    </div>
  </main>

  <Footer />
</div>
