export type PublicHeaderController = {
  closeMenu: () => void;
  destroy: () => void;
};

type HeaderRoot = HTMLElement & { __etailPublicHeader?: PublicHeaderController };

/** Self-contained so the same controller can bind during HTML parsing and hydration. */
export function installPublicHeader(root: HTMLElement): PublicHeaderController {
  const ownedRoot = root as HeaderRoot;
  if (ownedRoot.__etailPublicHeader) return ownedRoot.__etailPublicHeader;

  const toggle = root.querySelector<HTMLButtonElement>(".header-menu-toggle")!;
  const menu = root.querySelector<HTMLElement>("#public-header-menu")!;
  const inner = root.querySelector<HTMLElement>(".header-inner")!;
  const navigation = root.querySelector<HTMLElement>(".public-navigation")!;
  const desktop = window.matchMedia("(min-width: 960px)");
  let wasDesktop = desktop.matches;
  let open = false;
  let focusedControl: HTMLElement | null = null;
  let pointerInteraction = false;
  let bodyOverflow = "";
  let htmlOverflow = "";
  let background: { item: HTMLElement; inert: boolean }[] = [];
  let backgroundObserver: MutationObserver | null = null;

  function closeDisclosures() {
    navigation.querySelectorAll<HTMLDetailsElement>("details[open]").forEach(item => { item.open = false; });
  }

  function protectBackground() {
    document.querySelectorAll<HTMLElement>("main, footer, .skip-link").forEach(item => {
      if (root.contains(item) || background.some(record => record.item === item)) return;
      background.push({ item, inert: item.inert });
      item.inert = true;
    });
  }

  function setOpen(next: boolean) {
    if (next === open) return;
    open = next;
    root.classList.toggle("is-menu-open", open);
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector("path")!.setAttribute("d", open ? "m6 6 12 12M6 18 18 6" : "M4 7h16M4 17h16");
    if (open) {
      inner.setAttribute("role", "dialog");
      inner.setAttribute("aria-modal", "true");
      inner.setAttribute("aria-label", "Site menu");
      bodyOverflow = document.body.style.overflow;
      htmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      protectBackground();
      // A first tap can arrive while the parser is still adding the page/footer.
      backgroundObserver = new MutationObserver(protectBackground);
      backgroundObserver.observe(document.body, { childList: true, subtree: true });
    } else {
      inner.removeAttribute("role");
      inner.removeAttribute("aria-modal");
      inner.removeAttribute("aria-label");
      backgroundObserver?.disconnect();
      backgroundObserver = null;
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      background.forEach(record => { record.item.inert = record.inert; });
      background = [];
    }
  }

  function closeMenu() {
    closeDisclosures();
    setOpen(false);
  }

  function pointer() { pointerInteraction = true; }
  function keyboard() { pointerInteraction = false; }

  function click(event: MouseEvent) {
    if (!(event.target instanceof Element)) return;
    const control = event.target.closest<HTMLElement>("a[href], button");
    if (!control || !root.contains(control)) return;
    if (control === toggle) {
      if (open) closeMenu(); else setOpen(true);
      // Safari does not focus buttons on pointer activation.
      toggle.focus({ preventScroll: true });
    } else if (control.matches(".public-nav-back")) {
      const disclosure = navigation.querySelector<HTMLDetailsElement>("details[open]");
      if (!disclosure) return;
      disclosure.open = false;
      disclosure.querySelector("summary")?.focus();
    } else if (control.matches("a[href]") && (navigation.contains(control) || control.matches(".brand-link"))) {
      focusedControl = null;
      closeMenu();
    }
  }

  function closeOutside(event: MouseEvent) {
    if (!(event.target instanceof Node)) return;
    if (!navigation.contains(event.target)) closeDisclosures();
    if (open && !root.contains(event.target)) {
      focusedControl = null;
      closeMenu();
    }
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === "Escape" && event.target instanceof Node && navigation.contains(event.target)) {
      const disclosure = navigation.querySelector<HTMLDetailsElement>("details[open]");
      if (disclosure) {
        event.preventDefault();
        event.stopPropagation();
        disclosure.open = false;
        disclosure.querySelector("summary")?.focus();
        return;
      }
    }
    if (!open || event.key !== "Tab") return;
    const controls = Array.from(root.querySelectorAll<HTMLElement>("a[href], button, summary"))
      .filter(item => item.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  function closeOnEscape(event: KeyboardEvent) {
    if (!open || event.key !== "Escape" || event.defaultPrevented) return;
    event.preventDefault();
    closeMenu();
    toggle.focus({ preventScroll: true });
  }

  function focus(event: FocusEvent) {
    if (event.target instanceof HTMLElement) focusedControl = event.target;
  }

  function blur(event: FocusEvent) {
    if (event.relatedTarget instanceof Node && root.contains(event.relatedTarget) || pointerInteraction) return;
    closeDisclosures();
    // CSS may hide a focused control before the breakpoint event is delivered.
    if (!event.relatedTarget && event.target instanceof HTMLElement && !event.target.getClientRects().length) return;
    focusedControl = null;
    setOpen(false);
  }

  function closeOnBreakpointChange() {
    if (desktop.matches === wasDesktop) return;
    wasDesktop = desktop.matches;
    const active = document.activeElement;
    const previous = focusedControl;
    const focused = active instanceof HTMLElement && root.contains(active) ? active
      : active === document.body && previous && root.contains(previous) && !previous.getClientRects().length ? previous : null;
    const destination = desktop.matches
      ? focused?.matches(".header-start-now")
        ? root.querySelector<HTMLElement>(".header-sign-in")
        : focused === toggle || focused?.matches(".public-nav-back")
          ? navigation.querySelector<HTMLElement>("details[open] summary") ?? navigation.querySelector<HTMLElement>("summary.is-current") ?? navigation.querySelector<HTMLElement>(":scope > a[aria-current]") ?? navigation.querySelector<HTMLElement>("summary") ?? root.querySelector<HTMLElement>(".brand-link")
          : null
      : focused && menu.contains(focused) ? toggle : null;
    if (!desktop.matches) closeDisclosures();
    setOpen(false);
    if (destination?.getClientRects().length) destination.focus({ preventScroll: true });
  }

  document.addEventListener("pointerdown", pointer, true);
  document.addEventListener("keydown", keyboard, true);
  document.addEventListener("click", closeOutside);
  document.addEventListener("keydown", closeOnEscape);
  root.addEventListener("click", click);
  root.addEventListener("keydown", keydown);
  root.addEventListener("focusin", focus);
  root.addEventListener("focusout", blur);
  desktop.addEventListener("change", closeOnBreakpointChange);
  window.addEventListener("resize", closeOnBreakpointChange);

  const controller = {
    closeMenu,
    destroy() {
      closeMenu();
      document.removeEventListener("pointerdown", pointer, true);
      document.removeEventListener("keydown", keyboard, true);
      document.removeEventListener("click", closeOutside);
      document.removeEventListener("keydown", closeOnEscape);
      root.removeEventListener("click", click);
      root.removeEventListener("keydown", keydown);
      root.removeEventListener("focusin", focus);
      root.removeEventListener("focusout", blur);
      desktop.removeEventListener("change", closeOnBreakpointChange);
      window.removeEventListener("resize", closeOnBreakpointChange);
      delete ownedRoot.__etailPublicHeader;
    },
  };
  ownedRoot.__etailPublicHeader = controller;
  return controller;
}

export const publicHeaderBootstrap = `(${installPublicHeader.toString()})(document.currentScript.closest("header"));`;
