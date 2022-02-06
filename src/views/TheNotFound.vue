<template>
  <div id="notFound">
    <div class="not-found__container">
      <b-content-cover />

      <div class="not-found__text">The page was not found</div>

      <div class="not-found__nav">
        <b-btn @click="$router.push({ name: 'Home' })"> Home </b-btn>

        <b-btn @click="$router.push({ name: 'Converter' })"> Converter </b-btn>

        <b-btn @click="$router.push({ name: 'Table' })"> Rates Table </b-btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#notFound {
  display: flex;
  justify-content: center;

  .not-found__container {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
    max-width: 100%;
    padding: 1rem;
    position: relative;

    .not-found__text {
      color: $base__color--text;
      font-size: 2rem;
      text-align: center;
      position: relative;
    }

    .not-found__nav {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      row-gap: 0.5rem;
    }

    @media (min-width: 600px) {
      padding: 1.5rem 2rem;

      .not-found__nav {
        flex-direction: row;
        justify-content: center;
        column-gap: 1.5rem;
      }
    }
  }
}
</style>
