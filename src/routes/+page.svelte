<script lang="ts">
  import { onMount } from "svelte";

  // Import all components
  import ZodiacBackground from "$lib/components/ZodiacBackground.svelte";
  import Loading from "$lib/components/Loading.svelte";
  import Navbar from "$lib/components/Navbar.svelte";
  import Hero from "$lib/components/Hero.svelte";
  import Features from "$lib/components/Features.svelte";
  import CodePreview from "$lib/components/CodePreview.svelte";
  import Community from "$lib/components/Community.svelte";
  import CTA from "$lib/components/CTA.svelte";
  import Footer from "$lib/components/Footer.svelte";

  let isLoading = true;

  onMount(() => {
    // Show loading screen for 2.5 seconds
    setTimeout(() => {
      isLoading = false;

      // After loading, check if there's a hash in the URL and scroll to it
      setTimeout(() => {
        const hash = window.location.hash;
        if (hash) {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
      }, 100);
    }, 2500);
  });
</script>

<svelte:head>
  <title>FOXuse. | AI Agents & Web3 Products</title>
  <meta
    name="description"
    content="FOXuse is a pioneering startup creating cutting-edge AI Agent and Web3 products. Building the future of autonomous solutions."
  />
</svelte:head>

{#if isLoading}
  <Loading />
{:else}
  <div
    class="bg-brand-dark text-white font-sans overflow-x-hidden transition-opacity duration-500 relative"
  >
    <!-- Zodiac constellation background -->
    <ZodiacBackground />

    <!-- Extended pink/purple gradient blobs -->
    <div class="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        class="absolute -top-40 -left-40 w-[600px] h-[1500px] bg-brand-pink opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
      ></div>
      <div
        class="absolute -top-40 -right-40 w-[600px] h-[1500px] bg-purple-600 opacity-[0.07] rounded-full mix-blend-multiply filter blur-[150px]"
      ></div>
    </div>

    <Navbar />

    <main class="relative z-10">
      <Hero />
      <Features />
      <CodePreview />
      <Community />
      <CTA />
    </main>

    <Footer />
  </div>
{/if}
