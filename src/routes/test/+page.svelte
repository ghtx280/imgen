<script lang="ts">

    function fff(node: HTMLCanvasElement) {

       const ctx = node.getContext("2d")

       if (ctx) {

        ctx.clearRect(0, 0, 300, 300)

        ctx.fillStyle = "gray"
        ctx.fillRect(0, 0, 300, 300)

        ctx.fillStyle = "black"
        ctx.font = "500 24px sans-serif"
        ctx.fillText("fdfdd", 50, 50)
       }
        
    }

</script>

<canvas use:fff width="300" height="300"></canvas>