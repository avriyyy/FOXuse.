<script lang="ts">
  function handleSubmit(e: Event) {
    e.preventDefault();
    alert("Thank you! You have subscribed to receive updates from FOXuse.");
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
      <input
        type="email"
        placeholder="Enter your email..."
        class="flex-1 px-6 py-4 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
        required
      />
      <button
        type="submit"
        class="px-8 py-4 bg-brand-pink hover:bg-pink-600 text-white font-bold rounded-lg transition-colors shadow-[0_0_20px_rgba(245,44,143,0.5)] hover:shadow-[0_0_30px_rgba(245,44,143,0.7)]"
      >
        Subscribe
      </button>
    </form>
    <p class="mt-4 text-sm text-gray-500">
      We respect your privacy. Unsubscribe anytime.
    </p>
  </div>
</section>
