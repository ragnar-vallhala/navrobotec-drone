/* The rotor, inline.
 *
 * public/logo.svg is a 3508x2480 canvas with the mark occupying 46% of its
 * width and a white rectangle behind it — so at any given box the visible
 * mark was less than half the size it looked like it should be, and it needed
 * `filter: invert(1)` to stop the white background showing.
 *
 * This is the same six blades on a square viewBox cropped to their own
 * bounds, filled with currentColor. It sizes predictably, it takes the colour
 * of the text beside it, and it needs no filter in either theme.
 */
export default function Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="964 376 1645 1645"
      fill="currentColor"
      aria-hidden
      focusable="false"
      className={className}
    >
      <path d="M 1723.4,783.251 L 1705.15,727.093 L 1657.38,692.386 L 1566.15,411.598 L 1583.5,387.712 L 1965.67,665.371 L 2075.15,1002.32 L 2057.79,1026.2 Z" />
      <path d="M 2357.7,613.716 L 2387.06,616.802 L 2337.69,1086.6 L 2100.62,1349.88 L 2071.26,1346.8 L 2114.47,935.726 L 2153.98,891.845 L 2160.15,833.121 Z" />
      <path d="M 1414.87,776.936 L 1761.41,850.596 L 1773.42,877.567 L 1395.82,1045.68 L 1338.06,1033.41 L 1284.12,1057.43 L 995.334,996.042 L 983.325,969.07 Z" />
      <path d="M 1236.08,1309.73 L 1473.15,1046.44 L 1502.51,1049.53 L 1459.3,1460.6 L 1419.79,1504.48 L 1413.62,1563.2 L 1176.55,1826.49 L 1147.19,1823.4 Z" />
      <path d="M 1850.37,1622.79 L 1868.63,1678.95 L 1916.4,1713.66 L 2007.63,1994.44 L 1990.27,2018.33 L 1608.11,1740.67 L 1498.62,1403.72 L 1515.98,1379.84 Z" />
      <path d="M 2159.9,1348.9 L 2578.45,1409.98 L 2590.46,1436.95 L 2212.86,1605.06 L 2155.1,1592.79 L 2101.16,1616.81 L 1812.37,1555.42 L 1800.36,1528.45 Z" />
    </svg>
  );
}
