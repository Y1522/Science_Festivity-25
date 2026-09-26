// Full-page starfield backdrop (planets + gold stars) for the booths pages.
// Renders behind everything: drop it inside the page's root div.
import bg from '../assets/booths-bg.png'

export default function StarfieldBackdrop({ dim = 0.5 }: { dim?: number }) {
  return (
    <>
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* dark veil so neon panels/markers keep their contrast */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: `rgba(6,8,18,${dim})` }}
      />
    </>
  )
}