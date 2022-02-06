<template>
  <div id="footer">
    <div class="footer__cover" />

    <div class="footer__content">
      <div>
        <b-link
          href="https://github.com/brofrain/vue3-currency-converter/blob/main/LICENSE"
        >
          MIT License
        </b-link>
      </div>

      <div>
        © 2022 Copyright:

        <b-link href="https://github.com/brofrain/"> Kajetan Welc </b-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#footer {
  position: relative;

  .footer__cover {
    @include base__cover;
    background: $base__color--secondary;
    opacity: 0.9;
  }

  @supports ((backdrop-filter: none) or (-webkit-backdrop-filter: none)) {
    $blur: blur(5px);
    backdrop-filter: $blur;
    -webkit-backdrop-filter: $blur;

    .footer__cover {
      opacity: 0.75;
    }
  }

  .footer__content {
    position: relative;
    text-align: center;
    padding: 0.7rem 0;
    color: $base__color--text;
    white-space: nowrap;

    @media (min-width: 1500px) {
      padding: 0.9rem 0;
    }
  }
}
</style>
