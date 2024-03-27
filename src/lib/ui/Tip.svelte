<script lang="ts">
    import { browser } from '$app/environment';

    let tip = true;

    $: if (browser) tip = localStorage.getItem('imgenx-tip-showed') == 'yes';
</script>

{#if !tip}
    <div class="fullscreen bg-black/60" flex="center">
        <div class="bg-f p-40 r-20 b-1 max-w-600" flex="20 col">
            <h4>Як користуватися? / How to use?</h4>
            <p></p>
            <p>
                Ukr (🇺🇦): <br />
                Натисніть кнопку "Add Img", щоб додати зображення, або "Add Txt", щоб додати текст. Коли ви створите елемент,
                він з'явиться у вигляді списку, натисніть на нього, щоб відредагувати. Ви можете перетягнути мишею W H X
                Y, щоб змінити розмір
            </p>
            <p>
                Eng (🇺🇸): <br />
                Click the "Add Img" button to add an image, or "Add Txt" to add text. When you create an item, it will appear
                as a list, click on it to edit it. You can drag a mouse W H X Y to resize
            </p>

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
