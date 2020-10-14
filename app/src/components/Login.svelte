<script lang="ts">
  import {RequestMagicLoginLink} from "../trigger/auth/requestMagicLoginLink";

  let emailAddress = "";
  let status = "new";
</script>

<div class="bg-transparent flex">
  <div class="flex-col flex ml-auto mr-auto items-center w-full lg:w-2/3 md:w-3/5">
    <form action="" class="mt-2 flex flex-col lg:w-1/2 w-8/12">
      <div
              class="flex flex-wrap items-stretch w-full relative h-18 bg-white
        items-center rounded-t pr-10">
        <div class="flex -mr-px justify-center w-15 p-4">
        <span
                class="flex items-center leading-normal bg-white border-0 rounded
            rounded-r-none text-2xl text-gray-600">
          <i class="fas fa-user-circle"/>
        </span>
        </div>
        <input
                type="email"
                class="text-gray-600 flex-shrink flex-grow flex-auto leading-normal
                  w-px flex-1 border-0 h-10 border-grey-light rounded rounded-l-none
                  px-3 self-center relative font-roboto text-xl outline-none"
                bind:value={emailAddress}
                placeholder="Email"/>
      </div>
      <a on:click={() => window.trigger(new RequestMagicLoginLink(emailAddress))}
         class="rounded-b bg-secondary py-4 text-center px-17 md:px-12 md:py-4
        text-white leading-tight text-2xl font-bold md:text-base font-title
        uppercase">
        Send Login Mail
      </a>
    </form>
  </div>
</div>
