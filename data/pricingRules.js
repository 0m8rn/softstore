const DEFAULT_PRICING_RULES = {
  windows: {
    desktopBase: 15,
    serverBase: 25,
    monthlyWarrantyAdd: 10
  },
  macos: {
    base: 25,
    yearlyWarrantyAdd: 10
  },
  linux: {
    serverBase: 50,
    serverMonthlyWarrantyAdd: 10,
    kaliBase: 25,
    kaliPerSixMonthsAdd: 5,
    distroBase: 25,
    distroPerYearAdd: 5
  },
  /** Adobe, Autodesk, Office, SketchUp — not OS */
  general: {
    base: 15,
    perSixMonthsAdd: 10
  }
};

(function exposePricingEngine(global) {
  function getMonths(warranty) {
    if (!warranty || warranty === "No Warranty") {
      return 0;
    }
    const value = parseInt(warranty, 10);
    if (warranty.includes("Year")) {
      return value * 12;
    }
    return Number.isNaN(value) ? 0 : value;
  }

  function getYears(warranty) {
    return getMonths(warranty) / 12;
  }

  function getActivePricingRules() {
    try {
      const saved = localStorage.getItem("softstore_pricing_rules");
      if (!saved) {
        return { ...DEFAULT_PRICING_RULES };
      }
      return { ...DEFAULT_PRICING_RULES, ...JSON.parse(saved) };
    } catch (_error) {
      return { ...DEFAULT_PRICING_RULES };
    }
  }

  function getCalculatedPrice(product, version, warranty, pricingRules) {
    const rules = pricingRules || getActivePricingRules();
    const name = product.name.toLowerCase();
    const versionLabel = version.toLowerCase();
    const months = getMonths(warranty);
    const years = getYears(warranty);

    if (name.includes("windows")) {
      const base = versionLabel.includes("server")
        ? rules.windows.serverBase
        : rules.windows.desktopBase;
      return base + months * rules.windows.monthlyWarrantyAdd;
    }

    if (name.includes("macos")) {
      return rules.macos.base + years * rules.macos.yearlyWarrantyAdd;
    }

    if (name.includes("linux")) {
      if (versionLabel.includes("server")) {
        return rules.linux.serverBase + months * rules.linux.serverMonthlyWarrantyAdd;
      }
      if (versionLabel.includes("kali")) {
        const sixMonthUnits = Math.ceil(months / 6);
        return rules.linux.kaliBase + sixMonthUnits * rules.linux.kaliPerSixMonthsAdd;
      }
      return rules.linux.distroBase + years * rules.linux.distroPerYearAdd;
    }

    if (
      product.category === "adobe" ||
      product.category === "autodesk" ||
      product.category === "office" ||
      product.category === "sketchup"
    ) {
      const base = rules.general.base ?? 15;
      const perSix = rules.general.perSixMonthsAdd ?? 10;
      return base + (months / 6) * perSix;
    }

    return product.basePrice;
  }

  global.PricingEngine = {
    getMonths,
    getYears,
    getCalculatedPrice,
    getActivePricingRules
  };
})(window);
