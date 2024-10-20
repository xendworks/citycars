import { defineStore } from 'pinia';

export const useThemeStore = defineStore({
  id: 'boolean',
  state: () => ({
    isDarkTheme: false,
    primaryBgColor: '#7059DE',
    secondaryBgColor: '#5E45D3',
    currentComponentName: ref("DefaultFooter"),
    canClose: false,
    defaultScreenOne: true,
    defaultScreenTwo: true,
    defaultScreenThree: true,
    defaultScreenFour: true,
  }),
  actions: {
    setDarkTheme(value) {
      this.isDarkTheme = value;
    },
    setPrimaryBgColor(color) {
      this.primaryBgColor = color;
    },
    setSecondaryBgColor(color) {
      this.secondaryBgColor = color;
    },
    setCtaBgColor(color) {
      this.ctaBgColor = color;
    },
    updateComponentName(name){
        this.currentComponentName = name;
    },
    updateScreenStatus(screen){
      this[screen] = !this[screen];
    },
  },
});