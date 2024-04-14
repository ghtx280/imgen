<script lang="ts">
    import { slide } from 'svelte/transition';
    import icon from '$lib/icon';
    import { onMount } from 'svelte';

    let className = '';
    export let options: ({ value: string; class?: string; disabled?: boolean; hidden?: boolean } | string)[];
    export let selected: number = 0;
    export let value: string;
    export let width = 0;
    export { className as class };

    // console.log(value);

    const formatOptions = options.map((e) => (typeof e === 'string' ? { value: e } : e));

    let sel = formatOptions[selected];
    let hidden = true;

    formatOptions.forEach((e, i) => {
        if (e.value == value) {
            selected = i;
            sel = e;
        }
    });
</script>

<aside class="b-1 max-w-200 rel *:pointer {className} w-{width || ''}">
    <button flex="20 space" class="p-8 w-full" on:click={() => (hidden = !hidden)}>
        <p class="ui-select-title">
            {sel.value || '-'}
        </p>
        {@html icon.chevronDown(16)}
    </button>

    {#if !hidden}
        <div
            class="ui-select-options py-3 abs z-9 max-h-180 w-full bg-#111 b-1 over-hidden+auto"
            transition:slide={{ duration: 200 }}
            flex="col">
            {#each formatOptions as e, i}
                {#if !e.hidden}
                    <button
                        class="ui-select-option p-5+8 h:bg-#222 ta-left {e.class || ''} {e.disabled ? 'op-50!' : ''}"
                        on:click={() => {
                            selected = i;
                            sel = e;
                            hidden = true;
                            value = sel.value;
                        }}>
                        {e.value}
                    </button>
                {/if}
            {/each}
        </div>
    {/if}
</aside>
