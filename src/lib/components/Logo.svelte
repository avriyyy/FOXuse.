<script lang="ts">
  export let size: "sm" | "md" | "lg" = "md";
  export let showText: boolean = true;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-4xl",
  };
</script>

<div class="flex items-center gap-3 select-none">
  <!-- FOXuse Logo SVG - slightly larger -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    class="{sizeClasses[size]} text-brand-pink"
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

  {#if showText}
    <span
      class="font-logo {textSizeClasses[
        size
      ]} italic font-normal tracking-tight text-white mt-1">FOXuse.</span
    >
  {/if}
</div>
