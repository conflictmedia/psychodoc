# [Drugucopia](https://conflictmedia.github.io/drugucopia)

Recreational substance information repository and locally stored dose logger

## Features

- 243 different substances from PsychonautWiki (eventually we will improve this data hopefully as PW is lacking some information on certain substances)
- Comprehensive effects of substances. 
- Dosing and Duration info for multiple routes of administration
- Dose logger with graphs that stores all the information in localStorage on your own browser
- Export to CSV to backup or migrate your dose history
- Mood, Setting, Additional notes for entries
- Log any substance not just the ones in the repo
- Sync via Firestore secret room and password, so you can sync to multiple devices. E2E encrypted & hashed room names.

## Wrong info or want to supply data for the repo?

Please create an issue using one of the templates with as much info as you have for the substance you want or with corrected information for an existing substance!

### Know what you're doing?

Fork the repo and submit PRs with entries/changes! All substance information is stored in: `src/lib/substances/[category].ts`
  

## TODO:


- [x] Actually test the webpage on mobile (should work?)
- [ ] Tweak the page on mobile a metric fuckton
- [ ] Import CSV so you can transfer from mobile/other devices
- [x] Explore options for more seamless mobile-><-desktop cohesion
- [ ] Populate repository entries with a lot more data like effects and pharmacology/pharmocokinetics w/ sources
- [ ] Implement locally stored custom user added drugs to bridge gap until they are added to into the repository (maybe)
- [ ] Add expieriences section to substances with links to expierience reports
- [ ] Add Harm Reduction resource page
- [ ] Add recommended supplements section to substance info (?maybe)
- [ ] Add positive combination section/page
- [ ] Add ability to edit dose entries
- [ ] Add default assumed routes for certain substances (like weed)
- [ ] Create more templates and make them compatabile with automation so new substances or info changes can be added easily
- [ ] Release the Epstein files
- [ ] Layout tweaks (hide graphs, hide stats, favorite substances)
- [ ] Explore adding a ranking system of some sort (votes, frequency of use, something)

## DEMOS
[drugucopia sync 3 client demo.webm](https://github.com/user-attachments/assets/f89be079-5f80-45f8-ac77-da11e97fe7f2)
