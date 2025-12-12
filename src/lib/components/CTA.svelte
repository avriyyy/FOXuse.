<script lang="ts">
  let email = "";
  let status: "idle" | "loading" | "success" | "error" = "idle";
  let message = "";

  async function handleSubmit(e: Event) {
    e.preventDefault();
    status = "loading";

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        status = "success";
        message = data.message;
        email = ""; // clear input
      } else {
        status = "error";
        message = data.error || "Failed to subscribe";
      }
    } catch (err) {
      status = "error";
      message = "Something went wrong. Please try again.";
    }

    setTimeout(() => {
      status = "idle";
      message = "";
    }, 5000);
  }
</script>

<section id="subscribe" class="py-24 relative overflow-hidden">
  <div class="absolute inset-0 bg-brand-pink/10"></div>
  <div
    class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-pink/30 rounded-full blur-[100px]"
  ></div>

  <div class="relative max-w-4xl mx-auto text-center px-4">
    <h2 class="text-4xl font-bold mb-6">Stay Updated</h2>
    <p class="text-xl text-gray-300 mb-10">
      Subscribe to get notified about our latest AI Agent and Web3 product
      updates, launches, and exclusive news from FOXuse.
    </p>

    <form
      class="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto"
      on:submit={handleSubmit}
    >
      <div class="flex-1">
        <input
          type="email"
          bind:value={email}
          disabled={status === "loading" || status === "success"}
          placeholder="Enter your email..."
          class="w-full px-6 py-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink disabled:opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading" || status === "success"}
        class="px-8 py-4 bg-brand-pink hover:bg-pink-600 text-white font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(245,44,143,0.5)] hover:shadow-[0_0_30px_rgba(245,44,143,0.7)] disabled:opacity-50 flex items-center justify-center min-w-[140px]"
      >
        {#if status === "loading"}
          <div
            class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
          ></div>
        {:else if status === "success"}
          Success!
        {:else}
          Subscribe
        {/if}
      </button>
    </form>

    {#if message}
      <p
        class="mt-4 text-sm font-medium {status === 'success'
          ? 'text-green-400'
          : 'text-red-400'} animate-fade-in"
      >
        {message}
      </p>
    {/if}

    <p class="mt-4 text-sm text-gray-500">
      We respect your privacy. Unsubscribe anytime.
    </p>
  </div>
</section>
