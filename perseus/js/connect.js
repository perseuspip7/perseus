// js/connect.js
// To'liq: thirdweb wallets bilan barcha buttonlarni bir joyda boshqaradi,
// panel open/close, status yangilash va localStorage caching.
// *Iltimos: eski connect.js faylingizni zaxira qiling (masalan connect.js.bak) va keyin almashtiring.*

(function () {
  // --- DOM elementlar ---
  const connectBtn = document.getElementById("connectBtn");
  const sidePanel = document.getElementById("sidePanel");
  const closePanel = document.getElementById("closePanel");
  const panelBackdrop = document.getElementById("panelBackdrop");
  const statusIcon = document.getElementById("statusIcon");
  const statusTitle = document.getElementById("statusTitle");
  const statusText = document.getElementById("statusText");
  const retryBtn = document.getElementById("retryBtn");

  // wallet buttons will be queried inside init() to ensure DOM is ready
  let walletButtons = [];

  // --- yordamchi funksiyalar ---
  function short(addr) {
    return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
  }

  function setStatus(title, text, iconSrc) {
    if (statusTitle) statusTitle.textContent = title;
    if (statusText) statusText.textContent = text;
    if (statusIcon && iconSrc) statusIcon.src = iconSrc;
  }

  // --- thirdweb Wallets init ---
  // `window.thirdwebWallets` UMD globalini ishlatamiz (siz HTMLda unpkg orqali qo'shgansiz)
  function createThirdwebWallets() {
    // UMD exposes various helpers under window.thirdwebWallets
    const w = window.thirdwebWallets || {};
    return {
      metamask: (w.metamaskWallet ? w.metamaskWallet() : null),
      coinbase: (w.coinbaseWallet ? w.coinbaseWallet() : null),
      walletConnect: (w.walletConnect ? w.walletConnect() : null),
      trust: (w.trustWallet ? w.trustWallet() : null),
      okx: (w.okxWallet ? w.okxWallet() : null),
      rainbow: (w.rainbowWallet ? w.rainbowWallet() : null),
      imtoken: (w.imTokenWallet ? w.imTokenWallet() : null),
      ledger: (w.ledgerWallet ? w.ledgerWallet() : null),
      browser: (w.localWallet ? w.localWallet() : null)
    };
  }

  // --- connect logic per-wallet ---
  async function connectWith(walletInstance) {
    if (!walletInstance) {
      alert("Ushbu hamyon uchun qo'llab-quvvatlash topilmadi.");
      return;
    }

    try {
      setStatus("Opening wallet...", "Please approve the connection in your wallet.");
      // walletInstance.connect() — thirdweb wallet UMD API usuli bo'lishi kerak
      const connection = await walletInstance.connect();
      // thirdweb wallets UMD may return account info in different shapes
      // Try common patterns:
      let address = null;
      if (connection && connection.accounts && connection.accounts[0] && connection.accounts[0].address) {
        address = connection.accounts[0].address;
      } else if (typeof walletInstance.getAddress === "function") {
        try { address = await walletInstance.getAddress(); } catch (e) { /* ignore */ }
      } else if (connection && connection[0]) {
        address = connection[0];
      }

      if (!address) {
        // as a fallback, try provider.selectedAddress (injected)
        if (window.ethereum && window.ethereum.selectedAddress) address = window.ethereum.selectedAddress;
      }

      if (!address) throw new Error("Address not found after connect");

      // UI update
      setStatus("Wallet Connected ✅", short(address), "assets/metamask.svg");
      if (connectBtn && connectBtn.querySelector("span")) connectBtn.querySelector("span").textContent = short(address);

      // cache
      localStorage.setItem("connectedWallet", address);

      console.log("Connected:", { address, connection });

      // Optionally: you can now call other logic (e.g., fetch token balance / rank)
      // Example placeholder: window.afterWalletConnected && window.afterWalletConnected(address, walletInstance);

      // Close panel shortly
      setTimeout(() => {
        sidePanel && sidePanel.classList.add("hidden");
        sidePanel && sidePanel.classList.remove("active");
      }, 600);

    } catch (err) {
      console.error("connectWith error:", err);
      setStatus("Connection failed", err.message || String(err));
      retryBtn && retryBtn.classList.remove("hidden");
      alert("Ulanishda xatolik: " + (err.message || err));
    }
  }

  // --- match button text to wallet instance ---
  function pickWalletInstanceByButtonText(wallets, btn) {
    const txt = (btn.innerText || btn.textContent || "").trim().toLowerCase();
    // prefer data-wallet attribute if present
    const dataName = btn.getAttribute("data-wallet");
    if (dataName) {
      const key = dataName.trim().toLowerCase();
      return wallets[key] || null;
    }

    if (txt.includes("metamask")) return wallets.metamask;
    if (txt.includes("browser")) return wallets.browser;
    if (txt.includes("coinbase")) return wallets.coinbase;
    if (txt.includes("trust")) return wallets.walletConnect || wallets.trust;
    if (txt.includes("ledger")) return wallets.ledger || wallets.walletConnect;
    if (txt.includes("rainbow")) return wallets.walletConnect || wallets.rainbow;
    if (txt.includes("imtoken") || txt.includes("im token")) return wallets.walletConnect || wallets.imtoken;
    if (txt.includes("okx")) return wallets.walletConnect || wallets.okx;
    // fallback: walletConnect
    return wallets.walletConnect || null;
  }

  // --- main init ---
  async function init() {
    // Basic UI wiring (open/close panel)
    if (connectBtn) {
      connectBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sidePanel && sidePanel.classList.remove("hidden");
        sidePanel && sidePanel.classList.add("active");
        // reset status
        setStatus("Select a wallet", "Choose a wallet from the list on the left to connect.", "assets/metamask.svg");
        retryBtn && retryBtn.classList.add("hidden");
      });
    }
    if (closePanel) closePanel.addEventListener("click", () => {
      sidePanel && sidePanel.classList.add("hidden");
      sidePanel && sidePanel.classList.remove("active");
    });
    if (panelBackdrop) panelBackdrop.addEventListener("click", () => {
      sidePanel && sidePanel.classList.add("hidden");
      sidePanel && sidePanel.classList.remove("active");
    });

    // Create wallet instances
    const wallets = createThirdwebWallets();

    // Query wallet buttons now DOM is ready
    walletButtons = Array.from(document.querySelectorAll(".wallet-btn"));

    // Attach click handlers to each .wallet-btn
    walletButtons.forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        // disable to prevent double clicks
        btn.disabled = true;
        setStatus("Preparing connection", "Opening the selected wallet...");

        // Prefer thirdweb wallet instance, otherwise fallback to injected provider
        let walletInstance = pickWalletInstanceByButtonText(wallets, btn);
        if (!walletInstance) {
          const dataName = (btn.getAttribute('data-wallet') || '').toLowerCase();
          // 1) Injected provider detection by known flags (Coinbase, Trust, imToken, OKX)
          const hasEthereum = !!window.ethereum;

          const canUseInjected = (nameCheck) => {
            if (!hasEthereum) return false;
            const eth = window.ethereum;
            if (nameCheck === 'metamask') return !!eth.isMetaMask;
            if (nameCheck === 'browser') return true; // generic
            if (nameCheck === 'coinbase') return !!eth.isCoinbaseWallet;
            if (nameCheck === 'trust') return !!eth.isTrust;
            if (nameCheck === 'imtoken') return !!(window.imToken || eth.isImToken);
            if (nameCheck === 'okx') return !!eth.isOKXWallet || !!eth.isOkxWallet;
            return false;
          };

          if (canUseInjected(dataName)) {
            // create small shim that uses the injected provider
            walletInstance = {
              connect: async () => {
                // For injected wallets we request accounts
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                return accounts;
              },
              getAddress: async () => {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                return accounts && accounts[0];
              }
            };
          } else {
            // If it's a WalletConnect-only or hardware wallet (ledger/rainbow), provide guidance
            const walletNeedsWC = ['walletconnect', 'rainbow', 'ledger', 'okx', 'imtoken'].includes(dataName);
            if (walletNeedsWC) {
              setStatus("Hamyon mavjud emas", "Ushbu hamyon brauzer kengaytmasi orqali o'rnatilmagan. WalletConnect yoki mobil hamyonni ishlating.");
              alert("Ushbu hamyon uchun qo'llab-quvvatlash topilmadi. Iltimos, mos hamyon ilovasini o'rnating yoki WalletConnect orqali ulang.");
              btn.disabled = false;
              return; // stop — yo'q wallet
            }

            // Last-resort: if any injected provider exists, try it as generic
            if (hasEthereum) {
              walletInstance = {
                connect: async () => {
                  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                  return accounts;
                },
                getAddress: async () => {
                  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                  return accounts && accounts[0];
                }
              };
            } else {
              setStatus("Hamyon topilmadi", "Siz tanlagan hamyon brauzerda yo'q. Mobil ilovani yoki WalletConnect QR kodni ishlating.");
              alert("Ushbu hamyon uchun qo'llab-quvvatlash topilmadi. Iltimos, mos hamyonni o'rnating yoki telefoningizdagi WalletConnect QR funksiyasini ishlating.");
              btn.disabled = false;
              return;
            }
          }
        }

        await connectWith(walletInstance);
        btn.disabled = false;
      });
    });

    // Retry button
    if (retryBtn) {
      retryBtn.addEventListener("click", () => {
        retryBtn.classList.add("hidden");
        setStatus("Select a wallet", "Choose a wallet from the list on the left to connect.", "assets/metamask.svg");
      });
    }

    // Auto-restore UI from cached address (no auto-connect)
    const saved = localStorage.getItem("connectedWallet");
    if (saved && connectBtn && connectBtn.querySelector("span")) {
      connectBtn.querySelector("span").textContent = short(saved);
      setStatus("Restored", short(saved));
    }
  }

  // Start when DOM ready
  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);

})();
