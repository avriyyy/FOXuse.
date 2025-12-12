<div class="fixed inset-0 z-[100] bg-black flex justify-center items-center">
  <div
    class="loader-container relative w-[120px] h-[120px] flex justify-center items-center"
  >
    <!-- Three ripple elements - water drop effect only -->
    <div class="ripple"></div>
    <div class="ripple" style="animation-delay: 0.8s;"></div>
    <div class="ripple" style="animation-delay: 1.6s;"></div>
  </div>
</div>

<style>
  .ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-radius: 50%;
    opacity: 0;
    border: 2px solid #ff2a86;
    box-shadow:
      0 0 15px #ff2a86,
      inset 0 0 10px #ff2a86;
    animation: ripple-anim 2.5s linear infinite;
  }

  @keyframes ripple-anim {
    0% {
      width: 0px;
      height: 0px;
      opacity: 0.8;
      border-width: 4px;
    }
    100% {
      width: 250px;
      height: 250px;
      opacity: 0;
      border-width: 0px;
    }
  }
</style>
