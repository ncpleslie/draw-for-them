# Draw for them

Draw For Them is an ephemeral image sharing and drawing application that allows users to share their creations with other users. Built with NextJS, this application has real-time updates when users share images, add new friends, delete friends, update your profile, and view previous images sent to each other.

## How to run

Head on over to https://draw-for-them-production.up.railway.app/

Alternatively, clone this repo, create a `.env` in the root of the application that is the same as the `.env.example` file.

- Add a `NEXTAUTH_SECRET`
- Add a email server to the `EMAIL_SERVER` and `EMAIL_FROM` fields. You can authorize smtp on a gmail account for testing purposes
- Update the `STORAGE_*` values. This application is using Firebase for storage at this stage
