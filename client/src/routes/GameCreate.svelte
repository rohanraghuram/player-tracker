<script>
  import { PlayerStore } from './stores.js';

  // The player ID associated with the game
  export let playerId;

  // The opposition team
  let team = '';
  let minutes = '';
  let goals = '';
  let assists = '';

  const postGame = async (event) => {
    event.preventDefault();

    const res = await fetch(`http://localhost:4001/players/${playerId}/games`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ team, minutes, goals, assists }),
    });

    const data = await res.json();

    PlayerStore.update((players) => {
      const player = players[playerId];
      player.games = data;
      return players;
    });

    team = '';
    minutes = '';
    goals = '';
    assists = '';
  };
</script>

<div>
  <form on:submit={postGame}>
    <h3> Log Game </h3>
    <div class="form-group">
      <input bind:value={team} class="form-control" placeholder="Opposition Team" />
    </div>
    <div class="form-group">
      <input bind:value={minutes} type = "number" class="form-control" placeholder="Minutes" />
    </div>
    <div class="form-group">
      <input bind:value={goals} type = "number" class="form-control" placeholder="Goals" />
    </div>
    <div class="form-group">
      <input bind:value={assists} type = "number" class="form-control" placeholder="Assists" />
    </div>
    <button class="btn btn-primary">Add Game</button>
  </form>
</div>


<style>
  .form-group {
    display: inline-block;
    margin-right: 25px;
  }

  h3{
    font-size: 1rem;
  }

</style>