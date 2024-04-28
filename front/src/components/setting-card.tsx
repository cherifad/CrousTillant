type SettingCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function SettingCard({ children, title }: SettingCardProps) {
  return (
    <div>
      <h1 className="mb-4 text-lg font-medium my-4">{title}</h1>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
