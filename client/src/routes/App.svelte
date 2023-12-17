<script>
  import PlayerCreate from './PlayerCreate.svelte';
  import PlayerList from './PlayerList.svelte';
</script>

<div class="container">
  <h1>Create Player</h1>
  <PlayerCreate />

  <hr />
  <h1>Players</h1>
  <PlayerList />
</div>

<style>
  :global(body) {
      background-color: navy;
      color: yellow;
  }
</style>