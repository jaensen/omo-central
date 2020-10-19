<script lang="ts">
    import page from "page";
    import { actionRepository } from "./actions/actionRepository";
    import {Agent} from "./stores/agent";

    import Login from "./components/Login.svelte";
    import Profile from "./components/Profile.svelte";
    import Wait from "./components/Wait.svelte";
    import {ExchangeMagicLoginCodeForJwt} from "./events/auth/exchangeMagicLinkCodeForJwt";

    let currentPage = null;

    function route(path: string, handler) {
        const handlerWrapper = (ctx) => {
            if (!Agent.me.getPublicData() && path !== "/sign-in/onetime/:code") {
                currentPage = Login;
            } else {
                handler(ctx);
            }
        };
        page(path, handlerWrapper);
    }

    route("/sign-in/onetime/:code", (ctx) => {
        // Display a spinner (should be displayed only for a short time, since the
        // tab should close itself when the code was exchanged for a JWT and the JWT
        // was written to the localStorage).
        currentPage = Wait;
        window.trigger(new ExchangeMagicLoginCodeForJwt(ctx.params.code));
    });

    // Define all routes
    route("/", () => {
        currentPage = Profile;
    });

    // Register the global event handlers
    window.shellEvents.observable.subscribe((event) => {
        if (!event.triggers) {
            return;
        }
        const foundAction = actionRepository[event.triggers];
        if (foundAction) {
            foundAction(event);
        }
    });

    // activate router
    page.start({
        hashbang: true,
    });
</script>
<svelte:component this={currentPage} />
