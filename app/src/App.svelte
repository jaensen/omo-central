<script lang="ts">
    import page from "page";
    import {
        actionRepository,
    } from "./actions/actionRepository";
    import Login from "./components/Login.svelte";

    page("/", () => {
    });

    window.shellEvents.observable.subscribe((event) => {
        // TODO: This is the same code as in GridCompositor.svelte
        if (event.triggers) {
            // This event should trigger some action. Find it in the action repo and execute it.
            const foundAction = actionRepository[event.triggers];
            if (foundAction) {
                foundAction(event);
            }
        }
    });

    // activate router
    page.start({
        hashbang: true,
    });
</script>
<Login />
