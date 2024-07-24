# Photosync Electron

Backup images and videos from PC to Google Photos without using Google's clunky Drive Client 

This is a rework of my old project [PhotoSync](https://www.github.com/letiendat198/Photosync), which was written in Rust and lack a GUI. It's also quite inconvenient. It has bugged me for long enough so now here we are.

All features are functional by now (though things may fail because I haven't done any errors handling)

## Features
- Backup images and videos to Google Photos
- Allow choosing which folder to backup
- Convenient ON/OFF toggle in system tray
- Custom backup notification

## TODO
<details>
    <summary>Already done</summary>
    
    - Done setup screen => OAuth works
    - Add folder to watch list works
    - File detection and upload works
    - Fix removing folders
    - Implement upload history and status
    - Implement a early state working custom notification
    - Implement custom notification:
        - Redesign custom title bar
        - Not show notification when main app is open 
        - An auto close mechanism
    - ~~Save upload history to disk and load it on startup~~ (Not a good idea)
    - Implement tray toggle:
        - Implemented open main window
        - Implemented quitting the app entirely
        - ON/OFF toggle to turn of sync
    - Save and reload watch list on startup
    - Detect when setup is needed

</details>

- Handle possible errors when doing OAuth and API
- Handle possible errors with upload status

## Known Issues
<details>
    <summary>Fixed</summary>
    
    - First notification entry will be invisible? (Fixed by route to notification before hiding)

</details>

- Will add when found

## License

GPLv3 as always