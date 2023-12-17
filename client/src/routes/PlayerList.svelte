<script>
  import { onMount } from 'svelte';
  import { PlayerStore } from './stores.js';
  import GameCreate from './GameCreate.svelte';
  import GameList from './GameList.svelte';
  let players = {};

  onMount(async () => {
    const res = await fetch('http://localhost:4002/players');
    const data = await res.json();
    PlayerStore.set(data);
  });

  PlayerStore.subscribe((_players) => {
    console.log(`PlayerList: ${JSON.stringify(_players)}`);
    players = _players;
  });
</script>

<div class="d-flex flex-row flex-wrap justify-content-between">
  {#each Object.entries(players) as [_, player] (player.id)}
    <div class="card player">
      <div class="card-body">
        <div class = "details">
          <div class="info-column">
            <h3>{player.name}</h3>
            <p>Club: {player.club}</p>
            {#if player.nation.toLowerCase().includes('england')}
              <p class="england-flag">Nationality: {player.nation}</p>
            {/if}
            {#if !player.nation.toLowerCase().includes('england')}
              <p>Nationality: {player.nation}</p>
            {/if}
            {#if player.age < 19 }
              <p class="youth">Age: {player.age}</p>
            {/if}
            {#if player.age > 18 && player.age <= 30 }
              <p class="pro">Age: {player.age}</p>
            {/if}
            {#if player.age > 30 }
              <p class="old">Age: {player.age}</p>
            {/if}
          </div>
          <button class="btn btn-primary">Delete</button>
          <div class="stats-column">
            {#if player.minutes}
              <p>Minutes: {player.minutes}</p>
            {/if}

            {#if player.goals}
              <p>Goals: {player.goals}</p>
            {/if}

            {#if player.assists}
              <p>Assists: {player.assists}</p>
            {/if}
          </div>
        </div>
        <div class="game-create-column">
          <GameList games={player.games} />
          <GameCreate playerId={player.id} />
        </div>
      </div>
    </div>
  {/each}
</div>

<style>
  .player {
    margin-bottom: 20px;
    width: 30%;
  }

  .card-body {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .details {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .info-column {
    flex: 1 0 60%;
  }

  .stats-column {
    flex: 1 0 40%;
    margin-top: 5px;
  }

  .game-create-column {
    flex: 1 0 100%; 
    margin-top: 5px; 
  }

  .england-flag {
    color: indigo;
  }

  .youth {
    color: green;
  }

  .pro {
    color: goldenrod;
  }

  .old {
    color: red;
  }


</style>
