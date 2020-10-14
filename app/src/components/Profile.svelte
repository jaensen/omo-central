<script>
  import {Agent} from "../stores/agent";

  let publicData = {};
  let privateData = {};

  async function init() {
    publicData = await Agent.me.getPublicData();
    privateData = await Agent.me.getPrivateData();
  }

  function addToPrivateData() {
    let i = Object.keys(privateData).length;
    privateData[(i++).toString()] = {
      hello: "world " + i
    };
    Agent.me.setPrivateData(privateData);
  }

  init();
</script>

<div class="bg-white relative shadow text-gray-800 overflow-hidden">
  Public data:<br/>
  <pre>
    {JSON.stringify(publicData,undefined,3)}
    </pre><br/>
  <button on:click={() => addToPrivateData()}>Add</button>
  Private data:<br/>
  <pre style="overflow: scroll; height:200px;">
    {JSON.stringify(privateData,undefined,3)}
    </pre><br/>
</div>
