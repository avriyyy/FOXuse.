<script lang="ts">
  import { goto } from "$app/navigation";
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";

  let username = "";
  let password = "";
  let error = "";
  let isLoading = false;

  async function handleLogin(e: Event) {
    e.preventDefault();
    isLoading = true;
    error = "";

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("foxuse_admin_session", "authenticated");
        localStorage.setItem("foxuse_admin_user", data.user);
        goto("/admin/dashboard");
      } else {
        error = data.message || "Invalid username or password";
        isLoading = false;
      }
    } catch (err) {
      error = "Login failed. Please try again.";
      isLoading = false;
    }
  }
</script>

<svelte:head>
  <title>Admin Login | FOXuse.</title>
</svelte:head>

<div class="fixed inset-0 bg-brand-dark">
  <!-- Background Effects -->
  <ZodiacBackground />
  <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
    <div
      class="absolute -top-40 -left-40 w-[600px] h-[200vh] bg-brand-pink opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
    ></div>
    <div
      class="absolute -top-40 -right-40 w-[600px] h-[200vh] bg-purple-600 opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
    ></div>
  </div>

  <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-3 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            class="w-12 h-12 text-brand-pink"
          >
            <path
              d="M15 73 L45 73"
              fill="none"
              stroke="currentColor"
              stroke-width="7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M45 73 L55 27 M55 27 L85 27 M55 44 L85 44"
              fill="none"
              stroke="currentColor"
              stroke-width="7"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="font-logo text-3xl italic text-white">FOXuse.</span>
        </div>
        <h1 class="text-xl font-bold text-white">Admin Panel</h1>
        <p class="text-gray-500 text-sm mt-1">Sign in to access dashboard</p>
      </div>

      <!-- Login Form -->
      <form
        on:submit={handleLogin}
        class="bg-brand-card/80 backdrop-blur-sm rounded-xl p-8 border border-white/10"
      >
        {#if error}
          <div
            class="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center"
          >
            {error}
          </div>
        {/if}

        <div class="mb-4">
          <label
            for="username"
            class="block text-sm font-medium text-gray-300 mb-2">Username</label
          >
          <input
            type="text"
            id="username"
            bind:value={username}
            class="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            placeholder="Enter username"
            required
          />
        </div>

        <div class="mb-6">
          <label
            for="password"
            class="block text-sm font-medium text-gray-300 mb-2">Password</label
          >
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink focus:ring-1 focus:ring-brand-pink"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          class="w-full py-3 bg-brand-pink hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors cursor-pointer"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p class="text-center text-gray-600 text-xs mt-6">
        &copy; 2025 FOXuse. Admin Access Only.
      </p>
    </div>
  </div>
</div>

<style>
  .font-logo {
    font-family: "Courier Prime", monospace;
  }
</style>
