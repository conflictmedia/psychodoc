# [Drugucopia](https://conflictmedia.github.io/drugucopia)

Recreational substance information repository and locally stored dose logger

## Features

- 278 different substances from PsychonautWiki (eventually we will improve this data hopefully as PW is lacking some information on certain substances)
- Comprehensive effects of substances. 
- Dosing and Duration info for multiple routes of administration
- Dose logger with graphs that stores all the information in localStorage on your own browser
- Export/Import to CSV/JSON to backup or migrate your dose history
- Import from Psylo .json, import from Psychonautwiki Journal coming soon
- Mood, Setting, Additional notes for entries
- Log any substance not just the ones in the repo
- Sync via Firestore secret room and password, so you can sync to multiple devices. E2E encrypted & hashed room names.


## Wrong info or want to supply data for the repo?

Please create an issue using one of the templates with as much info as you have for the substance you want or with corrected information for an existing substance!

### Know what you're doing?

Fork the repo and submit PRs with entries/changes! All substance information is stored in: `src/lib/substances/[category].ts`
  

## TODO:

see Issues but right now the biggest problem is missing duration and dose data for some substances. Working on adding user expierence derived data that Tripsit has collected.


## DEMOS
[demo_of_site-04-04-2026.webm](https://github.com/user-attachments/assets/052c6992-1535-46cd-bd94-86ad96f77859)
