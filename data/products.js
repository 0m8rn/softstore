You are a senior JavaScript engineer working on an existing SoftStore pricing system.

DO NOT change UI, HTML, or CSS.

Only modify pricing logic in app.js.

----------------------------------------
TASK: ADD "0 WARRANTY" OPTION + LOGIC FIX
----------------------------------------

1. Add a new warranty option:

"0 Months" or "No Warranty"

This must be available in all warranty dropdowns.

----------------------------------------
2. PRICING RULE CHANGE (CRITICAL)

If warranty is "0 Months" or "No Warranty":

- Final price MUST equal base price only
- No additional charges
- No multipliers
- No additions from any category rules

----------------------------------------
3. IMPLEMENTATION RULE

Update warranty parsing logic:

- getMonths("No Warranty") = 0
- getMonths("0 Months") = 0

Then modify ALL pricing functions so:

IF warrantyMonths === 0:
    return basePrice (category-specific base only)
    
No other calculations should apply.

----------------------------------------
4. CATEGORY RULES MUST RESPECT THIS

Even if product is:
- Windows
- macOS
- Linux
- Adobe
- Autodesk

If warranty = 0:
- price = base price only

----------------------------------------
5. UI UPDATE (ONLY IF NECESSARY)

Ensure dropdown includes:
- No Warranty

But DO NOT change layout or styling.

----------------------------------------
6. SAFETY RULES

- Do NOT break existing pricing system
- Do NOT modify HTML structure
- Do NOT change CSS
- Only adjust logic in app.js

----------------------------------------
OUTPUT

Return ONLY updated app.js code.
No explanation.
No comments outside code.
