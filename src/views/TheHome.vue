<template>
  <div id="home">
    <div class="home__container">
      <b-content-cover />

      <div class="home__container__content">
        <div>
          Simple currency converter powered by
          <div>
            <b-link href="https://github.com/fawazahmed0/currency-api">
              Fawaz Ahmed's Currency Rates API
            </b-link>
          </div>
        </div>

        <div class="home__nav">
          <b-btn @click="$router.push({ name: 'Converter' })">
            Converter
          </b-btn>

          <b-btn @click="$router.push({ name: 'Table' })"> Rates Table </b-btn>
        </div>

        <div class="home__source">
          <div>Source code:</div>

          <a
            href="https://github.com/brofrain/vue3-currency-converter/"
            target="_blank"
          >
            <b-outline-icon-btn type="brands" icon="github-alt" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#home {
  display: flex;
  justify-content: center;

  .home__container {
    max-width: 100%;
    position: relative;

    .home__container__content {
      --py: 15px;
      --px: 10px;
      @media (min-width: 1000px) {
        --py: 25px;
        --px: 20px;
      }
      $py: var(--py);
      $px: var(--px);

      width: 27rem;
      max-width: calc(100% - 2 * $px);
      padding: $py $px;
      position: relative;

      display: flex;
      flex-direction: column;
      row-gap: 0.5rem;

      color: $base__color--text;
      text-align: center;
      user-select: none;

      .home__nav {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        column-gap: 1.5rem;
        row-gap: inherit;
      }

      .home__source {
        display: flex;
        justify-content: center;
        align-items: center;
        column-gap: 10px;

        a {
          text-decoration: none;
          border-radius: 9999px;
        }
      }
    }
  }
}
</style>
