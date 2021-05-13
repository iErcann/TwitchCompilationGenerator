import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import colors from "vuetify/lib/util/colors"

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        themes: {
          light: {
            primary: colors.deepPurple,
            secondary: colors.grey.darken1,
            accent: colors.purple,
            error: colors.red.accent3,
          },
          dark: {
              primary:colors.grey.darken4,
              secondary: colors.blue,
              accent: colors.blue.darken3,
              error: colors.red.accent3,

          },
        },
      },
});
