class WindowManager {
  static mainWindow = null;

  static setMainWindow(window) {
    WindowManager.mainWindow = window;
  }

  static getMainWindow() {
    return WindowManager.mainWindow;
  }
}

export default WindowManager;
