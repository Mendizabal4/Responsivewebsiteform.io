// ---------- Editable configuration via Canva Elements SDK ----------
    const defaultConfig = {
      form_title: "User Information Form",
      submit_button_text: "Preview & Submit",
      modal_title: "Confirm Your Details",
      background_color: "#020617",   // BACKGROUND
      surface_color: "#0f172a",      // SECONDARY_SURFACE (card + modal)
      text_color: "#f9fafb",         // TEXT
      primary_action_color: "#6366f1", // PRIMARY_ACTION (main button)
      secondary_action_color: "#64748b", // SECONDARY_ACTION (outline/secondary)
      font_family: "Inter",
      font_size: 16
    };

    function applyConfigToUI(config) {
      const cfg = Object.assign({}, defaultConfig, config || {});
      const baseFont = cfg.font_family || defaultConfig.font_family;
      const baseSize = cfg.font_size || defaultConfig.font_size;
      const fontStack = baseFont + ", system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

      // Elements
      const appRoot = document.getElementById("app-root");
      const cardSurface = document.getElementById("card-surface");
      const headerSection = document.getElementById("header-section");
      const formTitleEl = document.getElementById("form-title");
      const previewButton = document.getElementById("previewButton");
      const inlineMsg = document.getElementById("inline-message");
      const modalEl = document.querySelector("#confirmModal .modal-content");
      const modalHeader = document.querySelector("#confirmModal .modal-header");
      const modalFooter = document.querySelector("#confirmModal .modal-footer");
      const confirmModalLabel = document.getElementById("confirmModalLabel");
      const editBtn = document.getElementById("editBtn");
      const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");

      if (!appRoot) return;

      // Colors
      appRoot.style.backgroundColor = cfg.background_color;
      cardSurface.style.backgroundColor = cfg.surface_color;
      headerSection.style.backgroundColor = cfg.surface_color;

      if (modalEl) {
        modalEl.style.backgroundColor = cfg.surface_color;
      }
      if (modalHeader) {
        modalHeader.style.backgroundColor = cfg.surface_color;
      }
      if (modalFooter) {
        modalFooter.style.backgroundColor = cfg.surface_color;
      }

      // Text color
      document.body.style.color = cfg.text_color;
      formTitleEl.style.color = cfg.text_color;
      if (inlineMsg) inlineMsg.style.color = cfg.text_color;

      // Buttons
      previewButton.style.backgroundColor = cfg.primary_action_color;
      previewButton.style.borderColor = cfg.primary_action_color;

      editBtn.style.borderColor = cfg.secondary_action_color;
      editBtn.style.color = cfg.text_color;
      confirmSubmitBtn.style.backgroundColor = "#16a34a"; // keep success green

      // Font families
      document.body.style.fontFamily = fontStack;
      formTitleEl.style.fontFamily = fontStack;
      confirmModalLabel.style.fontFamily = fontStack;

      // Font sizes proportional
      document.documentElement.style.fontSize = baseSize + "px";
      formTitleEl.style.fontSize = baseSize * 1.5 + "px";
      confirmModalLabel.style.fontSize = baseSize * 1.25 + "px";
      const labels = document.querySelectorAll("label, dt");
      labels.forEach((el) => {
        el.style.fontSize = baseSize * 0.9 + "px";
        el.style.fontFamily = fontStack;
      });
      const smallText = document.querySelectorAll(".form-text, .text-xs, .text-sm, dd, p, .modal-body p");
      smallText.forEach((el) => {
        el.style.fontSize = baseSize * 0.85 + "px";
        el.style.fontFamily = fontStack;
      });

      // Text content from config
      formTitleEl.textContent = cfg.form_title || defaultConfig.form_title;
      previewButton.textContent = cfg.submit_button_text || defaultConfig.submit_button_text;
      confirmModalLabel.textContent = cfg.modal_title || defaultConfig.modal_title;
    }

    // Initialize Canva Element SDK if available
    (function initElementSdk() {
      if (!window.elementSdk) {
        // Still apply defaults if SDK isn't present
        applyConfigToUI(defaultConfig);
        return;
      }

      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (config) => {
          applyConfigToUI(config);
        },
        mapToCapabilities: (config) => {
          const cfg = Object.assign({}, defaultConfig, config || {});
          return {
            recolorables: [
              {
                get: () => cfg.background_color,
                set: (value) => {
                  cfg.background_color = value;
                  window.elementSdk.setConfig({ background_color: value });
                }
              },
              {
                get: () => cfg.surface_color,
                set: (value) => {
                  cfg.surface_color = value;
                  window.elementSdk.setConfig({ surface_color: value });
                }
              },
              {
                get: () => cfg.text_color,
                set: (value) => {
                  cfg.text_color = value;
                  window.elementSdk.setConfig({ text_color: value });
                }
              },
              {
                get: () => cfg.primary_action_color,
                set: (value) => {
                  cfg.primary_action_color = value;
                  window.elementSdk.setConfig({ primary_action_color: value });
                }
              },
              {
                get: () => cfg.secondary_action_color,
                set: (value) => {
                  cfg.secondary_action_color = value;
                  window.elementSdk.setConfig({ secondary_action_color: value });
                }
              }
            ],
            borderables: [],
            fontEditable: {
              get: () => cfg.font_family,
              set: (value) => {
                cfg.font_family = value;
                window.elementSdk.setConfig({ font_family: value });
              }
            },
            fontSizeable: {
              get: () => cfg.font_size,
              set: (value) => {
                cfg.font_size = value;
                window.elementSdk.setConfig({ font_size: value });
              }
            }
          };
        },
        mapToEditPanelValues: (config) => {
          const cfg = Object.assign({}, defaultConfig, config || {});
          return new Map([
            ["form_title", cfg.form_title],
            ["submit_button_text", cfg.submit_button_text],
            ["modal_title", cfg.modal_title]
          ]);
        }
      });
    })();

    // ---------- Form & Modal Logic ----------
    const form = document.getElementById("user-form");
    const inlineMessage = document.getElementById("inline-message");
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordInput = document.getElementById("password");

    // Show/Hide password
    togglePasswordBtn.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePasswordBtn.textContent = isHidden ? "Hide" : "Show";
    });

    // Bootstrap modal instance
    const confirmModalEl = document.getElementById("confirmModal");
    const confirmModal = new bootstrap.Modal(confirmModalEl);

    // Handle form submission -> show modal (do NOT immediately submit)
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Clear any previous message
      inlineMessage.textContent = "";
      inlineMessage.className = "mt-2 text-sm";

      // HTML5 validation
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        inlineMessage.textContent =
          "Please correct the highlighted fields before continuing.";
        inlineMessage.classList.add("text-red-400");
        return;
      }

      // Populate confirmation modal with user input
      document.getElementById("confirmFullName").textContent =
        document.getElementById("fullName").value || "—";
      document.getElementById("confirmEmail").textContent =
        document.getElementById("email").value || "—";
      document.getElementById("confirmGender").textContent =
        document.getElementById("gender").value || "—";
      document.getElementById("confirmContact").textContent =
        document.getElementById("contact").value || "—";
      document.getElementById("confirmUsername").textContent =
        document.getElementById("username").value || "—";

      const pwd = document.getElementById("password").value;
      document.getElementById("confirmPassword").textContent =
        pwd.length > 0 ? "•".repeat(Math.max(6, pwd.length)) : "—";

      // Show modal instead of submitting
      confirmModal.show();
    });

    // Confirm submission from modal
    const confirmSubmitBtn = document.getElementById("confirmSubmitBtn");
    confirmSubmitBtn.addEventListener("click", function () {
      // Here you would normally send data to a server.
      // For your activity, we just simulate submission and reset.
      confirmModal.hide();
      
      // Show success message prominently
      inlineMessage.innerHTML = `
        <div class="alert alert-success d-flex align-items-center shadow-lg" role="alert">
          <svg class="me-2" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
          </svg>
          <div>
            <strong>Successfully Submitted!</strong> Your information has been recorded.
          </div>
        </div>
      `;
      inlineMessage.className = "mt-3";
      
      // Reset form after showing success
      form.reset();
      form.classList.remove("was-validated");
      
      // Scroll to success message
      inlineMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    // Edit button just closes modal so user can change values
    const editBtn = document.getElementById("editBtn");
    editBtn.addEventListener("click", function () {
      confirmModal.hide();
      // Focus the first field to help the user continue editing
      document.getElementById("fullName").focus();
    });