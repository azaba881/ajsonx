import Link from "next/link";
import Image from "next/image";

type ButtonProps = {
  type?: "button" | "submit"; // type devient optionnel
  title: string;
  icon?: string;
  variant: string;
  full?: boolean;
  href?: string; // Ajout d'un lien optionnel
};

const Button = ({ type = "button", title, icon, variant, full, href }: ButtonProps) => {
  const classes = `flexCenter gap-3 rounded-full border ${variant} ${full ? "w-full" : ""}`;

  return href ? (
    <Link href={href} className={classes}>
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <span className="bold-16 whitespace-nowrap cursor-pointer">{title}</span>
    </Link>
  ) : (
    <button type={type} className={classes}>
      {icon && <Image src={icon} alt={title} width={24} height={24} />}
      <span className="bold-16 whitespace-nowrap cursor-pointer">{title}</span>
    </button>
  );
};

export default Button;
