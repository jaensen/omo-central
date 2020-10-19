<script lang="ts">
  import {RequestMagicLoginLink} from "../events/auth/requestMagicLoginLink";

  let emailAddress = "";
</script>

<div>
  <div>
    <form action="">
      <div>
        <input type="email" bind:value={emailAddress}
                placeholder="Email"/>
      </div>
      <a on:click={() => window.trigger(new RequestMagicLoginLink(emailAddress))}>
        Send Login Mail
      </a>
    </form>
  </div>
</div>
