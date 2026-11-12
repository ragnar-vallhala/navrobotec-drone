/* What the browser remembers about the X427 waitlist.
 *
 * `navrobotec.waitlisted` is in localStorage and set once someone has joined
 * (or been told they already had), so the prompt never returns for them. Whether
 * the prompt has already appeared is only in memory (see `popupShown`): it
 * shows once per page load.
 *
 * Every access is wrapped: storage throws in some private modes and with site
 * data blocked, and the site has to work the same without it. */

export const WAITLISTED_KEY = "navrobotec.waitlisted";

export function markWaitlisted(): void {
  try {
    window.localStorage.setItem(WAITLISTED_KEY, "1");
  } catch {
    /* Nothing to do: the prompt may show again, which is harmless. */
  }
  /* The top banner is hidden by this attribute (see WaitlistBanner), so it
     goes at once rather than at the next page load. */
  document.documentElement.dataset.wlBanner = "off";
}

/* The banner's own dismissal, separate from having joined. */
export const BANNER_DISMISSED_KEY = "navrobotec.waitlistBannerDismissed";

export function dismissBanner(): void {
  try {
    window.localStorage.setItem(BANNER_DISMISSED_KEY, "1");
  } catch {
    /* Dismissed for this page load only. */
  }
}

export function bannerDismissed(): boolean {
  try {
    return window.localStorage.getItem(BANNER_DISMISSED_KEY) !== null;
  } catch {
    return false;
  }
}

export function isWaitlisted(): boolean {
  try {
    return window.localStorage.getItem(WAITLISTED_KEY) !== null;
  } catch {
    return false;
  }
}

/* The popup shows once per visitor: the first time it appears it is recorded
   in localStorage, so a refresh, a new tab or a later visit does not bring it
   back. The in-memory flag still covers a browser that blocks storage, for the
   rest of that page load. */
const POPUP_SEEN_KEY = "navrobotec.waitlist.popup-seen";
let popupShown = false;

export function popupShownThisVisit(): boolean {
  if (popupShown) return true;
  try {
    return window.localStorage.getItem(POPUP_SEEN_KEY) !== null;
  } catch {
    return false;
  }
}

export function markPopupShown(): void {
  popupShown = true;
  try {
    window.localStorage.setItem(POPUP_SEEN_KEY, "1");
  } catch {
    /* Storage blocked: the in-memory flag still applies to this page load. */
  }
}

/* The dialog's heading and lede, shared by the X427 page and the popup so the
   two never describe the offer differently. The offer is exactly: college
   students get a free board, first come first served, for the first 50. */
export const WAITLIST_TITLE = "Join the X427 waitlist";
export const WAITLIST_LEDE =
  "Open to everyone. The first 50 college students on the waitlist receive a free board, first come, first served.";
