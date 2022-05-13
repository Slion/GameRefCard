import {
  OWGames,
  OWGameListener,
  OWWindow
} from '@overwolf/overwolf-api-ts';
import { WindowName } from '../WindowName';

import RunningGameInfo = overwolf.games.RunningGameInfo;
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent;

// The background controller holds all of the app's background logic - hence its name. it has
// many possible use cases, for example sharing data between windows, or, in our case,
// managing which window is currently presented to the user. To that end, it holds a dictionary
// of the windows available in the app.
// Our background controller implements the Singleton design pattern, since only one
// instance of it should exist.
class BackgroundController {
    private _gameListener: OWGameListener;
    private iWindowJoyMap: OWWindow = null;

  constructor() {
      // Populating the background controller's window dictionary
      this.iWindowJoyMap = new OWWindow(WindowName.JoyMap);

    // When a a supported game game is started or is ended, toggle the app's windows
    this._gameListener = new OWGameListener({
      onGameStarted: this.toggleWindows.bind(this),
      onGameEnded: this.toggleWindows.bind(this)
    });

    overwolf.extensions.onAppLaunchTriggered.addListener(
      e => this.onAppLaunchTriggered(e)
      );

      this.run();
  }


  // When running the app, start listening to games' status and decide which window should
  // be launched first, based on whether a supported game is currently running
  public async run() {
    this._gameListener.start();

    //const currWindowName = (await this.isSupportedGameRunning())
    //  ? kWindowNames.inGame
    //  : kWindowNames.desktop;

      this.iWindowJoyMap.restore();
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

new BackgroundController();
