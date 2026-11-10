/* What the browser remembers about the X427 waitlist.
 *
 * Two keys, two lifetimes. `navrobotec.waitlisted` is in localStorage and set
 * once someone has joined (or been told they already had), so the prompt never
 * returns for them. `navrobotec.waitlistPopupShown` is in sessionStorage and
 * set the first time the prompt appears in a visit, so it shows on the first
 * page of a visit and not on the ones after; a new tab or a new visit is a new
 * sessionStorage and shows it again.
 *
 * Every access is wrapped: storage throws in some private modes and with site
 * data blocked, and the site has to work the same without it. */

export const WAITLISTED_KEY = "navrobotec.waitlisted";
export const POPUP_SHOWN_KEY = "navrobotec.waitlistPopupShown";

export function markWaitlisted(): void {
  try {
    window.localStorage.setItem(WAITLISTED_KEY, "1");
  } catch {
    /* Nothing to do: the prompt may show again, which is harmless. */
  }
}

export function isWaitlisted(): boolean {
  try {
    return window.localStorage.getItem(WAITLISTED_KEY) !== null;
  } catch {
    return false;
  }
}

export function popupShownThisVisit(): boolean {
  try {
    return window.sessionStorage.getItem(POPUP_SHOWN_KEY) !== null;
  } catch {
    return false;
  }
}

export function markPopupShown(): void {
  try {
    window.sessionStorage.setItem(POPUP_SHOWN_KEY, "1");
  } catch {
    /* Without sessionStorage the prompt could repeat; see the popup. */
  }
}

/* The dialog's heading and lede, shared by the X427 page and the popup so the
   two never describe the offer differently. The offer is exactly: college
   students get a free board, first come first served, for the first 50. */
export const WAITLIST_TITLE = "Join the X427 waitlist";
export const WAITLIST_LEDE =
  "Open to everyone. The first 50 college students on the waitlist receive a free board, first come, first served.";
