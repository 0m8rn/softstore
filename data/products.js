const DEFAULT_PRODUCTS = [
  {
    id: "windows",
    name: "Windows",
    category: "os",
    basePrice: 10,
    popular: true,
    versions: ["Windows 11", "Windows 10", "Windows 7", "Windows Server"],
    image: "images/windows11.webp"
  },
  {
    id: "macos",
    name: "macOS",
    category: "os",
    basePrice: 12,
    popular: false,
    versions: ["Ventura", "Monterey", "Big Sur"],
    image: "images/MacOS.png"
  },
  {
    id: "kali-linux",
    name: "Kali Linux",
    category: "os",
    basePrice: 25,
    popular: true,
    versions: ["Kali Linux"],
    image: "images/kali-linux.png"
  },
  {
    id: "linux",
    name: "Linux",
    category: "os",
    basePrice: 8,
    popular: false,
    versions: ["Ubuntu", "Debian", "Fedora", "Arch", "Ubuntu Server"],
    image: "images/linux.png"
  },
  {
    id: "photoshop",
    name: "Photoshop",
    category: "adobe",
    basePrice: 12,
    popular: true,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/photoshop.png"
  },
  {
    id: "premiere-pro",
    name: "Premiere Pro",
    category: "adobe",
    basePrice: 13,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/premiere-pro.png"
  },
  {
    id: "after-effects",
    name: "After Effects",
    category: "adobe",
    basePrice: 13,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/after-effects.png"
  },
  {
    id: "illustrator",
    name: "Illustrator",
    category: "adobe",
    basePrice: 12,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/illustrator.png"
  },
  {
    id: "indesign",
    name: "InDesign",
    category: "adobe",
    basePrice: 11,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/indesign.png"
  },
  {
    id: "animate",
    name: "Animate",
    category: "adobe",
    basePrice: 11,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/animate.png"
  },
  {
    id: "acrobat",
    name: "Acrobat",
    category: "adobe",
    basePrice: 10,
    popular: false,
    versions: ["2023", "2024", "2025", "2026"],
    image: "images/acrobat.png"
  },
  {
    id: "autocad",
    name: "AutoCAD",
    category: "autodesk",
    basePrice: 15,
    popular: true,
    versions: ["2022", "2023", "2024", "2025"],
    image: "images/autocad.png"
  },
  {
    id: "3ds-max",
    name: "3ds Max",
    category: "autodesk",
    basePrice: 15,
    popular: false,
    versions: ["2022", "2023", "2024", "2025"],
    image: "images/3ds-max.png"
  },
  {
    id: "revit",
    name: "Revit",
    category: "autodesk",
    basePrice: 14,
    popular: false,
    versions: ["2022", "2023", "2024", "2025"],
    image: "images/revit.png"
  },
  {
    id: "civil-3d",
    name: "Civil 3D",
    category: "autodesk",
    basePrice: 14,
    popular: false,
    versions: ["2022", "2023", "2024", "2025"],
    image: "images/civil-3d.png"
  },
  {
    id: "office-professional",
    name: "Office Professional",
    category: "office",
    basePrice: 11,
    popular: true,
    versions: ["2019", "2021", "2024"],
    image: "images/office-professional.png"
  },
  {
    id: "sketchup",
    name: "SketchUp",
    category: "sketchup",
    basePrice: 9,
    popular: false,
    versions: ["2022", "2023", "2024"],
    image: "images/sketchup.png"
  }
];

(function exposeProductStore(global) {
  function getActiveProducts() {
    try {
      const saved = localStorage.getItem("softstore_products");
      if (!saved) {
        return [...DEFAULT_PRODUCTS];
      }
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [...DEFAULT_PRODUCTS];
    } catch (_error) {
      return [...DEFAULT_PRODUCTS];
    }
  }

  global.ProductStore = {
    getActiveProducts
  };
})(window);
