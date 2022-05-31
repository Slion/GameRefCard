import {
    OWGames,
    OWGameListener,
    OWWindow
} from '@overwolf/overwolf-api-ts';
import { AppWindow } from '../AppWindow';
import { Settings } from '../Settings';
import { WindowName } from '../WindowName';

import RunningGameInfo = overwolf.games.RunningGameInfo;
import AppLaunchTriggeredEvent = overwolf.extensions.AppLaunchTriggeredEvent;

/**
 * 
 */
class Application {
    private _gameListener: OWGameListener;
    iAppWindow: AppWindow;

    constructor() {

        this.iAppWindow = <AppWindow>overwolf.windows.getMainWindow();
        // Populating the background controller's window dictionary
        this.iAppWindow.iWindowJoyMap = new OWWindow(WindowName.VirpilOne);
        this.iAppWindow.iWindowMW5 = new OWWindow(WindowName.VirpilTwo);
        this.iAppWindow.iWindowSettings = new OWWindow(WindowName.Settings);

        // When a supported game game is started or is ended, toggle the app's windows
        this._gameListener = new OWGameListener({
            onGameStarted: this.toggleWindows.bind(this),
            onGameEnded: this.toggleWindows.bind(this)
        });

        overwolf.extensions.onAppLaunchTriggered.addListener(
            e => this.onAppLaunchTriggered(e)
        );

        // When our last window is closed make sure that we close this application too
        overwolf.windows.onStateChanged.addListener(() => {
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

        // Load our settings
        this.iAppWindow.iSettings = await Settings.Load();

        // Show our settings window
        this.iAppWindow.iWindowSettings.restore();
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
