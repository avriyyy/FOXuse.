<script lang="ts">
  const features = [
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>`,
      iconColor: "text-brand-pink",
      iconBg: "bg-brand-pink/10",
      iconHoverBg: "group-hover:bg-brand-pink",
      title: "AI Agent Products",
      description:
        "We develop autonomous AI agents that can perform complex tasks, analyze data, and make intelligent decisions on behalf of users across various domains.",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>`,
      iconColor: "text-purple-500",
      iconBg: "bg-purple-500/10",
      iconHoverBg: "group-hover:bg-purple-500",
      title: "Web3 Solutions",
      description:
        "Our Web3 products leverage blockchain technology to create decentralized, secure, and transparent solutions for the next generation of the internet.",
    },
    {
      icon: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>`,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/10",
      iconHoverBg: "group-hover:bg-blue-500",
      title: "Innovation First",
      description:
        "As a forward-thinking startup, FOXuse. is committed to pushing the boundaries of what's possible by merging AI intelligence with blockchain infrastructure.",
    },
  ];
</script>

<section id="products" class="py-20 bg-transparent relative">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
      <h2 class="text-3xl font-bold mb-4">
        What is <span class="font-logo text-brand-pink">FOXuse.</span>?
      </h2>
      <p class="text-gray-400 max-w-2xl mx-auto">
        FOXuse. is a startup leading the charge in AI Agent and Web3 product
        development, creating innovative solutions under one unified brand.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each features as feature}
        <div
          class="p-8 rounded-2xl bg-brand-card border border-white/5 hover:border-brand-pink/50 transition-all hover:-translate-y-2 group"
        >
          <div
            class="w-12 h-12 {feature.iconBg} rounded-lg flex items-center justify-center mb-6 {feature.iconHoverBg} transition-colors"
          >
            <svg
              class="w-6 h-6 {feature.iconColor} group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {@html feature.icon}
            </svg>
          </div>
          <h3 class="text-xl font-bold mb-3">{feature.title}</h3>
          <p class="text-gray-400 text-sm leading-relaxed">
            {feature.description}
          </p>
        </div>
      {/each}
    </div>
  </div>
</section>
