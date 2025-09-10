export function getInitialsFromEmail(email?: string | null): string {
  if (!email) return "U"; // Default if no email

  const username = email.split("@")[0];

  const initials = username
    .split(".")
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");

  return initials || "U";
}
