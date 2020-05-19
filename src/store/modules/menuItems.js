const menuItems = {
  state: {
    menuItem: '',
    headMenu: ''
  },

  mutations: {
    SET_MENUITEM: (state, menuItem) => {
      state.menuItem = menuItem
    },
    SET_HEADERMENU: (state, headMenu) => {
      state.headMenu = headMenu
    }
  }
}

export default menuItems
