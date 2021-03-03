import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true ,
        themes: {
          light: {
            primary: colors.purple,
            secondary: colors.grey.darken1,
            accent: colors.shades.black,
            error: colors.red.accent3,
          },
          dark: {
              primary:colors.grey.darken4,
              secondary: colors.grey.darken1,
              accent: colors.blue.darken3,
              error: colors.red.accent3,

          },
        },
      },
});
