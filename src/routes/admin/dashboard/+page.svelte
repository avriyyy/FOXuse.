<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let isAuthenticated = false;
  let adminUser = "";
  let activeTab: "ai" | "web3" = "ai";
  let isLoading = true;

  // Products from database
  interface Product {
    id: number;
    name: string;
    description: string;
    status: string;
    category: string;
  }

  let aiProducts: Product[] = [];
  let web3Products: Product[] = [];

  $: currentProducts = activeTab === "ai" ? aiProducts : web3Products;

  // Modal state
  let showModal = false;
  let isAdding = false;
  let isSaving = false;
  let editingProduct: Product | null = null;

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
    ].slice(0, 10);
  }

  function formatTime(date: Date) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  async function fetchProducts() {
    try {
      const [aiRes, web3Res] = await Promise.all([
        fetch("/api/products?category=ai"),
        fetch("/api/products?category=web3"),
      ]);
      aiProducts = await aiRes.json();
      web3Products = await web3Res.json();
    } catch (err) {
      console.error("Failed to fetch products:", err);
    } finally {
      isLoading = false;
    }
  }

  function openAddModal() {
    isAdding = true;
    editingProduct = {
      id: 0,
      name: "",
      description: "",
      status: "Planning",
      category: activeTab,
    };
    showModal = true;
  }

  function openEditModal(product: Product) {
    isAdding = false;
    editingProduct = { ...product };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingProduct = null;
    isAdding = false;
  }

  async function saveProduct() {
    if (!editingProduct) return;
    isSaving = true;

    try {
      if (isAdding) {
        // Create new product
        const res = await fetch("/api/products", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": "authenticated",
          },
          body: JSON.stringify({
            name: editingProduct.name,
            description: editingProduct.description,
            status: editingProduct.status,
            category: activeTab,
          }),
        });

        if (res.ok) {
          addActivity("add", editingProduct.name);
          await fetchProducts();
        }
      } else {
        // Update existing product
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-session": "authenticated",
          },
          body: JSON.stringify({
            name: editingProduct.name,
            description: editingProduct.description,
            status: editingProduct.status,
            category: editingProduct.category,
          }),
        });

        if (res.ok) {
          addActivity("edit", editingProduct.name);
          await fetchProducts();
        }
      }
    } catch (err) {
      console.error("Failed to save product:", err);
    } finally {
      isSaving = false;
      closeModal();
    }
  }

  async function deleteProduct(id: number, name: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-session": "authenticated",
        },
      });

      if (res.ok) {
        addActivity("delete", name);
        await fetchProducts();
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
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
      fetchProducts();
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

          <div class="flex-1"></div>

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
          {#if isLoading}
            <div class="text-center py-10">
              <div class="text-gray-400">Loading products...</div>
            </div>
          {:else if currentProducts.length === 0}
            <div class="text-center py-10">
              <div class="text-2xl mb-2">📦</div>
              <div class="text-gray-400">
                No products yet. Add your first product!
              </div>
            </div>
          {:else}
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
                          on:click={() =>
                            deleteProduct(product.id, product.name)}
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
          {/if}
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
            disabled={isSaving}
            class="flex-1 px-4 py-2 text-sm bg-brand-pink hover:bg-pink-600 disabled:opacity-50 text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            {isSaving ? "Saving..." : "Save"}
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
