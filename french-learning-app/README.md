# Bonjour AI — French Learning App

An interactive French learning app built around six AI-powered study modes, plus a
**Real Conversation Mode** where you talk to a 3D AI avatar tutor that listens, speaks
French back to you, and corrects your mistakes in real time.

The app is built with **Expo / React Native** so a single codebase ships to both the
**Apple App Store** and **Google Play Store**.

## The six features

| # | Feature | What it does |
|---|---------|---------------|
| 1 | **Daily Lesson Creator** | Generates a 30-minute lesson (grammar / speaking / listening) with examples, exercises and a short quiz. |
| 2 | **Instant Flashcards** | Turns any word list into a swipeable flashcard deck with example sentences and memorization tips. |
| 3 | **Real Conversation Mode** | The flagship feature — a 3D AI avatar plays a native French speaker, has a spoken conversation with you on a topic you choose, and corrects your mistakes as you go. |
| 4 | **Grammar Decoder** | Plain-language explanation of any French grammar rule, plus the 3 most common mistakes students make. |
| 5 | **Progress Evaluator** | A 10-question quiz on what you've studied. Answers are hidden server-side and only revealed after you submit. |
| 6 | **Immersion Engine** | Translates any pasted text into French, then quizzes you on its vocabulary, phrases and comprehension. |

## Architecture

```
french-learning-app/
├── server/     Node/Express backend. Proxies the Claude API so your key
│               never ships inside the mobile app binary. One route per feature.
└── mobile/     Expo React Native app (expo-router). 4 tabs: Home, Learn
                (features 1,2,4,6), Conversation (feature 3, with the 3D avatar),
                Progress (feature 5).
```

Why a backend at all? Anthropic's API key must stay server-side — embedding it in a
mobile app means anyone can extract it from the binary and run up your bill. The
`server/` folder is a thin proxy with one endpoint per feature and basic rate limiting.

## Running it locally

### 1. Backend

```bash
cd server
cp .env.example .env      # then paste your Anthropic API key from console.anthropic.com
npm install
npm run dev                # http://localhost:8787
```

### 2. Mobile app

```bash
cd mobile
npm install
```

Edit `app.json` → `expo.extra.apiBaseUrl` to point at your backend (for local dev on
a physical phone, use your computer's LAN IP, e.g. `http://192.168.1.20:8787`, not
`localhost`).

```bash
npx expo start
```

Scan the QR code with **Expo Go** to try it immediately — every feature works except
the microphone (see below).

### 3. Give your avatar a face

Conversation Mode renders a real 3D avatar via [readyplayer.me](https://readyplayer.me/)
(free): create one in their web/app avatar creator, copy the `.glb` URL it gives you,
then paste it into **Home → AI avatar tutor** in the app (stored on-device). Until you
do, Conversation Mode shows a friendly placeholder instead of a 3D model — everything
else still works.

### 4. Voice input needs a real build, not Expo Go

Speech-to-text (`@react-native-voice/voice`) is a native module — Expo Go can't load
it. Conversation Mode automatically falls back to a text box so you can fully test the
avatar's replies, corrections, and voice *output* (text-to-speech) in Expo Go. To get
real microphone input, build a development client once:

```bash
cd mobile
npx expo install expo-dev-client
eas build --profile development --platform ios      # or android
```

Install that build on your phone/simulator and run `npx expo start --dev-client`
instead of Expo Go.

## Publishing to the App Store and Google Play

I can write and commit all the app code, but **actually publishing requires accounts,
credentials, and manual steps only you can complete** — an Apple ID/Google account
isn't something I can create or pay for on your behalf. Here's exactly what's left:

1. **Get developer accounts** (one-time setup you do yourself):
   - Apple Developer Program — $99/year, at developer.apple.com.
   - Google Play Console — $25 one-time, at play.google.com/console.

2. **Install the EAS CLI and log in:**
   ```bash
   npm install -g eas-cli
   eas login
   cd mobile
   eas build:configure   # links this project to your Expo/EAS account
   ```

3. **Build production binaries:**
   ```bash
   eas build --platform ios --profile production
   eas build --platform android --profile production
   ```
   EAS builds in the cloud and hands you a signed `.ipa`/`.aab` — no Xcode or Android
   Studio installation required.

4. **Submit to each store:**
   ```bash
   eas submit --platform ios
   eas submit --platform android
   ```
   You'll need, at minimum: an app icon (1024×1024), a few screenshots, a short and
   long description, a support URL, and a **privacy policy URL** (required because the
   app uses the microphone and sends text to an AI API — disclose that).

5. **Review time:** Apple typically reviews within 1–3 days; Google Play within a few
   hours to a couple of days for a new app's first submission.

Before submitting, also:
- App icon, splash screen, and adaptive icon in `mobile/assets/` are already designed
  (speech-bubble avatar mark, French tricolor accent) — swap them only if you want a
  different look. `mobile/assets/store/` has a ready-to-upload Play Store feature
  graphic (`feature-graphic.png`, 1024×500) and listing icon (`play-store-icon-512.png`).
- Change `ios.bundleIdentifier` / `android.package` in `app.json` from
  `com.moazkhan.bonjourai` to whatever reverse-DNS ID you want to own.
- Deploy `server/` somewhere reachable over HTTPS (Render, Railway, Fly.io, a VPS,
  etc.) and point `expo.extra.apiBaseUrl` at that URL before your production build —
  App Store/Play Store review devices can't reach `localhost`.

## How Real Conversation Mode works technically

1. You speak (native STT via `@react-native-voice/voice`) or type your message.
2. The transcript is sent to `POST /api/conversation` on the backend, which asks Claude
   to reply in character as a native French speaker and separately list any corrections
   to your last message.
3. The reply is spoken aloud in French (`expo-speech`, `fr-FR` voice).
4. While speaking, each word-boundary event nudges the avatar's mouth-open morph target
   (`Avatar3D.tsx`), giving lightweight lip-sync without needing phoneme-level viseme
   data (that would require a service like Rhubarb Lip Sync — a reasonable future
   upgrade, noted in code comments).
5. Corrections render in a dedicated card below the transcript so they don't interrupt
   the conversational flow.

## Known limitations / good next steps

- Lip-sync is word-boundary-driven, not phoneme-accurate. Swap in Rhubarb Lip Sync or
  a viseme API for frame-perfect mouth shapes.
- The quiz store (`server/src/quizStore.js`) is in-memory — fine for one server
  instance; move to Redis if you scale horizontally.
- No user accounts/auth yet — progress (streak, quiz history) is stored on-device with
  AsyncStorage. Add auth + a database if you want progress to sync across devices.
