# UI/UX Wireframes

## 1. Request Help Screen (User View)
*Emphasis on AI Processing Feedback*

```text
+---------------------------------------+
|  < Back          Request Help     [=] |
+---------------------------------------+
|                                       |
|  [ Your Location (Auto-detected)  ]   |
|  Current: 12.9716 N, 77.5946 E        |
|                                       |
|  [ Description of Emergency       ]   |
|  | "We are trapped in a low-lying |   |
|  |  area, water rising fast.      |   |
|  |  Need rescue boat immediately!"|   |
|  +--------------------------------+   |
|                                       |
|  [ Category (Optional) v ]            |
|                                       |
|  [ SUBMIT REQUEST ]                   |
|                                       |
+---------------------------------------+
|          AI ANALYSIS                  |
|                                       |
|  [Status: Processing...]              |
|  (Scanning keywords...)               |
|                                       |
|  v (After 2 seconds)                  |
|                                       |
|  [ ! CRITICAL PRIORITY ! ]            |
|  (Red Badge caused by "trapped",      |
|   "rescue")                           |
|                                       |
|  Predicted Need: Rescue Team          |
+---------------------------------------+
|  [Bottom Nav: Home | Req | Profile]   |
+---------------------------------------+
```

## 2. NGO Dashboard (Admin View)
*Emphasis on Priority Sorting*

```text
+---------------------------------------+
|  Dashboard        [Filter: All]   [=] |
+---------------------------------------+
|  Stats: 12 Critical | 45 High | 20 Low|
+---------------------------------------+
|                                       |
|  INCOMING REQUESTS (Sorted by AI)     |
|                                       |
|  [!] CRITICAL - 2 mins ago            |
|  Loc: Sector 4, Indiranagar           |
|  "Medical emergency, cardiac..."      |
|  [ ACCEPT ]  [ VIEW MAP ]             |
|                                       |
|  [!] CRITICAL - 5 mins ago            |
|  Loc: Domlur Layout                   |
|  "House collapsed, 2 people..."       |
|  [ ACCEPT ]  [ VIEW MAP ]             |
|                                       |
|  [H] HIGH - 15 mins ago               |
|  Loc: MG Road                         |
|  "Food and Water needed for 10"       |
|  [ ACCEPT ]  [ VIEW MAP ]             |
|                                       |
+---------------------------------------+
```
