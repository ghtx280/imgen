<script lang="ts">
    import { browser } from '$app/environment';

    let tip = true;

    $: if (browser) tip = localStorage.getItem('imgenx-tip-showed') == 'yes';
</script>

{#if !tip}
    <div class="fullscreen bg-black/60 z-999" flex="center">
        <div class="bg-f p-40 r-20 b-1 max-w-600" flex="20 col center">
            <h4>IMGENX</h4>
            <p text="center">A powerful tool for creating dynamic images based on URLs</p>

            <a
                href="https://github.com/ghtx280/imgen/blob/master/README.md"
                target="_blank"
                class="r-10 p-20+30 bg-$green-3"
                text="18 white bold">
                Learn more
            </a>

            <p text="center">Read the documentation on how to use it</p>

            <div flex="20 ai-c">
                <button
                    class="btn bg-0 w-fit px-40 c-f"
                    on:click={() => {
                        tip = true;
                    }}>
                    Close
                </button>

                <button
                    class="btn bg-0 w-fit px-40 c-f"
                    on:click={() => {
                        tip = true;
                        localStorage.setItem('imgenx-tip-showed', 'yes');
                    }}>
                    Don't show again
                </button>
            </div>
        </div>
    </div>
{/if}
