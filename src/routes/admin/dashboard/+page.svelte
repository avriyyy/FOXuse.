<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Footer from "$lib/components/Footer.svelte";
  import Loading from "$lib/components/Loading.svelte";

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
    link?: string | null;
  }

  let aiProducts: Product[] = [];
  let web3Products: Product[] = [];

  $: currentProducts = activeTab === "ai" ? aiProducts : web3Products;

  // Modal state
  let showModal = false;
  let isAdding = false;
  let isSaving = false;
  let editingProduct: Product | null = null;

  // Confirmation Modal
  let showConfirmModal = false;
  let confirmMessage = "";
  let confirmCallback: (() => void) | null = null;

  // Alert State
  let showAlert = false;
  let alertMessage = "";
  let alertType: "success" | "error" = "success";

  // Activity log from database
  interface Activity {
    id: number;
    action: string;
    productName: string;
    category: string;
    adminUser: string;
    createdAt: string;
  }
  let activities: Activity[] = [];

  // Subscribers
  let subscriberCount = 0;

  // Notification Modal
  let showNotifyModal = false;
  let isSending = false;
  let notifySubject = "";
  let notifyMessage = "";
  let notifyLink = "";
  let notifyingProduct: Product | null = null;

  function showNotification(
    message: string,
    type: "success" | "error" = "success"
  ) {
    alertMessage = message;
    alertType = type;
    showAlert = true;
    setTimeout(() => {
      showAlert = false;
    }, 3000);
  }

  function showConfirmation(message: string, callback: () => void) {
    confirmMessage = message;
    confirmCallback = callback;
    showConfirmModal = true;
  }

  function closeConfirmation() {
    showConfirmModal = false;
    confirmCallback = null;
  }

  function confirmAction() {
    if (confirmCallback) confirmCallback();
    closeConfirmation();
  }

  async function fetchActivities() {
    try {
      const res = await fetch("/api/activities");
      if (res.ok) {
        activities = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  }

  async function fetchSubscribers() {
    try {
      const res = await fetch("/api/admin/subscribers", {
        headers: { "x-admin-session": "authenticated" },
      });
      if (res.ok) {
        const data = await res.json();
        subscriberCount = data.length;
      }
    } catch (err) {
      console.error("Failed to fetch subscribers:", err);
    }
  }

  function openNotifyModal(product: Product) {
    notifyingProduct = product;
    notifySubject = `Update: ${product.name} is ${product.status}!`;
    notifyMessage = `We have exciting news! ${product.name} is now ${product.status}.\n\n${product.description}`;
    notifyLink = product.link || "";
    showNotifyModal = true;
  }

  function closeNotifyModal() {
    showNotifyModal = false;
    notifyingProduct = null;
    isSending = false;
  }

  async function sendNotification() {
    if (!notifySubject || !notifyMessage) return;

    isSending = true;
    try {
      const res = await fetch("/api/admin/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": "authenticated",
        },
        body: JSON.stringify({
          subject: notifySubject,
          message: notifyMessage.replace(/\n/g, "<br>"), // basic formatting
          link: notifyLink,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        showNotification(`Success: ${data.message}`);
        closeNotifyModal();
      } else {
        showNotification(data.error || "Failed to send", "error");
      }
    } catch (err) {
      console.error("Failed to send notification:", err);
      showNotification("Error sending notification", "error");
    } finally {
      isSending = false;
    }
  }

  async function addActivity(action: string, productName: string) {
    try {
      await fetch("/api/activities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-session": "authenticated",
        },
        body: JSON.stringify({
          action,
          productName,
          category: activeTab === "ai" ? "AI Agent" : "Web3",
          adminUser,
        }),
      });
      await fetchActivities();
    } catch (err) {
      console.error("Failed to save activity:", err);
    }
  }

  function formatTime(dateStr: string) {
    const date = new Date(dateStr);
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
      showNotification("Failed to load products", "error");
    } finally {
      // Small delay to prevent flickering if loading is too fast, and matches main site feel
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
      link: "",
    };
    showModal = true;
  }

  function openEditModal(product: Product) {
    isAdding = false;
    editingProduct = { ...product, link: product.link || "" };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    editingProduct = null;
    isAdding = false;
  }

  async function saveProduct() {
    if (!editingProduct) return;

    // Fix link format
    if (editingProduct.link && !editingProduct.link.match(/^https?:\/\//)) {
      editingProduct.link = `https://${editingProduct.link}`;
    }

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
            link: editingProduct.link || null,
          }),
        });

        if (res.ok) {
          addActivity("add", editingProduct.name);
          await fetchProducts();
          showNotification("Product added successfully!");
        } else {
          showNotification("Failed to add product", "error");
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
            link: editingProduct.link || null,
          }),
        });

        if (res.ok) {
          addActivity("edit", editingProduct.name);
          await fetchProducts();
          showNotification("Product updated successfully!");
        } else {
          showNotification("Failed to update product", "error");
        }
      }
    } catch (err) {
      console.error("Failed to save product:", err);
      showNotification("An error occurred while saving", "error");
    } finally {
      isSaving = false;
      closeModal();
    }
  }

  function deleteProduct(id: number, name: string) {
    showConfirmation(`Are you sure you want to delete "${name}"?`, async () => {
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
          showNotification("Product deleted successfully!");
        } else {
          showNotification("Failed to delete product", "error");
        }
      } catch (err) {
        console.error("Failed to delete product:", err);
        showNotification("An error occurred while deleting", "error");
      }
    });
  }

  onMount(() => {
    const session = localStorage.getItem("foxuse_admin_session");
    const user = localStorage.getItem("foxuse_admin_user");

    if (session !== "authenticated") {
      goto("/admin");
    } else {
      isAuthenticated = true;
      adminUser = user || "Admin";

      // Initial load with visual loading state
      const initLoad = async () => {
        await Promise.all([
          fetchProducts(),
          fetchActivities(),
          fetchSubscribers(),
        ]);
        // keep loading true for a bit to show animation if it was super fast, optional
      };

      initLoad();
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
          <div
            class="flex items-center gap-2 bg-brand-card/50 px-3 py-1.5 rounded-lg border border-white/10"
          >
            <span class="text-xs text-gray-400">Subscribers:</span>
            <span class="text-sm font-bold text-brand-pink"
              >{subscriberCount}</span
            >
          </div>
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
            <div class="py-20 flex justify-center">
              <div
                class="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-pink"
              ></div>
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
                    class="text-left text-xs font-medium text-gray-400 px-4 py-3 hidden sm:table-cell"
                    >Link</th
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
                          : ''}
                        {product.status === 'Deployed'
                          ? 'bg-green-500/20 text-green-400'
                          : ''}"
                      >
                        {product.status}
                      </span>
                    </td>
                    <td class="px-4 py-3 hidden sm:table-cell">
                      {#if product.link}
                        <a
                          href={product.link}
                          target="_blank"
                          class="text-xs text-brand-pink hover:underline truncate max-w-[150px] block"
                        >
                          🔗 Visit
                        </a>
                      {:else}
                        <span class="text-xs text-gray-600">-</span>
                      {/if}
                    </td>
                    <td class="px-4 py-3 text-right">
                      <div class="flex items-center justify-end gap-2">
                        <button
                          on:click={() => openNotifyModal(product)}
                          class="text-xs px-3 py-1.5 bg-purple-500/20 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-colors cursor-pointer"
                          title="Notify Subscribers"
                        >
                          🔔
                        </button>
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
                    >{formatTime(activity.createdAt)}</span
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
              <option value="Deployed">Deployed</option>
            </select>
          </div>

          <div>
            <label for="product-link" class="block text-xs text-gray-400 mb-1"
              >Link (optional)</label
            >
            <input
              type="url"
              id="product-link"
              bind:value={editingProduct.link}
              placeholder="https://example.com"
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink"
            />
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

  <!-- Custom Confirmation Modal -->
  {#if showConfirmModal}
    <div class="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm"
        on:click={closeConfirmation}
      ></div>
      <div
        class="relative bg-brand-card rounded-xl border border-white/10 w-full max-w-sm p-6 shadow-2xl"
      >
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900/40 mb-4"
          >
            <svg
              class="h-6 w-6 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-white mb-2">Confirm Action</h3>
          <p class="text-sm text-gray-400 mb-6">{confirmMessage}</p>
          <div class="flex gap-3">
            <button
              on:click={closeConfirmation}
              class="flex-1 px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              on:click={confirmAction}
              class="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}

  <!-- Notification Modal -->
  {#if showNotifyModal}
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        class="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-default"
        on:click={closeNotifyModal}
        aria-label="Close modal"
      ></button>
      <div
        class="relative bg-brand-card rounded-xl border border-white/10 w-full max-w-lg p-6 shadow-2xl"
      >
        <h2 class="text-lg font-bold text-white mb-1">Notify Subscribers</h2>
        <p class="text-xs text-gray-400 mb-4">
          Send an email update to {subscriberCount} subscribers.
        </p>

        <div class="space-y-4">
          <div>
            <label for="notify-subject" class="block text-xs text-gray-400 mb-1"
              >Subject</label
            >
            <input
              type="text"
              id="notify-subject"
              bind:value={notifySubject}
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink"
            />
          </div>

          <div>
            <label for="notify-message" class="block text-xs text-gray-400 mb-1"
              >Message</label
            >
            <textarea
              id="notify-message"
              bind:value={notifyMessage}
              rows="6"
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink resize-none"
            ></textarea>
          </div>

          <div>
            <label for="notify-link" class="block text-xs text-gray-400 mb-1"
              >Link Button (Optional)</label
            >
            <input
              type="url"
              id="notify-link"
              bind:value={notifyLink}
              placeholder="https://..."
              class="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-sm focus:outline-none focus:border-brand-pink"
            />
          </div>
        </div>

        <div class="flex gap-3 mt-6">
          <button
            on:click={closeNotifyModal}
            class="flex-1 px-4 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            on:click={sendNotification}
            disabled={isSending}
            class="flex-1 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-lg transition-colors flex justify-center gap-2"
          >
            {#if isSending}
              Sending...
            {:else}
              🚀 Send to {subscriberCount}
            {/if}
          </button>
        </div>
      </div>
    </div>
  {/if}

  <!-- Toast/Alert -->
  {#if showAlert}
    <div class="fixed bottom-6 right-6 z-[120] animate-bounce-in">
      <div
        class="px-6 py-3 rounded-lg shadow-xl border flex items-center gap-3
        {alertType === 'success'
          ? 'bg-green-900/90 border-green-700 text-green-100'
          : 'bg-red-900/90 border-red-700 text-red-100'}"
      >
        <span class="text-xl">
          {alertType === "success" ? "✅" : "❌"}
        </span>
        <span class="font-medium text-sm">{alertMessage}</span>
      </div>
    </div>
  {/if}
{:else}
  <Loading />
{/if}
