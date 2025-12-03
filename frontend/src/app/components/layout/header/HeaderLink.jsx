export default function HeaderLink({ label, href }) {
  return (
    <a href={href} style={{ marginRight: 15 }}>
      {label}
    </a>
  );
}
