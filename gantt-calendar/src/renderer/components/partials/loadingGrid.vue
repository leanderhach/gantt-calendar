<template>
    <div class="loading-cover">
        <div class="grid">
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
            <div class="square"></div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'loadingGrid',
};
</script>

<style lang="scss">
    .loading-cover {
        width:100%;
        height:100%;
        position: absolute;
        left:0;
        top:0;
        display:flex;
        justify-content:center;
        align-items:center;
        flex-direction: row;
        background-color:#FFFFFF;
    }
    .grid {
      display: flex;
      flex-wrap: wrap;
      width: 100px;
      height: 100px;
    }
    .square {
      box-sizing:border-box;
      background-color: #d5d7d9; 
      border:4px solid white;
      flex-basis: 33%;
    }

    .square:nth-child(1) {
      animation: breath 2s infinite;
    }

    .square:nth-child(5) {
      animation: breath 1.8s 0.2s infinite;
    }

    .square:nth-child(2), .square:nth-child(4) {
      animation: breath 1.75s 0.25s infinite;
    }

    .square:nth-child(9) {
      animation: breath 1.5s 0.5s infinite;
    }
    .square:nth-child(6), .square:nth-child(8) {
      animation: breath 1.45s 0.55s infinite;
    }
    .square:nth-child(3), .square:nth-child(7) {
      animation: breath 1.4s 0.6s infinite;
    }

    @keyframes breath {
      0% {
        background-color: #e2e3e4;
      }
      50% {
        background-color: #ff4757; 
      }
      100% {
        background-color: #e2e3e4;
      }
    }
</style>