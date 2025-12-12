<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let isAuthenticated = false;
  let adminUser = "";
  let activeTab: "ai" | "web3" = "ai";

  // Products data
  let aiProducts = [
    {
      id: 1,
      name: "Smart Assistant Agent",
      description:
        "An intelligent AI agent that helps automate daily tasks, manage schedules, and provide smart recommendations.",
      status: "Coming Soon",
    },
    {
      id: 2,
      name: "Data Analysis Agent",
      description:
        "AI-powered agent for analyzing complex datasets, generating insights, and creating visual reports automatically.",
      status: "In Development",
    },
    {
      id: 3,
      name: "Trading Bot Agent",
      description:
        "Autonomous trading agent with advanced market analysis, risk management, and automated execution capabilities.",
      status: "Planning",
    },
  ];

  let web3Products = [
    {
      id: 4,
      name: "NFT Marketplace",
      description:
        "A next-generation NFT marketplace with AI-powered curation, smart pricing, and cross-chain support.",
      status: "Coming Soon",
    },
    {
      id: 5,
      name: "DeFi Dashboard",
      description:
        "Unified dashboard for managing DeFi positions across multiple chains with yield optimization suggestions.",
      status: "In Development",
    },
    {
      id: 6,
      name: "Token Launchpad",
      description:
        "Secure and compliant token launch platform with built-in vesting, staking, and governance features.",
      status: "Planning",
    },
  ];

  $: currentProducts = activeTab === "ai" ? aiProducts : web3Products;

  // Modal state
  let showModal = false;
  let isAdding = false;
  let editingProduct: {
    id: number;
    name: string;
    description: string;
    status: string;
  } | null = null;

  // Activity log
  interface Activity {
    id: number;
    action: "add" | "edit" | "delete";
    productName: string;
    category: string;
    timestamp: Date;
  }
  let activities: Activity[] = [];

  function addActivity(action: Activity["action"], productName: string) {
    activities = [
      {
        id: Date.now(),
        action,
        productName,
        category: activeTab === "ai" ? "AI Agent" : "Web3",
        timestamp: new Date(),
      },
      ...activities,
    ].slice(0, 10); // Keep only last 10
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function openAddModal() {
    isAdding = true;
    editingProduct = {
      id: Date.now(),
      name: "",
      description: "",
      status: "Planning",
    };
    showModal = true;
  }

  function openEditModal(product: typeof editingProduct) {
    isAdding = false;
    editingProduct = { ...product! };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingProduct = null;
    isAdding = false;
  }

  function saveProduct() {
    if (!editingProduct) return;

    if (isAdding) {
      // Add new product
      if (activeTab === "ai") {
        aiProducts = [...aiProducts, editingProduct];
      } else {
        web3Products = [...web3Products, editingProduct];
      }
      addActivity("add", editingProduct.name);
    } else {
      // Update existing product
      if (activeTab === "ai") {
        aiProducts = aiProducts.map((p) =>
          p.id === editingProduct!.id ? editingProduct! : p
        );
      } else {
        web3Products = web3Products.map((p) =>
          p.id === editingProduct!.id ? editingProduct! : p
        );
      }
      addActivity("edit", editingProduct.name);
    }
    closeModal();
  }

  function deleteProduct(id: number, name: string) {
    if (confirm("Are you sure you want to delete this product?")) {
      if (activeTab === "ai") {
        aiProducts = aiProducts.filter((p) => p.id !== id);
      } else {
        web3Products = web3Products.filter((p) => p.id !== id);
      }
      addActivity("delete", name);
    }
  }

  onMount(() => {
    const session = localStorage.getItem("foxuse_admin_session");
    const user = localStorage.getItem("foxuse_admin_user");

    if (session !== "authenticated") {
      goto("/admin");
    } else {
      isAuthenticated = true;
      adminUser = user || "Admin";
    }
  });
</script>

<svelte:head>
  <title>Product Management | FOXuse. Admin</title>
</svelte:head>

{#if isAuthenticated}
  <div class="min-h-screen bg-brand-dark text-white font-sans relative">
    <!-- Background Effects -->
    <div class="fixed inset-0 z-0">
      <ZodiacBackground />
      <div
        class="absolute -top-40 -left-40 w-[600px] h-[200vh] bg-brand-pink opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-[600px] h-[200vh] bg-purple-600 opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
      ></div>
    </div>

    <Navbar isAdmin={true} {adminUser} />

    <!-- Main Content -->
    <main class="relative z-10 px-4 sm:px-6 pt-28 pb-20">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-xl font-bold text-white">Product Management</h1>
        </div>

        <!-- Tab Buttons -->
        <div class="flex gap-2 mb-6">
          <button
            on:click={() => (activeTab = "ai")}
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer
              {activeTab === 'ai'
              ? 'bg-brand-pink text-white'
              : 'bg-brand-card/70 text-gray-400 hover:text-white border border-white/10'}"
          >
            AI Agent Products
          </button>
          <button
            on:click={() => (activeTab = "web3")}
            class="px-4 py-2 rounded-lg font-medium text-sm transition-all cursor-pointer
              {activeTab === 'web3'
              ? 'bg-purple-500 text-white'
              : 'bg-brand-card/70 text-gray-400 hover:text-white border border-white/10'}"
          >
            Web3 Products
          </button>

          <!-- Spacer -->
          <div class="flex-1"></div>

          <!-- Add Product Button -->
          <button
            on:click={openAddModal}
            class="px-4 py-2 rounded-lg font-medium text-sm bg-green-500 hover:bg-green-600 text-white transition-all cursor-pointer flex items-center gap-2"
          >
            <span>+</span> Add Product
          </button>
        </div>

        <!-- Products Table -->
        <div
          class="bg-brand-card/70 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
        >
          <table class="w-full">
            <thead class="bg-white/5">
              <tr>
                <th
                  class="text-left text-xs font-medium text-gray-400 px-4 py-3"
                  >Name</th
                >
                <th
                  class="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden md:table-cell"
                  >Description</th
                >
                <th
                  class="text-left text-xs font-medium text-gray-400 px-4 py-3"
                  >Status</th
                >
                <th
                  class="text-right text-xs font-medium text-gray-400 px-4 py-3"
                  >Action</th
                >
              </tr>
            </thead>
            <tbody>
              {#each currentProducts as product}
                <tr
                  class="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td class="px-4 py-3">
                    <span class="text-sm font-medium text-white"
                      >{product.name}</span
                    >
                  </td>
                  <td class="px-4 py-3 hidden md:table-cell">
                    <span class="text-xs text-gray-400 line-clamp-2"
                      >{product.description}</span
                    >
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="text-xs px-2 py-1 rounded-full
                      {product.status === 'Coming Soon'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : ''}
                      {product.status === 'In Development'
                        ? 'bg-blue-500/20 text-blue-400'
                        : ''}
                      {product.status === 'Planning'
                        ? 'bg-gray-500/20 text-gray-400'
                        : ''}"
                    >
                      {product.status}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        on:click={() => openEditModal(product)}
                        class="text-xs px-3 py-1.5 bg-brand-pink/20 text-brand-pink hover:bg-brand-pink hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        on:click={() => deleteProduct(product.id, product.name)}
                        class="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>

        <!-- Recent Activity -->
        <h2 class="text-sm font-bold text-white mb-3 mt-8">Recent Activity</h2>
        <div
          class="bg-brand-card/70 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden"
        >
          {#if activities.length === 0}
            <div class="text-center text-gray-500 py-6">
              <div class="text-2xl mb-1">📭</div>
              <p class="text-xs">No recent activity</p>
            </div>
          {:else}
            <div class="divide-y divide-white/5">
              {#each activities as activity}
                <div class="px-4 py-3 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <span class="text-lg">
                      {#if activity.action === "add"}✅{:else if activity.action === "edit"}✏️{:else}🗑️{/if}
                    </span>
                    <div>
                      <p class="text-sm text-white">
                        <span
                          class="font-medium
                          {activity.action === 'add' ? 'text-green-400' : ''}
                          {activity.action === 'edit' ? 'text-yellow-400' : ''}
                          {activity.action === 'delete' ? 'text-red-400' : ''}"
                        >
                          {activity.action === "add"
                            ? "Added"
                            : activity.action === "edit"
                              ? "Edited"
                              : "Deleted"}
                        </span>
                        {activity.productName}
                      </p>
                      <p class="text-xs text-gray-500">
                        {activity.category} Product
                      </p>
                    </div>
                  </div>
                  <span class="text-xs text-gray-500"
                    >{formatTime(activity.timestamp)}</span
                  >
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </main>

    <Footer />
  </div>

  <!-- Edit Modal -->
  {#if showModal && editingProduct}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        class="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        on:click={closeModal}
        aria-label="Close modal"
      ></button>
      <div
        class="relative bg-brand-card rounded-xl border border-white/10 w-full max-w-lg p-6"
      >
        <h2 class="text-lg font-bold text-white mb-4">
          {isAdding ? "Add Product" : "Edit Product"}
        </h2>

        <div class="space-y-4">
          <div>
            <label for="product-name" class="block text-xs text-gray-400 mb-1"
              >Name</label
            >
            <input
              type="text"
              id="product-name"
              bind:value={editingProduct.name}
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label
              for="product-description"
              class="block text-xs text-gray-400 mb-1">Description</label
            >
            <textarea
              id="product-description"
              bind:value={editingProduct.description}
              rows="3"
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink resize-none"
            ></textarea>
          </div>

          <div>
            <label for="product-status" class="block text-xs text-gray-400 mb-1"
              >Status</label
            >
            <select
              id="product-status"
              bind:value={editingProduct.status}
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink cursor-pointer"
            >
              <option value="Planning">Planning</option>
              <option value="In Development">In Development</option>
              <option value="Coming Soon">Coming Soon</option>
            </select>
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            on:click={closeModal}
            class="flex-1 px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            on:click={saveProduct}
            class="flex-1 px-4 py-2 text-sm bg-brand-pink hover:bg-pink-600 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  {/if}
{:else}
  <div class="fixed inset-0 bg-brand-dark flex items-center justify-center">
    <div class="text-white text-sm">Loading...</div>
  </div>
{/if}
