<script>
  export let games = [];

  // best performance of the player as measured as sum of goals and assists
  let bestGame;

  // function to find the best game
  function findBestGame() {
    bestGame = games.reduce((prev, current) => {
      return (current.goals + current.assists) > (prev.goals + prev.assists) ? current : prev;
    }, { goals: 0, assists: 0 }); // Initial value with 0 goals and assists
  }

  // Reactive statement that calls the function whenever games has a new addition
  $: if (games.length > 0) {
    findBestGame();
  }

</script>

<ul>
  {#if bestGame}
    <li>
      <heading>Best Performance:</heading><br>
      Team: {bestGame.team}, Minutes: {bestGame.minutes},
      Goals: {bestGame.goals}, Assists: {bestGame.assists}
    </li>
  {/if}
</ul>


<style>
  heading {
    font-weight: bold;
  }

</style>