# Photosync Electron (WIP)

Backup images and videos from PC to Google Photos without using Google's clunky Drive Client 

This is a rework of my old project [PhotoSync](https://www.github.com/letiendat198/Photosync), which was written in Rust and lack a GUI. It's also quite inconvenient. It has bugged me for long enough so now here we are.

## Features
- Backup images and videos to Google Photos
- Allow choosing which folder to backup
- Convenient ON/OFF toogle in system tray
- Custom backup notification (Maybe?) 

## TODO
<details>
    <summary>Already done</summary>
    
    - Done setup screen => OAuth works
    - Add folder to watch list works
    - File detection and upload works

</details>

- Fix removing folders
- Save and reload watch list on startup
- Handle possible errors when doing OAuth and API
- Implement upload history and status
- Implement custom notification
- Implement tray toggle

## Known Issues
- Will add when the dust has settled

## License

GPLv3 as always