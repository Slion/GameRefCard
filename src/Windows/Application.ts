import {
  OWGames,
  OWGameListener,
  OWWindow
} from '@overwolf/overwolf-api-ts';
import { WindowName } from '../WindowName';

import RunningGameInfo = overwolf.games.RunningGameInfo;
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent;

/**
 * 
 */
class Application {
    private _gameListener: OWGameListener;
    private iWindowJoyMap: OWWindow = null;
    private iWindowMW5: OWWindow = null;

  constructor() {
      // Populating the background controller's window dictionary
      this.iWindowJoyMap = new OWWindow(WindowName.JoyMap);
      this.iWindowMW5 = new OWWindow(WindowName.MW5);

    // When a supported game game is started or is ended, toggle the app's windows
    this._gameListener = new OWGameListener({
      onGameStarted: this.toggleWindows.bind(this),
      onGameEnded: this.toggleWindows.bind(this)
    });

    overwolf.extensions.onAppLaunchTriggered.addListener(
      e => this.onAppLaunchTriggered(e)
      );


      // Make sure when our last window is closed that we close this application too
      overwolf.windows.onStateChanged.addListener( () => {
          overwolf.windows.getOpenWindows(windows => {
              // Are we the last window?
              if (Object.keys(windows).length <= 1) {
                  // We are the last window, just close the app then
                  window.close();
              }
          });
      });

      this.run();
  }

    


  // When running the app, start listening to games' status and decide which window should
  // be launched first, based on whether a supported game is currently running
  public async run() {
    this._gameListener.start();

    //const currWindowName = (await this.isSupportedGameRunning())
    //  ? kWindowNames.inGame
    //  : kWindowNames.desktop;

      this.iWindowMW5.restore();
  }

  private async onAppLaunchTriggered(e: AppLaunchTriggeredEvent) {
    console.log('onAppLaunchTriggered():', e);

    if (!e || e.origin.includes('gamelaunchevent')) {
      return;
    }

    //if (await this.isSupportedGameRunning()) {
    //  this._windows[kWindowNames.desktop].close();
    //  this._windows[kWindowNames.inGame].restore();
    //} else {
    //  this._windows[kWindowNames.desktop].restore();
    //  this._windows[kWindowNames.inGame].close();
    //}
  }

  private toggleWindows(info: RunningGameInfo) {
    if (!info || !this.isSupportedGame(info)) {
      return;
    }

  //  if (info.isRunning) {
  //    this._windows[kWindowNames.desktop].close();
  //    this._windows[kWindowNames.inGame].restore();
  //  } else {
  //    this._windows[kWindowNames.desktop].restore();
  //    this._windows[kWindowNames.inGame].close();
  //  }
  }

  private async isSupportedGameRunning(): Promise<boolean> {
    const info = await OWGames.getRunningGameInfo();

    return info && info.isRunning && this.isSupportedGame(info);
  }

  // Identify whether the RunningGameInfo object we have references a supported game
    private isSupportedGame(info: RunningGameInfo): boolean {
        return false;
    /*return kGameClassIds.includes(info.classId);*/
  }
}

new Application();
