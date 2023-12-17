<script>
  import { PlayerStore } from './stores.js';
  let name = '';
  let club = '';
  let nation = '';
  let age = '';

  const makePlayer = async (event) => {
    const res = await fetch('http://localhost:4000/players', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, club, nation, age }),
    });

    const data = await res.json();
    name = '';
    club = '';
    nation = '';
    age = '';
    console.log(`Client: ${JSON.stringify(data)}`);

    PlayerStore.update((players) => {
      return { ...players, [data.id]: data };
    });
  };
</script>

<div>
  <form on:submit={makePlayer}>
    <div class="form-group">
      <h3>Name: {name}</h3>
      <input bind:value={name} class="form-control" />
    </div>
    <div class="form-group">
      <h3>Club: {club}</h3>
      <input bind:value={club} class="form-control" />
    </div>
    <div class="form-group">
      <h3>Nationality: {nation}</h3>
      <input bind:value={nation} class="form-control" />
    </div>
    <div class="form-group">
      <h3>Age: {age}</h3>
      <input bind:value={age} type = "number" class="form-control" />
    </div>
    <button class="btn btn-primary">Submit</button>
  </form>
</div>


<style>
  .form-group {
    display: inline-block;
    margin-right: 25px;
  }

  h3 {
    margin-bottom: 5px;
  }
</style>