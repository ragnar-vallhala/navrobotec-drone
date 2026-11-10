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

/* In memory on purpose, not in sessionStorage: sessionStorage survives a
   reload, and a reload should bring the prompt back. A module variable lives
   exactly as long as the page load: it is reset by a refresh, a new tab or a
   hard navigation to another URL, and kept across client-side (Next Link)
   navigation, which does not reload the page. */
let popupShown = false;

export function popupShownThisVisit(): boolean {
  return popupShown;
}

export function markPopupShown(): void {
  popupShown = true;
}

/* The dialog's heading and lede, shared by the X427 page and the popup so the
   two never describe the offer differently. The offer is exactly: college
   students get a free board, first come first served, for the first 50. */
export const WAITLIST_TITLE = "Join the X427 waitlist";
export const WAITLIST_LEDE =
  "Open to everyone. The first 50 college students on the waitlist receive a free board, first come, first served.";
