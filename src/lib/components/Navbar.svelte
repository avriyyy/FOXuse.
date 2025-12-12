<script lang="ts">
  import Logo from "./Logo.svelte";
  import { goto } from "$app/navigation";

  export let isAdmin = false;
  export let adminUser = "";

  let mobileMenuOpen = false;

  function toggleMobileMenu() {
    mobileMenuOpen = !mobileMenuOpen;
  }

  function handleLogout() {
    localStorage.removeItem("foxuse_admin_session");
    localStorage.removeItem("foxuse_admin_user");
    goto("/admin");
  }
</script>

<nav
  class="fixed w-full z-50 bg-brand-dark/80 backdrop-blur-md border-b border-white/10"
>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-20">
      <!-- Logo Area -->
      <a
        href={isAdmin ? "/admin/dashboard" : "/"}
        class="flex items-center gap-3"
      >
        <Logo size="md" />
        {#if isAdmin}
          <span class="text-gray-500 text-sm">Admin</span>
        {/if}
      </a>

      <!-- Desktop Menu -->
      <div class="hidden md:block">
        <div class="ml-10 flex items-baseline space-x-8">
          {#if isAdmin}
            <!-- Admin Menu -->
            <a
              href="/"
              target="_blank"
              class="hover:text-brand-pink transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >View Website</a
            >
            <a
              href="/products"
              target="_blank"
              class="hover:text-brand-pink transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >View Products</a
            >
            <span class="text-gray-400 text-sm"
              >Welcome, <span class="text-brand-pink font-medium"
                >{adminUser}</span
              ></span
            >
            <button
              on:click={handleLogout}
              class="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            >
              Logout
            </button>
          {:else}
            <!-- Public Menu -->
            <a
              href="/products"
              class="hover:text-brand-pink transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >Products</a
            >
            <a
              href="/#products"
              class="hover:text-brand-pink transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >About</a
            >
            <a
              href="/#community"
              class="hover:text-brand-pink transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >Community</a
            >
            <a
              href="/#subscribe"
              class="bg-white text-black hover:bg-brand-pink hover:text-white transition-all px-5 py-2 rounded-full font-bold text-sm"
            >
              Get Started
            </a>
          {/if}
        </div>
      </div>

      <!-- Mobile Menu Button -->
      <div class="-mr-2 flex md:hidden">
        <button
          type="button"
          on:click={toggleMobileMenu}
          aria-label="Toggle menu"
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
        >
          <svg
            class="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile Menu -->
  {#if mobileMenuOpen}
    <div class="md:hidden bg-brand-card border-b border-white/10">
      <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {#if isAdmin}
          <a
            href="/"
            target="_blank"
            class="block hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium"
            >View Website</a
          >
          <a
            href="/products"
            target="_blank"
            class="block hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium"
            >View Products</a
          >
          <button
            on:click={handleLogout}
            class="block text-red-400 font-bold px-3 py-2 rounded-md text-base w-full text-left cursor-pointer"
            >Logout</button
          >
        {:else}
          <a
            href="/products"
            class="block hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium"
            >Products</a
          >
          <a
            href="/#products"
            class="block hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium"
            >About</a
          >
          <a
            href="/#community"
            class="block hover:text-brand-pink px-3 py-2 rounded-md text-base font-medium"
            >Community</a
          >
          <a
            href="/#subscribe"
            class="block text-brand-pink font-bold px-3 py-2 rounded-md text-base"
            >Get Started</a
          >
        {/if}
      </div>
    </div>
  {/if}
</nav>
